import * as puppeteer from 'puppeteer';
import { ScrapQrcode } from '../api/model/qrcode';
import { Whatsapp } from '../api/whatsapp';
export declare const getInterfaceStatus: (waPage: puppeteer.Page) => Promise<any>;
/**
 * Validates if client is authenticated
 * @returns true if is authenticated, false otherwise
 * @param waPage
 */
export declare const isAuthenticated: (waPage: puppeteer.Page) => Promise<any>;
export declare const needsToScan: (waPage: puppeteer.Page) => Promise<boolean>;
export declare const isInsideChats: (waPage: puppeteer.Page) => Promise<boolean>;
export declare const isConnectingToPhone: (waPage: puppeteer.Page) => Promise<boolean>;
export declare function asciiQr(code: string): Promise<string>;
export declare function retrieveQR(page: puppeteer.Page): Promise<ScrapQrcode | undefined>;
export declare function checkDisconnect(page: puppeteer.Page, wpp: Whatsapp): Promise<void>;
export declare function checkStore(page: puppeteer.Page, client: Whatsapp): Promise<void>;
