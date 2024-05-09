/// <reference path="../../../src/types/spinnies.d.ts" />
import { Page, Browser } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { SocketState } from '../model/enum';
import * as Spinnies from 'spinnies';
export declare class HostLayer {
    browser: Browser;
    page: Page;
    readonly session: string;
    readonly options: CreateConfig;
    protected spinnies: Spinnies;
    protected spinStatus: {
        apiInject: string;
        autoCloseRemain: number;
        previousText: string;
        previousStatus: any;
        state: string;
    };
    protected autoCloseInterval: any;
    protected statusFind?: (statusGet: string, session: string) => void;
    constructor(browser: Browser, page: Page, session?: string, options?: CreateConfig);
    protected spin(text?: string, status?: Spinnies.SpinnerStatus): void;
    protected tryAutoClose(): void;
    protected startAutoClose(): void;
    cancelAutoClose(): void;
    getQrCode(): Promise<any>;
    waitForQrCodeScan(catchQR?: (qrCode: string, asciiQR: string, attempt: number, urlCode?: string) => void): Promise<void>;
    waitForInChat(): Promise<true>;
    waitForLogin(catchQR?: (qrCode: string, asciiQR: string, attempt: number, urlCode?: string) => void, statusFind?: (statusGet: string, session?: string) => void): Promise<boolean>;
    /**
     * Set offline
     */
    setPresenceOffline(): Promise<boolean>;
    /**
     * Set online
     */
    setPresenceOnline(): Promise<boolean>;
    /**
     * Delete the Service Workers
     */
    killServiceWorker(): Promise<boolean>;
    /**
     * Load the service again
     */
    restartService(): Promise<boolean>;
    /**
     * @returns Current host device details
     */
    getHostDevice(): Promise<Object>;
    /**
     * Retrieves WA version
     */
    getWAVersion(): Promise<string>;
    /**
     * Retrieves the connecction state
     */
    getConnectionState(): Promise<SocketState>;
    /**
     * Retrieves if the phone is online. Please note that this may not be real time.
     */
    isConnected(): Promise<boolean>;
    /**
     * Retrieves if the phone is online. Please note that this may not be real time.
     */
    isLoggedIn(): Promise<boolean>;
    /**
     * Retrieves Battery Level
     */
    getBatteryLevel(): Promise<number>;
}
