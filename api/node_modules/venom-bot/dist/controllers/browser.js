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
exports.statusLog = exports.initBrowser = exports.folderSession = exports.getWhatsappPage = exports.initWhatsapp = void 0;
const ChromeLauncher = __importStar(require("chrome-launcher"));
const chrome_version_1 = __importDefault(require("chrome-version"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_config_1 = require("../config/puppeteer.config");
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const WAuserAgente_1 = require("../config/WAuserAgente");
const sleep_1 = require("../utils/sleep");
const os = __importStar(require("os"));
const axios_1 = __importDefault(require("axios"));
const create_config_1 = require("../config/create-config");
const unzipper = __importStar(require("unzipper"));
const child_process_1 = require("child_process");
const cach_url = 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/';
function isRoot() {
    return process.getuid && process.getuid() === 0;
}
async function initWhatsapp(options, browser) {
    const waPage = await getWhatsappPage(browser);
    if (!waPage) {
        return false;
    }
    try {
        await waPage.setUserAgent(WAuserAgente_1.useragentOverride);
        await waPage.setBypassCSP(true);
        waPage.setDefaultTimeout(60000);
        const { userPass, userProxy, addProxy } = options;
        if (typeof options.webVersion === 'string' && options.webVersion.length) {
            await waPage.setRequestInterception(true);
            waPage.on('request', async (req) => {
                if (req.url() === 'https://web.whatsapp.com/') {
                    let url = cach_url + options.webVersion + '.html';
                    await req.respond({
                        status: 200,
                        contentType: 'text/html',
                        body: await (await fetch(url)).text()
                    });
                }
                else {
                    if (options.forceWebpack === true) {
                        const headers = req.headers();
                        if (headers.cookie) {
                            // Filter out the 'wa_build' cookies and reconstruct the cookie header
                            headers.cookie = headers.cookie
                                .split(';')
                                .filter((cookie) => !cookie.trim().startsWith('wa_build'))
                                .join(';');
                        }
                        // Continue the request with potentially modified headers
                        await req.continue({ headers });
                    }
                    else {
                        await req.continue();
                    }
                }
            });
        }
        if (typeof userPass === 'string' &&
            userPass.length &&
            typeof userProxy === 'string' &&
            userProxy.length &&
            Array.isArray(addProxy) &&
            addProxy.length) {
            await waPage.authenticate({
                username: userProxy,
                password: userPass
            });
        }
        await waPage.goto(puppeteer_config_1.puppeteerConfig.whatsappUrl, {
            waitUntil: 'domcontentloaded'
        });
        waPage.on('pageerror', ({ message }) => {
            const erroLogType1 = message.includes('RegisterEffect is not a function');
            const erroLogType2 = message.includes('[Report Only]');
            if (erroLogType1 || erroLogType2) {
                waPage.evaluate(() => {
                    localStorage.clear();
                    window.location.reload();
                });
            }
        });
        await browser.userAgent();
        return waPage;
    }
    catch (error) {
        console.error(error);
        await waPage.close();
        return false;
    }
}
exports.initWhatsapp = initWhatsapp;
async function getWhatsappPage(browser) {
    try {
        const pages = await browser.pages();
        return pages.length !== 0 ? pages[0] : await browser.newPage();
    }
    catch {
        return false;
    }
}
exports.getWhatsappPage = getWhatsappPage;
function folderSession(options) {
    try {
        if (!options) {
            throw new Error(`Missing required options`);
        }
        if (!options.folderNameToken) {
            options.folderNameToken = create_config_1.defaultOptions.folderNameToken;
        }
        if (!options.session) {
            options.session = create_config_1.defaultOptions.session;
        }
        const folderSession = options.mkdirFolderToken
            ? path.join(path.resolve(process.cwd(), options.mkdirFolderToken, options.folderNameToken, options.session))
            : path.join(path.resolve(process.cwd(), options.folderNameToken, options.session));
        if (!fs.existsSync(folderSession)) {
            fs.mkdirSync(folderSession, { recursive: true });
        }
        const folderMulidevice = options.mkdirFolderToken
            ? path.join(path.resolve(process.cwd(), options.mkdirFolderToken, options.folderNameToken))
            : path.join(path.resolve(process.cwd(), options.folderNameToken));
        if (!fs.existsSync(folderMulidevice)) {
            fs.mkdirSync(folderMulidevice, { recursive: true });
        }
        fs.chmodSync(folderMulidevice, '777');
        fs.chmodSync(folderSession, '777');
        options.puppeteerOptions = {
            userDataDir: folderSession,
            ignoreHTTPSErrors: true
        };
        puppeteer_config_1.puppeteerConfig.chromiumArgs.push(`--user-data-dir=${folderSession}`);
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}
exports.folderSession = folderSession;
async function getGlobalChromeVersion() {
    try {
        const chromePath = ChromeLauncher.Launcher.getInstallations().pop();
        if (chromePath) {
            const version = await (0, chrome_version_1.default)(chromePath);
            return version;
        }
    }
    catch (e) {
        console.error('Error retrieving Chrome version:', e);
    }
    return null;
}
async function checkPathDowload(extractPath) {
    try {
        const pathChrome = path.join(extractPath, 'chrome-win', 'chrome.exe');
        if (!fs.existsSync(pathChrome)) {
            return false;
        }
        return pathChrome;
    }
    catch {
        return false;
    }
}
async function getChromeVersionBash(executablePath) {
    const notCheckText = 'Not check version';
    try {
        const platform = os.platform();
        let command = '';
        if (platform === 'linux') {
            if (executablePath.includes('chromium')) {
                command = 'chromium-browser --version';
            }
            else if (executablePath.includes('chrome')) {
                command = 'google-chrome --version';
            }
        }
        else if (platform === 'darwin' && executablePath.includes('Chrome')) {
            command =
                '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --version';
        }
        if (!command) {
            return notCheckText;
        }
        const { stdout, stderr } = await execAsync(command);
        if (stderr) {
            return notCheckText;
        }
        const version = stdout.trim().split(' ')[2];
        return version;
    }
    catch (error) {
        return notCheckText;
    }
}
function execAsync(command) {
    return new Promise((resolve) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            resolve({ stdout, stderr });
        });
    });
}
function downloadBash() {
    return new Promise((resolve, reject) => {
        try {
            const platform = os.platform();
            if (platform === 'linux') {
                (0, child_process_1.exec)('curl -O https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb', (error, stdout, stderr) => {
                    if (error) {
                        throw new Error(`Error downloading Google Chrome: ${error.message}`);
                    }
                    (0, child_process_1.exec)('sudo dpkg -i google-chrome-stable_current_amd64.deb', (error, stdout, stderr) => {
                        if (error) {
                            throw new Error(`Error installing Google Chrome: ${error.message}`);
                        }
                        (0, child_process_1.exec)('sudo apt-get update', (error, stdout, stderr) => {
                            if (error) {
                                throw new Error(`Error update dependencies: ${error.message}`);
                            }
                            (0, child_process_1.exec)('sudo apt-get install -f', (error, stdout, stderr) => {
                                if (error) {
                                    throw new Error(`Error fixing dependencies: ${error.message}`);
                                }
                                (0, child_process_1.exec)('which google-chrome', (error, stdout, stderr) => {
                                    if (error) {
                                        throw new Error(`Error getting Google Chrome path: ${error.message}`);
                                    }
                                    const path = stdout.trim();
                                    console.log(`Google Chrome installed successfully at: ${path}`);
                                    return resolve(path);
                                });
                            });
                        });
                    });
                });
            }
            else if (platform === 'darwin') {
                (0, child_process_1.exec)('curl -O https://dl.google.com/chrome/mac/stable/GGRO/googlechrome.dmg', (error, stdout, stderr) => {
                    if (error) {
                        throw new Error(`Error downloading Google Chrome: ${error.message}`);
                    }
                    (0, child_process_1.exec)('hdiutil attach googlechrome.dmg', (error, stdout, stderr) => {
                        if (error) {
                            throw new Error(`Error mounting DMG file: ${error.message}`);
                        }
                        (0, child_process_1.exec)('rsync -a "/Volumes/Google Chrome/Google Chrome.app" "/Applications/"', (error, stdout, stderr) => {
                            if (error) {
                                throw new Error(`Error installing Google Chrome: ${error.message}`);
                            }
                            (0, child_process_1.exec)('hdiutil detach "/Volumes/Google Chrome"', (error, stdout, stderr) => {
                                if (error) {
                                    throw new Error(`Error unmounting DMG file: ${error.message}`);
                                }
                                (0, child_process_1.exec)('ls -d "/Applications/Google Chrome.app"', (error, stdout, stderr) => {
                                    if (error) {
                                        console.error(`Error getting Google Chrome path: ${error.message}`);
                                        return;
                                    }
                                    const path = stdout.trim();
                                    console.log(`Google Chrome installed successfully at: ${path}`);
                                    return resolve(path);
                                });
                            });
                        });
                    });
                });
            }
            resolve(false);
        }
        catch (error) {
            console.error(error);
            return reject(false);
        }
    });
}
async function initBrowser(options, spinnies) {
    try {
        // Use stealth plugin to avoid being detected as a bot
        puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
        const checkFolder = folderSession(options);
        if (!checkFolder) {
            throw new Error(`Error executing client session info`);
        }
        // Check for deprecated headless option
        if (options.headless === true) {
            console.warn('Warning: The usage of "headless: true" is deprecated. Please use "headless: \'new\'" or "headless: false" instead. https://developer.chrome.com/articles/new-headless/');
        }
        if (options.headless !== 'new' &&
            options.headless !== 'old' &&
            options.headless !== false &&
            options.headless !== true) {
            throw new Error('Now use only headless: "new", "true" or false');
        }
        const chromePath = getChromeExecutablePath();
        // Set the executable path to the path of the Chrome binary or the executable path provided
        let executablePath = options.browserPathExecutable ??
            getChrome() ??
            puppeteer_extra_1.default.executablePath() ??
            chromePath;
        spinnies.add(`executable-path-${options.session}`, {
            text: `...`
        });
        spinnies.succeed(`executable-path-${options.session}`, {
            text: `Executable path browser: ${executablePath}`
        });
        const extractPath = path.join(process.cwd(), 'chrome');
        const checkPath = await checkPathDowload(extractPath);
        const platform = os.platform();
        if (!executablePath || !isChromeInstalled(executablePath)) {
            spinnies.add(`browser-info-${options.session}`, {
                text: `...`
            });
            spinnies.fail(`browser-info-${options.session}`, {
                text: `Could not find the google-chrome browser on the machine!`
            });
            const resultBash = await downloadBash();
            if (resultBash) {
                executablePath = resultBash;
            }
            else if (!checkPath) {
                spinnies.add(`browser-status-${options.session}`, {
                    text: `Downloading browser...`
                });
                // Download the latest version of Chrome
                const downloadUrl = `https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Win_x64%2F1000027%2Fchrome-win.zip?generation=1651780728332948&alt=media`;
                const zipFilePath = path.join(process.cwd(), 'chrome', 'chrome-win.zip');
                if (!fs.existsSync(extractPath)) {
                    fs.mkdirSync(extractPath, { recursive: true });
                }
                fs.chmodSync(extractPath, '777');
                spinnies.add(`browser-path-${options.session}`, {
                    text: `...`
                });
                spinnies.succeed(`browser-path-${options.session}`, {
                    text: `Path download Chrome: ${zipFilePath}`
                });
                const response = await axios_1.default.get(downloadUrl, {
                    responseType: 'arraybuffer'
                });
                // Verifica se o status da resposta é 200 (OK)
                if (response.status === 200) {
                    await fs.promises.writeFile(zipFilePath, response.data);
                    spinnies.succeed(`browser-status-${options.session}`, {
                        text: `Download completed.`
                    });
                    spinnies.add(`browser-status-${options.session}`, {
                        text: `Extracting Chrome: ${extractPath}`
                    });
                    const zip = await unzipper.Open.file(zipFilePath);
                    await zip.extract({ path: extractPath });
                    spinnies.succeed(`browser-status-${options.session}`, {
                        text: `Chrome extracted successfully.`
                    });
                    const pathChrome = path.join(extractPath, 'chrome-win', 'chrome.exe');
                    if (!fs.existsSync(pathChrome)) {
                        throw new Error(`Error no Path download Chrome`);
                    }
                    const checkDowl = await checkPathDowload(extractPath);
                    if (!checkDowl) {
                        throw new Error(`Error no Path download Chrome`);
                    }
                    const folderChrom = path.join(extractPath, 'chrome-win');
                    fs.chmodSync(folderChrom, '777');
                    executablePath = pathChrome;
                    spinnies.add(`browser-path-${options.session}`, {
                        text: `...`
                    });
                    spinnies.succeed(`browser-path-${options.session}`, {
                        text: `Execute Path Chrome: ${executablePath}`
                    });
                }
                else {
                    throw new Error('Error download file Chrome.');
                }
            }
            else {
                executablePath = checkPath;
            }
        }
        let chromeVersion = '';
        let versionTimeout;
        spinnies.add(`browser-Platform-${options.session}`, {
            text: `...`
        });
        spinnies.succeed(`browser-Platform-${options.session}`, {
            text: `Platform: ${platform}`
        });
        if (platform === 'darwin' || platform === 'linux') {
            chromeVersion = await getChromeVersionBash(executablePath);
        }
        else {
            if (executablePath.includes('google-chrome')) {
                chromeVersion = await getGlobalChromeVersion();
            }
            else {
                const browser = await puppeteer_extra_1.default.launch({
                    executablePath,
                    headless: options.headless === true || options.headless === false
                        ? options.headless
                        : 'new',
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                versionTimeout = setTimeout(() => {
                    browser.close();
                    throw new Error('This browser version has problems');
                }, 10000);
                chromeVersion = await browser.version();
                clearTimeout(versionTimeout);
                await browser.close();
            }
        }
        if (chromeVersion) {
            spinnies.add(`browser-Version-${options.session}`, {
                text: `...`
            });
            spinnies.succeed(`browser-Version-${options.session}`, {
                text: `Browser Version: ${chromeVersion}`
            });
        }
        const extras = { executablePath };
        if (Array.isArray(options.addProxy) && options.addProxy.length) {
            const proxy = options.addProxy[Math.floor(Math.random() * options.addProxy.length)];
            const args = options.browserArgs ?? puppeteer_config_1.puppeteerConfig.chromiumArgs;
            args.push(`--proxy-server=${proxy}`);
        }
        if (Array.isArray(options.addBrowserArgs) &&
            options.addBrowserArgs.length) {
            options.addBrowserArgs.forEach((arg) => {
                if (!puppeteer_config_1.puppeteerConfig.chromiumArgs.includes(arg)) {
                    puppeteer_config_1.puppeteerConfig.chromiumArgs.push(arg);
                }
            });
        }
        if (options.headless === 'old') {
            puppeteer_config_1.puppeteerConfig.chromiumArgs.push(`--headless=old`);
        }
        const launchOptions = {
            headless: options.headless,
            devtools: options.devtools,
            args: options.browserArgs ?? puppeteer_config_1.puppeteerConfig.chromiumArgs,
            ...options.puppeteerOptions,
            ...extras
        };
        const isRunningAsRoot = isRoot();
        if (isRunningAsRoot && options.browserArgs && options.browserArgs.length) {
            addArgsRoot(options.browserArgs);
        }
        if (options.browserWS && options.browserWS !== '') {
            return await puppeteer_extra_1.default.connect({ browserWSEndpoint: options.browserWS });
        }
        else {
            await removeStoredSingletonLock(options.puppeteerOptions, spinnies, options);
            return await puppeteer_extra_1.default.launch(launchOptions);
        }
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
exports.initBrowser = initBrowser;
function addArgsRoot(args) {
    if (Array.isArray(args)) {
        args.forEach((option) => {
            if (!puppeteer_config_1.puppeteerConfig.argsRoot.includes(option)) {
                puppeteer_config_1.puppeteerConfig.argsRoot.push(option);
            }
        });
    }
}
function getChromeExecutablePath() {
    const platform = os.platform();
    switch (platform) {
        case 'win32':
            return getWindowsChromeExecutablePath();
        case 'darwin':
            return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        case 'linux':
            return '/usr/bin/google-chrome';
        default:
            console.error('Could not find browser.');
            return null;
    }
}
function getWindowsChromeExecutablePath() {
    const programFilesPath = process.env.ProgramFiles || '';
    const programFilesx86Path = process.env['ProgramFiles(x86)'] || '';
    if (programFilesx86Path) {
        return path.join(programFilesx86Path, 'Google', 'Chrome', 'Application', 'chrome.exe');
    }
    else if (programFilesPath) {
        return path.join(programFilesPath, 'Google', 'Chrome', 'Application', 'chrome.exe');
    }
    else {
        return null;
    }
}
async function statusLog(page, spinnies, session, callback) {
    while (true) {
        if (page.isClosed()) {
            try {
                spinnies.fail(`whatzapp-intro-${session}`, {
                    text: 'Erro intro'
                });
            }
            catch { }
            break;
        }
        const infoLog = await page
            .evaluate(() => {
            const target = document.getElementsByClassName('_2dfCc');
            if (target && target.length) {
                if (target[0]['innerText'] !== 'WhatsApp' &&
                    target[0]['innerText'] !== window['statusInicial']) {
                    window['statusInicial'] = target[0]['innerText'];
                    return window['statusInicial'];
                }
            }
        })
            .catch(() => { });
        if (infoLog) {
            callback(infoLog);
        }
        await (0, sleep_1.sleep)(200);
    }
}
exports.statusLog = statusLog;
/**
 * Retrieves chrome instance path
 */
function getChrome() {
    try {
        const chromeInstalations = ChromeLauncher.Launcher.getInstallations();
        return chromeInstalations[0];
    }
    catch (error) {
        return undefined;
    }
}
function isChromeInstalled(executablePath) {
    try {
        fs.accessSync(executablePath);
        return true;
    }
    catch {
        return false;
    }
}
function removeStoredSingletonLock(puppeteerOptions, spinnies, options) {
    return new Promise((resolve, reject) => {
        try {
            const platform = os.platform();
            const { userDataDir } = puppeteerOptions;
            const singletonLockPath = path.join(path.resolve(process.cwd(), userDataDir, 'SingletonLock'));
            if (platform === 'win32') {
                // No need to remove the lock on Windows, so resolve with true directly.
                resolve(true);
            }
            else {
                spinnies.add(`stored-singleton-lock-${options.session}`, {
                    text: `...`
                });
                spinnies.succeed(`stored-singleton-lock-${options.session}`, {
                    text: `Path Stored "SingletonLock": ${singletonLockPath}`
                });
                spinnies.add(`path-stored-singleton-lock-${options.session}`, {
                    text: `checking SingletonLock file`
                });
                if (fs.existsSync(singletonLockPath)) {
                    spinnies.add(`path-stored-singleton-lock-${options.session}`, {
                        text: `The file was found "SingletonLock"`
                    });
                    fs.unlink(singletonLockPath, (error) => {
                        if (error && error.code !== 'ENOENT') {
                            spinnies.fail(`path-stored-singleton-lock-${options.session}`, {
                                text: `Error removing "SingletonLock": ${error}`
                            });
                            reject(false);
                        }
                        else {
                            spinnies.succeed(`path-stored-singleton-lock-${options.session}`, {
                                text: `Removing SingletonLock path: ${singletonLockPath}`
                            });
                            spinnies.add(`path-stored-singleton-lock-write-file-${options.session}`, {
                                text: `re-adding the file "SingletonLock": ${singletonLockPath}`
                            });
                            fs.writeFile(singletonLockPath, '', (error) => {
                                if (error && error.code !== 'ENOENT') {
                                    spinnies.fail(`path-stored-singleton-lock-write-file-${options.session}`, {
                                        text: `could not add the file "SingletonLock": ${singletonLockPath}`
                                    });
                                    reject(false);
                                }
                                else {
                                    spinnies.succeed(`path-stored-singleton-lock-write-file-${options.session}`, {
                                        text: `file created successfully "SingletonLock": ${singletonLockPath}`
                                    });
                                    resolve(true);
                                }
                            });
                        }
                    });
                }
                else {
                    spinnies.succeed(`path-stored-singleton-lock-${options.session}`, {
                        text: `The file "SingletonLock" was not found`
                    });
                    resolve(true);
                }
            }
        }
        catch {
            resolve(true);
        }
    });
}
//# sourceMappingURL=browser.js.map