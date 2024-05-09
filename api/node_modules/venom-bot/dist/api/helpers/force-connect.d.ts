import { Page } from 'puppeteer';
export declare function loadForceConnect(page: Page, callback: (infoLog: string | true) => void, attempts: number, sleeps: number): Promise<void>;
