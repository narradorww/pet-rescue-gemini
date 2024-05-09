/// <reference path="../../src/types/spinnies.d.ts" />
import { Browser, BrowserContext, Page, LaunchOptions } from 'puppeteer';
import { options } from '../config';
import { CreateConfig } from '../config/create-config';
import * as Spinnies from 'spinnies';
type CustomLaunchOptions = LaunchOptions & {
    headless?: boolean | 'new' | 'old';
    mkdirFolderToken?: options['mkdirFolderToken'];
    folderNameToken?: options['folderNameToken'];
    session?: options['session'];
    puppeteerOptions?: options['puppeteerOptions'];
    addBrowserArgs?: options['addBrowserArgs'];
    browserPathExecutable?: options['browserPathExecutable'];
    devtools?: options['devtools'];
    browserArgs?: options['browserArgs'];
    addProxy?: options['addProxy'];
    browserWS?: options['browserWS'];
};
export declare function initWhatsapp(options: options | CreateConfig, browser: Browser): Promise<Page | false>;
export declare function getWhatsappPage(browser: Browser | BrowserContext): Promise<Page | false>;
export declare function folderSession(options: options | CreateConfig | CustomLaunchOptions): boolean;
export declare function initBrowser(options: CustomLaunchOptions, spinnies: any): Promise<Browser | false>;
export declare function statusLog(page: Page, spinnies: Spinnies, session: string, callback: (infoLog: string) => void): Promise<void>;
export {};
