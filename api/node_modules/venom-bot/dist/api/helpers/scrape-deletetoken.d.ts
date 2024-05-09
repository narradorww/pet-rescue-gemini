import { Page } from 'puppeteer';
declare global {
    interface Window {
        pathSession: any;
    }
}
export declare function scrapeDeleteToken(page: Page): Promise<boolean>;
