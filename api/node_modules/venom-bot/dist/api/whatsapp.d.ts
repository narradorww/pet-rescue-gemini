/// <reference types="node" />
import { Page, Browser } from 'puppeteer';
import { ControlsLayer } from './layers/controls.layer';
import { Message } from './model';
import { CreateConfig } from '../config/create-config';
export declare class Whatsapp extends ControlsLayer {
    browser: Browser;
    page: Page;
    constructor(browser: Browser, page: Page, session?: string, options?: CreateConfig);
    initService(): Promise<void>;
    addChatWapi(): Promise<void>;
    /**
     * Decrypts message file
     * @param data Message object
     * @returns Decrypted file buffer (null otherwise)
     */
    downloadFile(data: string): Promise<string | boolean>;
    /**
     * Download and returns the media content in base64 format
     * @param messageId Message ou id
     * @returns Base64 of media
     */
    downloadMedia(messageId: string | Message): Promise<string>;
    /**
     * Get the puppeteer page instance
     * @returns The Whatsapp page
     */
    get waPage(): Page;
    /**
     * Clicks on 'use here' button (When it get unlaunched)
     * This method tracks the class of the button
     * Whatsapp web might change this class name over the time
     * Dont rely on this method
     */
    useHere(): Promise<boolean>;
    /**
     * Logout whastapp
     * @returns boolean
     */
    logout(): Promise<boolean>;
    /**
     * Closes page and browser
     * @internal
     */
    close(): Promise<boolean>;
    /**
     * Get message by id
     * @param messageId string
     * @returns Message object
     */
    getMessageById(messageId: string): Promise<Message>;
    /**
     * Decrypts message file
     * @param message Message object
     * @returns Decrypted file buffer (null otherwise)
     */
    decryptFile(message: Message): Promise<Buffer>;
}
