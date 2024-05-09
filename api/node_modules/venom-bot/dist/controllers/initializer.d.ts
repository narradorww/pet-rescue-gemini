import { Whatsapp } from '../api/whatsapp';
import { CreateConfig } from '../config/create-config';
import { Browser, Page } from 'puppeteer';
declare global {
    interface Window {
        updater: any;
    }
}
/**
 * A callback will be received, informing the status of the qrcode
 */
export type CatchQR = (qrCode: string, asciiQR: string, attempt?: number, urlCode?: string) => void;
/**
 * A callback will be received, informing the customer's status
 */
export type StatusFind = (statusGet: string, session: string, info?: string) => void;
/**
 * A callback will be received, informing user about browser and page instance
 */
export type BrowserInstance = (browser: string | Browser, waPage: false | Page, client: Whatsapp) => void;
export type interfaceChange = (statusGet: InterfaceStateChange | string, session: string) => void;
export declare enum InterfaceStateChange {
    /**
     * Client interface is loading page from qrcode
     */
    qrcodeOpening = "qrcodeOpening",
    /**
     * Client interface is loading qrcode
     */
    qrcodeLoading = "qrcodeLoading",
    /**
     * QR code ready to be read!
     */
    qrcodeNormal = "qrcodeNormal",
    /**
     * Client interface is loading page from syncing
     */
    syncingOpening = "syncingOpening",
    /**
     * Client interface is loading syncing
     */
    syncingLoading = "syncingLoading",
    /**
     * Syncing ready to be read!
     */
    syncingNormal = "syncingNormal",
    /**
     * The customer is in the chat
     */
    chatsAvailable = "chatsAvailable"
}
export type ReconnectQrcode = (client: Whatsapp) => void;
export interface CreateOptions extends CreateConfig {
    /**
     * You must pass a string type parameter, this parameter will be the name of the client's session. If the parameter is not passed, the section name will be "session".
     */
    session: string;
    /**
     * A callback will be received, informing the status of the qrcode
     */
    catchQR?: CatchQR;
    /**
     * A callback will be received, informing the customer's status
     */
    statusFind?: StatusFind;
    /**
     * A callback will be received, informing user about browser and page instance
     */
    browserInstance?: BrowserInstance;
    /**
     * A callback will be received, customer interface information
     */
    interfaceChange?: interfaceChange;
}
/**
 * Start the bot
 * @returns Whatsapp page, with this parameter you will be able to access the bot functions
 */
export declare function create(createOption: CreateOptions): Promise<Whatsapp>;
/**
 * Start the bot
 * You must pass a string type parameter, this parameter will be the name of the client's session. If the parameter is not passed, the section name will be "session".
 * @returns Whatsapp page, with this parameter you will be able to access the bot functions
 */
export declare function create(sessionName: string, catchQR?: CatchQR, statusFind?: StatusFind, options?: CreateConfig, browserInstance?: BrowserInstance, reconnectQrcode?: ReconnectQrcode, interfaceChange?: interfaceChange): Promise<Whatsapp>;
