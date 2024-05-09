"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = void 0;
const puppeteer_config_1 = require("./puppeteer.config");
exports.defaultOptions = {
    session: 'name-session',
    folderNameToken: 'tokens',
    disableWelcome: false,
    BrowserFetcher: true,
    updatesLog: true,
    headless: 'old',
    logQR: true,
    devtools: false,
    mkdirFolderToken: '',
    browserWS: '',
    browserArgs: puppeteer_config_1.puppeteerConfig.chromiumArgs,
    addBrowserArgs: [],
    autoClose: 120000,
    addProxy: [],
    browserPathExecutable: '',
    forceWebpack: false,
    webVersion: false
};
//# sourceMappingURL=options.js.map