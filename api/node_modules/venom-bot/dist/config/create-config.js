"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = void 0;
const puppeteer_config_1 = require("./puppeteer.config");
exports.defaultOptions = {
    folderNameToken: 'tokens',
    mkdirFolderToken: '',
    headless: 'old',
    devtools: false,
    debug: false,
    logQR: true,
    browserWS: '',
    browserArgs: puppeteer_config_1.puppeteerConfig.chromiumArgs,
    addBrowserArgs: [],
    puppeteerOptions: {},
    disableSpins: false,
    disableWelcome: true,
    updatesLog: true,
    autoClose: 120000,
    createPathFileToken: true,
    waitForLogin: true,
    BrowserFetcher: true,
    forceConnect: false,
    attemptsForceConnectLoad: 5,
    forceConnectTime: 5000,
    addProxy: [],
    browserPathExecutable: null,
    forceWebpack: false,
    webVersion: false
};
//# sourceMappingURL=create-config.js.map