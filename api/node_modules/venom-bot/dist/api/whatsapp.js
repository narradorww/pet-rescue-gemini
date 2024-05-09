"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whatsapp = void 0;
const controls_layer_1 = require("./layers/controls.layer");
const decrypt_1 = require("./helpers/decrypt");
const WAuserAgente_1 = require("../config/WAuserAgente");
const axios_1 = __importDefault(require("axios"));
const path = __importStar(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
class Whatsapp extends controls_layer_1.ControlsLayer {
    browser;
    page;
    constructor(browser, page, session, options) {
        super(browser, page, session, options);
        this.browser = browser;
        this.page = page;
        this.page.on('load', async () => {
            await page
                .waitForSelector('#app .two', { visible: true })
                .catch(() => { });
            await this.initService();
            await this.addChatWapi();
        });
    }
    async initService() {
        try {
            // Allow backwards compatibility without specifying any specific options
            // The assumption is that WA switched away from Webpack at/after 2.3
            // This can be removed when all browsers have rolled over to new non-webpack version
            let useWebpack = false;
            if (this.options.forceWebpack === false &&
                this.options.webVersion === false) {
                const actualWebVersion = await this.page.evaluate(() => {
                    return window['Debug'] && window['Debug'].VERSION
                        ? window['Debug'].VERSION
                        : '';
                });
                const versionNumber = parseFloat(actualWebVersion);
                useWebpack = versionNumber < 2.3;
            }
            if (this.options.forceWebpack === false && !useWebpack) {
                await this.page.evaluate(() => {
                    window['__debug'] = eval("require('__debug');");
                });
            }
            else {
                await this.page
                    .waitForFunction('webpackChunkwhatsapp_web_client.length')
                    .catch();
            }
            let js = await promises_1.default.readFile(require.resolve(path.join(__dirname, '../lib/wapi/', 'wapi.js')), 'utf-8');
            await this.page.evaluate(js);
            await this.initialize();
            let middleware_script = await promises_1.default.readFile(require.resolve(path.join(__dirname, '../lib/middleware', 'middleware.js')), 'utf-8');
            await this.page.evaluate(middleware_script);
        }
        catch (e) {
            console.log(e);
        }
    }
    async addChatWapi() {
        await this.page.evaluate(() => WAPI.addChatWapi());
    }
    /**
     * Decrypts message file
     * @param data Message object
     * @returns Decrypted file buffer (null otherwise)
     */
    async downloadFile(data) {
        return await this.page.evaluate((data) => WAPI.downloadFile(data), data);
    }
    /**
     * Download and returns the media content in base64 format
     * @param messageId Message ou id
     * @returns Base64 of media
     */
    async downloadMedia(messageId) {
        if (typeof messageId !== 'string') {
            messageId = messageId.id;
        }
        const result = await this.page
            .evaluate((messageId) => WAPI.downloadMedia(messageId).catch((e) => ({
            __error: e
        })), messageId)
            .catch(() => undefined);
        if (typeof result === 'object' && result.__error) {
            throw result.__error;
        }
        return result;
    }
    /**
     * Get the puppeteer page instance
     * @returns The Whatsapp page
     */
    get waPage() {
        return this.page;
    }
    /**
     * Clicks on 'use here' button (When it get unlaunched)
     * This method tracks the class of the button
     * Whatsapp web might change this class name over the time
     * Dont rely on this method
     */
    async useHere() {
        return await this.page.evaluate(() => WAPI.takeOver());
    }
    /**
     * Logout whastapp
     * @returns boolean
     */
    async logout() {
        return await this.page.evaluate(() => WAPI.logout());
    }
    /**
     * Closes page and browser
     * @internal
     */
    async close() {
        try {
            if (!this.page.isClosed()) {
                await this.page.close();
                await this.browser.close();
                return true;
            }
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Get message by id
     * @param messageId string
     * @returns Message object
     */
    async getMessageById(messageId) {
        return (await this.page.evaluate((messageId) => WAPI.getMessageById(messageId), messageId));
    }
    /**
     * Decrypts message file
     * @param message Message object
     * @returns Decrypted file buffer (null otherwise)
     */
    async decryptFile(message) {
        const options = (0, decrypt_1.makeOptions)(WAuserAgente_1.useragentOverride);
        message.clientUrl =
            message.clientUrl !== undefined
                ? message.clientUrl
                : message.deprecatedMms3Url;
        if (!message.clientUrl) {
            throw new Error('message is missing critical data needed to download the file.');
        }
        let haventGottenImageYet = true, res;
        try {
            while (haventGottenImageYet) {
                res = await axios_1.default.get(message.clientUrl.trim(), options);
                if (res.status == 200) {
                    haventGottenImageYet = false;
                }
                else {
                    await (0, decrypt_1.timeout)(2000);
                }
            }
        }
        catch (error) {
            console.error(error);
            throw 'Error trying to download the file.';
        }
        const buff = Buffer.from(res.data, 'binary');
        return (0, decrypt_1.magix)(buff, message.mediaKey, message.type, message.size);
    }
}
exports.Whatsapp = Whatsapp;
//# sourceMappingURL=whatsapp.js.map