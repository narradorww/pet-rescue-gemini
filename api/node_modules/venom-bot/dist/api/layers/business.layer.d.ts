import { Browser, Page } from 'puppeteer';
import { ControlsLayer } from './controls.layer';
export declare class BusinessLayer extends ControlsLayer {
    page: Page;
    browser: Browser;
    constructor(page: Page, browser: Browser);
    /**
     * Querys product catalog
     * @param id Buisness profile id ('00000@c.us')
     */
    getBusinessProfilesProducts(id: string): Promise<void>;
    /**
     * Sends product with product image to given chat id
     * @param to Chat id
     * @param base64 Base64 image data
     * @param caption Message body
     * @param businessId Business id number that owns the product ('0000@c.us')
     * @param productId Product id, see method getBusinessProfilesProducts for more info
     */
    sendImageWithProduct(to: string, base64: string, caption: string, businessId: string, productId: string): Promise<void>;
}
