"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.InterfaceStateChange = void 0;
const whatsapp_1 = require("../api/whatsapp");
const create_config_1 = require("../config/create-config");
const browser_1 = require("./browser");
const welcome_1 = require("./welcome");
const spinnies_1 = require("../utils/spinnies");
const enum_1 = require("../api/model/enum");
const helpers_1 = require("../api/helpers");
const check_up_to_date_1 = require("./check-up-to-date");
var InterfaceStateChange;
(function (InterfaceStateChange) {
    /**
     * Client interface is loading page from qrcode
     */
    InterfaceStateChange["qrcodeOpening"] = "qrcodeOpening";
    /**
     * Client interface is loading qrcode
     */
    InterfaceStateChange["qrcodeLoading"] = "qrcodeLoading";
    /**
     * QR code ready to be read!
     */
    InterfaceStateChange["qrcodeNormal"] = "qrcodeNormal";
    /**
     * Client interface is loading page from syncing
     */
    InterfaceStateChange["syncingOpening"] = "syncingOpening";
    /**
     * Client interface is loading syncing
     */
    InterfaceStateChange["syncingLoading"] = "syncingLoading";
    /**
     * Syncing ready to be read!
     */
    InterfaceStateChange["syncingNormal"] = "syncingNormal";
    /**
     * The customer is in the chat
     */
    InterfaceStateChange["chatsAvailable"] = "chatsAvailable";
})(InterfaceStateChange || (exports.InterfaceStateChange = InterfaceStateChange = {}));
async function create(sessionOrOption, catchQR, statusFind, options, browserInstance, reconnectQrcode, interfaceChange) {
    let session = 'session';
    return new Promise(async (resolve, reject) => {
        if (typeof sessionOrOption === 'string' &&
            sessionOrOption.replace(/\s/g, '').length) {
            session = sessionOrOption.replace(/\s/g, '');
            options['session'] = session;
        }
        else if (typeof sessionOrOption === 'object') {
            session = sessionOrOption.session || session;
            catchQR = sessionOrOption.catchQR || catchQR;
            statusFind = sessionOrOption.statusFind || statusFind;
            browserInstance = sessionOrOption.browserInstance || browserInstance;
            options = sessionOrOption;
        }
        const spinnies = (0, spinnies_1.getSpinnies)({
            disableSpins: options ? options.disableSpins : false
        });
        spinnies.add(`donate-${session}`, {
            text: `....`
        });
        spinnies.fail(`donate-${session}`, {
            text: `Help Keep This Project Going! Know more: https://github.com/orkestral/venom/blob/master/docs/getting-started/donate.md`
        });
        spinnies.add(`node-version-${session}`, {
            text: `check nodeJs version...`
        });
        const requiredNodeVersion = 16;
        const currentNodeVersion = Number(process.versions.node.split('.')[0]);
        if (currentNodeVersion < requiredNodeVersion) {
            spinnies.fail(`node-version-${session}`, {
                text: `update Node.js, the version you are using doesn't work for this system!`
            });
            return reject(`Outdated Node.js version. Node.js ${requiredNodeVersion} or higher is required. Please update Node.js.`);
        }
        spinnies.succeed(`node-version-${session}`, {
            text: `Node.js version verified successfully!`
        });
        await (0, check_up_to_date_1.checkUpdates)();
        const mergedOptions = { ...create_config_1.defaultOptions, ...options };
        if (!mergedOptions.disableWelcome) {
            (0, welcome_1.welcomeScreen)();
        }
        statusFind && statusFind('initBrowser', session);
        // Initialize whatsapp
        if (mergedOptions.browserWS) {
            spinnies.add(`browser-${session}`, {
                text: `Waiting... checking the wss server...`
            });
        }
        else {
            spinnies.add(`browser-${session}`, {
                text: 'Waiting... checking the browser...'
            });
        }
        const browser = await (0, browser_1.initBrowser)(mergedOptions, spinnies);
        if (typeof browser === 'boolean') {
            spinnies.fail(`browser-${session}`, {
                text: `Error no open browser....`
            });
            statusFind && statusFind('noOpenBrowser', session);
            return reject(`Error no open browser....`);
        }
        if (mergedOptions.browserWS) {
            statusFind && statusFind('connectBrowserWs', session);
            spinnies.succeed(`browser-${session}`, {
                text: `Has been properly connected to the wss server`
            });
        }
        else {
            statusFind && statusFind('openBrowser', session);
            spinnies.succeed(`browser-${session}`, {
                text: `Browser successfully opened`
            });
        }
        if (!mergedOptions.browserWS) {
            spinnies.add(`browser-${session}`, {
                text: 'checking headless...'
            });
            if (mergedOptions.headless) {
                spinnies.succeed(`browser-${session}`, {
                    text: 'headless option is active, browser hidden'
                });
            }
            else {
                spinnies.succeed(`browser-${session}`, {
                    text: 'headless option is disabled, browser visible'
                });
            }
        }
        if (typeof browser === 'object') {
            if (!mergedOptions.browserWS && browser['_process']) {
                browser['_process'].once('close', () => {
                    browser['isClose'] = true;
                });
            }
            (0, helpers_1.checkingCloses)(browser, mergedOptions, (result) => {
                statusFind && statusFind(result, session);
            }).catch(() => {
                spinnies.fail(`whatzapp-${session}-close`, {
                    text: 'Closed Browser'
                });
                return reject('The client has been closed');
            });
            spinnies.add(`whatzapp-${session}`, {
                text: 'Checking page to whatzapp...'
            });
            statusFind && statusFind('initWhatsapp', session);
            // Initialize whatsapp
            const page = await (0, browser_1.initWhatsapp)(mergedOptions, browser);
            if (page === false) {
                spinnies.fail(`whatzapp-${session}`, {
                    text: 'Error accessing the page: "https://web.whatsapp.com"'
                });
                statusFind && statusFind('erroPageWhatsapp', session);
                return reject('Error when trying to access the page: "https://web.whatsapp.com"');
            }
            statusFind && statusFind('successPageWhatsapp', session);
            spinnies.succeed(`whatzapp-${session}`, {
                text: 'Page successfully accessed'
            });
            try {
                spinnies.add(`whatzapp-intro-${session}`, {
                    text: 'waiting for introduction'
                });
            }
            catch { }
            (0, browser_1.statusLog)(page, spinnies, session, (event) => {
                try {
                    spinnies.add(`whatzapp-intro-${session}`, {
                        text: event
                    });
                }
                catch { }
                statusFind && statusFind('introductionHistory', session, event);
            });
            const client = new whatsapp_1.Whatsapp(browser, page, session, mergedOptions);
            if (browserInstance) {
                browserInstance(browser, page, client);
            }
            client.onInterfaceChange(async (interFace) => {
                try {
                    if (interFace.mode === enum_1.InterfaceMode.MAIN) {
                        interfaceChange && interfaceChange('chatsAvailable', session);
                        spinnies.add(`whatzapp-mode-main-${session}`, {
                            text: 'opening main page...'
                        });
                        spinnies.succeed(`whatzapp-mode-main-${session}`, {
                            text: 'Successfully main page!'
                        });
                        spinnies.succeed(`whatzapp-mode-syncing-${session}`, {
                            text: 'Successfully sync!'
                        });
                        await client.initService();
                        await client.addChatWapi();
                    }
                    if (interFace.mode === enum_1.InterfaceMode.SYNCING) {
                        if (interFace.info === enum_1.InterfaceState.OPENING) {
                            interfaceChange && interfaceChange('syncingOpening', session);
                            spinnies.add(`whatzapp-mode-syncing-${session}`, {
                                text: 'opening sync page...'
                            });
                        }
                        if (interFace.info === enum_1.InterfaceState.PAIRING) {
                            interfaceChange && interfaceChange('syncingLoading', session);
                            spinnies.add(`whatzapp-mode-syncing-${session}`, {
                                text: 'Loading sync...'
                            });
                        }
                        if (interFace.info === enum_1.InterfaceState.NORMAL) {
                            interfaceChange && interfaceChange('syncingNormal', session);
                            spinnies.succeed(`whatzapp-mode-syncing-${session}`, {
                                text: 'Successfully sync!'
                            });
                        }
                    }
                    if (interFace.mode === enum_1.InterfaceMode.QR) {
                        const status = await page.evaluate(() => window?.Store?.State?.Socket?.stream);
                        if (status === enum_1.SocketStream.DISCONNECTED) {
                            spinnies.add(`whatzapp-disconnected-${session}`, {
                                text: 'checking...'
                            });
                            spinnies.fail(`whatzapp-disconnected-${session}`, {
                                text: 'Was disconnected!'
                            });
                            document.querySelectorAll('.MLTJU p')[0].textContent;
                            statusFind && statusFind('desconnected', session);
                        }
                        if (interFace.info === enum_1.InterfaceState.OPENING) {
                            interfaceChange && interfaceChange('qrcodeOpening', session);
                            spinnies.add(`whatzapp-mode-qr-${session}`, {
                                text: 'Opening QR Code page...'
                            });
                        }
                        if (interFace.info === enum_1.InterfaceState.PAIRING) {
                            interfaceChange && interfaceChange('qrcodeLoading', session);
                            spinnies.add(`whatzapp-mode-qr-${session}`, {
                                text: 'Loading QR Code...'
                            });
                        }
                        if (interFace.info === enum_1.InterfaceState.NORMAL) {
                            interfaceChange && interfaceChange('qrcodeNormal', session);
                            spinnies.succeed(`whatzapp-mode-qr-${session}`, {
                                text: 'Successfully loaded QR Code!'
                            });
                        }
                    }
                }
                catch { }
            });
            client
                .onStreamChange(async (stateStream) => {
                if (stateStream === enum_1.SocketStream.CONNECTED) {
                    try {
                        spinnies.succeed(`whatzapp-intro-${session}`, {
                            text: 'Successfully connected!'
                        });
                    }
                    catch { }
                }
                if (stateStream === enum_1.SocketStream.DISCONNECTED) {
                    const mode = await page
                        .evaluate(() => window?.Store?.Stream?.mode)
                        .catch(() => { });
                    if (mode === enum_1.InterfaceMode.QR
                    // && checkFileJson(mergedOptions, session)
                    ) {
                        if (statusFind) {
                            spinnies.add(`whatzapp-qr-${session}`, {
                                text: 'check....'
                            });
                            statusFind('desconnectedMobile', session);
                            spinnies.fail(`whatzapp-qr-${session}`, {
                                text: 'Disconnected by cell phone!'
                            });
                        }
                    }
                }
            })
                .catch();
            client
                .onStateChange(async (state) => {
                if (state === enum_1.SocketState.PAIRING) {
                    const device = await page
                        .evaluate(() => {
                        if (document.querySelector('[tabindex="-1"]') &&
                            window?.Store?.Stream?.mode === enum_1.InterfaceMode.SYNCING &&
                            window?.Store?.Stream?.obscurity === 'SHOW') {
                            return true;
                        }
                        return false;
                    })
                        .catch(() => undefined);
                    if (device === true) {
                        if (statusFind) {
                            statusFind('deviceNotConnected', session);
                        }
                    }
                }
            })
                .catch();
            page.on('dialog', async (dialog) => {
                await dialog.accept();
            });
            if (mergedOptions.waitForLogin) {
                const isLogged = await client
                    .waitForLogin(catchQR, statusFind)
                    .catch(() => undefined);
                statusFind && statusFind('waitForLogin', session);
                if (!isLogged) {
                    return reject('Not Logged');
                }
                let waitLoginPromise = null;
                client
                    .onStateChange(async (state) => {
                    if (state === enum_1.SocketState.UNPAIRED ||
                        state === enum_1.SocketState.UNPAIRED_IDLE) {
                        if (!waitLoginPromise) {
                            waitLoginPromise = client
                                .waitForLogin(catchQR, statusFind)
                                .then(() => {
                                if (reconnectQrcode) {
                                    reconnectQrcode(client);
                                }
                            })
                                .catch(() => { })
                                .finally(() => {
                                waitLoginPromise = null;
                            });
                        }
                        await waitLoginPromise;
                    }
                })
                    .catch();
            }
            statusFind && statusFind('waitChat', session);
            await page
                .waitForSelector('#app .two', { visible: true })
                .catch(() => { });
            try {
                spinnies.succeed(`whatzapp-intro-${session}`, {
                    text: 'Successfully connected!'
                });
            }
            catch { }
            await client.initService();
            await client.addChatWapi();
            statusFind && statusFind('successChat', session);
            return resolve(client);
        }
    });
}
exports.create = create;
//# sourceMappingURL=initializer.js.map