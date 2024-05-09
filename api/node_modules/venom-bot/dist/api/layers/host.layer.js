"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostLayer = void 0;
const create_config_1 = require("../../config/create-config");
const helpers_1 = require("../helpers");
const auth_1 = require("../../controllers/auth");
const sleep_1 = require("../../utils/sleep");
const spinnies_1 = require("../../utils/spinnies");
class HostLayer {
    browser;
    page;
    session;
    options;
    spinnies = (0, spinnies_1.getSpinnies)();
    spinStatus = {
        apiInject: '',
        autoCloseRemain: 0,
        previousText: '',
        previousStatus: null,
        state: ''
    };
    autoCloseInterval = null;
    statusFind = null;
    constructor(browser, page, session, options) {
        this.browser = browser;
        this.page = page;
        this.session = session;
        this.options = { ...create_config_1.defaultOptions, ...options };
        // this.spin('Initializing...', 'spinning');
        //this._initialize(this.page);
    }
    spin(text, status) {
        const name = `session-${this.session}`;
        text = text || this.spinStatus.previousText;
        this.spinStatus.previousText = text;
        status =
            status || this.spinStatus.previousStatus;
        this.spinStatus.previousStatus = status;
        let fullText = `[instance: ${this.session}`;
        // if (this.spinStatus.state) {
        //   fullText += `, ${this.spinStatus.state}`;
        // }
        fullText += `]: ${text}`;
        let prevText = '';
        try {
            prevText = this.spinnies.pick(name).text;
        }
        catch (error) {
            this.spinnies.add(name, { text: fullText, status });
            prevText = fullText;
        }
        if (prevText !== fullText) {
            this.spinnies.update(name, {
                text: fullText,
                status
            });
        }
    }
    // public async _initialize(page: Page) {
    //   this.spinStatus.apiInject = 'injecting';
    //   await injectApi(page)
    //     .then(() => {
    //       this.spinStatus.apiInject = 'injected';
    //     })
    //     .catch(() => {
    //       this.spinStatus.apiInject = 'failed';
    //     });
    // }
    tryAutoClose() {
        if (this.options.autoClose > 0 &&
            !this.autoCloseInterval &&
            !this.page.isClosed()) {
            this.statusFind && this.statusFind('autocloseCalled', this.session);
            this.page.close().catch(() => { });
            this.browser.close().catch(() => { });
        }
    }
    startAutoClose() {
        if (this.options.autoClose > 0 && !this.autoCloseInterval) {
            let remain = this.options.autoClose;
            try {
                this.autoCloseInterval = setInterval(() => {
                    if (this.page.isClosed()) {
                        this.cancelAutoClose();
                        return;
                    }
                    remain -= 1000;
                    this.spinStatus.autoCloseRemain = Math.round(remain / 1000);
                    if (remain <= 0) {
                        this.cancelAutoClose();
                        this.tryAutoClose();
                    }
                }, 1000);
            }
            catch (e) { }
        }
    }
    cancelAutoClose() {
        clearInterval(this.autoCloseInterval);
        this.autoCloseInterval = null;
    }
    async getQrCode() {
        let qrResult;
        qrResult = await (0, helpers_1.scrapeImg)(this.page).catch((e) => console.log(e));
        if (!qrResult || !qrResult.urlCode) {
            qrResult = await (0, auth_1.retrieveQR)(this.page).catch((e) => console.log(e));
        }
        return qrResult;
    }
    async waitForQrCodeScan(catchQR) {
        let urlCode = null;
        let attempt = 0;
        while (true) {
            let needsScan = await (0, auth_1.needsToScan)(this.page).catch(() => null);
            if (!needsScan) {
                break;
            }
            const result = await this.getQrCode().catch(() => null);
            if (!result.urlCode) {
                break;
            }
            if (urlCode !== result.urlCode) {
                urlCode = result.urlCode;
                attempt++;
                let qr = '';
                if (this.options.logQR || catchQR) {
                    qr = await (0, auth_1.asciiQr)(urlCode).catch(() => undefined);
                }
                if (this.options.logQR) {
                    console.log(qr);
                }
                else {
                    this.spin(`Waiting for QRCode Scan: Attempt ${attempt}`);
                }
                if (catchQR) {
                    catchQR(result.base64Image, qr, attempt, result.urlCode);
                }
            }
            await (0, sleep_1.sleep)(200).catch(() => undefined);
        }
    }
    async waitForInChat() {
        let inChat = await (0, auth_1.isInsideChats)(this.page);
        while (inChat === false) {
            await (0, sleep_1.sleep)(200);
            inChat = await (0, auth_1.isInsideChats)(this.page);
        }
        return inChat;
    }
    async waitForLogin(catchQR, statusFind) {
        this.statusFind = statusFind;
        this.spin('Waiting page load', 'spinning');
        this.spin('Checking is logged...');
        let authenticated = await (0, auth_1.isAuthenticated)(this.page).catch(() => null);
        if (typeof authenticated === 'object' && authenticated.type) {
            this.spin(`Error http: ${authenticated.type}`, 'fail');
            this.page.close().catch(() => { });
            this.browser.close().catch(() => { });
            throw `Error http: ${authenticated.type}`;
        }
        this.startAutoClose();
        if (authenticated === false) {
            this.spin('Waiting for QRCode Scan...');
            statusFind && statusFind('notLogged', this.session);
            await this.waitForQrCodeScan(catchQR).catch(() => undefined);
            this.spin('Checking QRCode status...');
            // Wait for interface update
            await (0, sleep_1.sleep)(200);
            authenticated = await (0, auth_1.isAuthenticated)(this.page).catch(() => null);
            if (authenticated === null || JSON.stringify(authenticated) === '{}') {
                this.spin('Failed to authenticate');
                statusFind && statusFind('qrReadFail', this.session);
            }
            else if (authenticated) {
                this.spin('QRCode Success');
                statusFind && statusFind('qrReadSuccess', this.session);
            }
            else {
                this.spin('QRCode Fail', 'fail');
                statusFind && statusFind('qrReadFail', this.session);
                this.cancelAutoClose();
                this.tryAutoClose();
                throw 'Failed to read the QRCode';
            }
        }
        else if (authenticated === true) {
            this.spin('Authenticated');
            statusFind && statusFind('isLogged', this.session);
        }
        if (authenticated === true) {
            // Reinicia o contador do autoclose
            this.cancelAutoClose();
            this.startAutoClose();
            // Wait for interface update
            await (0, sleep_1.sleep)(200);
            this.spin('Checking phone is connected...');
            const inChat = await this.waitForInChat();
            if (!inChat) {
                this.spin('Phone not connected', 'fail');
                statusFind && statusFind('phoneNotConnected', this.session);
                this.cancelAutoClose();
                this.tryAutoClose();
                throw new Error('Phone not connected');
            }
            this.cancelAutoClose();
            this.spin('Connected', 'succeed');
            //   statusFind && statusFind('inChat', this.session);
            return true;
        }
        if (authenticated === false) {
            this.cancelAutoClose();
            this.tryAutoClose();
            this.spin('Not logged', 'fail');
            throw new Error('Not logged');
        }
        this.cancelAutoClose();
        this.tryAutoClose();
        this.spin('Unknow error', 'fail');
    }
    //Pro
    /**
     * Set offline
     */
    async setPresenceOffline() {
        return await this.page.evaluate(() => WAPI.setPresenceOffline());
    }
    //Pro
    /**
     * Set online
     */
    async setPresenceOnline() {
        return await this.page.evaluate(() => WAPI.setPresenceOnline());
    }
    /**
     * Delete the Service Workers
     */
    async killServiceWorker() {
        return await this.page.evaluate(() => WAPI.killServiceWorker());
    }
    /**
     * Load the service again
     */
    async restartService() {
        return await this.page.evaluate(() => WAPI.restartService());
    }
    /**
     * @returns Current host device details
     */
    async getHostDevice() {
        return await this.page.evaluate(() => WAPI.getHost());
    }
    /**
     * Retrieves WA version
     */
    async getWAVersion() {
        return await this.page.evaluate(() => WAPI.getWAVersion());
    }
    /**
     * Retrieves the connecction state
     */
    async getConnectionState() {
        return await this.page.evaluate(() => {
            //@ts-ignore
            return Store.State.Socket.state;
        });
    }
    /**
     * Retrieves if the phone is online. Please note that this may not be real time.
     */
    async isConnected() {
        return await this.page.evaluate(() => WAPI.isConnected());
    }
    /**
     * Retrieves if the phone is online. Please note that this may not be real time.
     */
    async isLoggedIn() {
        return await this.page.evaluate(() => WAPI.isLoggedIn());
    }
    /**
     * Retrieves Battery Level
     */
    async getBatteryLevel() {
        return await this.page.evaluate(() => WAPI.getBatteryLevel());
    }
}
exports.HostLayer = HostLayer;
//# sourceMappingURL=host.layer.js.map