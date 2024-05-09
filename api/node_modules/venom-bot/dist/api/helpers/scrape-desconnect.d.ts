import { Page } from 'puppeteer';
declare global {
    interface Window {
        Store: any;
        Stream: any;
    }
}
export declare function scrapeDesconnected(page: Page): Promise<boolean>;
