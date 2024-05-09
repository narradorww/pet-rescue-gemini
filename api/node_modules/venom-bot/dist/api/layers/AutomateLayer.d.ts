import { ListenerLayer } from './listener.layer';
import { Browser, Page } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
export declare class AutomateLayer extends ListenerLayer {
    browser: Browser;
    page: Page;
    private typingMutex;
    constructor(browser: Browser, page: Page, session?: string, options?: CreateConfig);
    private selectChatViaTyping;
    private typeMultiLine;
    /**
     * Sends a photo or video to given chat, by injecting keystrokes
     * @param to chat id: xxxxx@us.c
     * @param fileName full path to media file
     * @param caption media caption
     */
    sendPhotoVideoViaTyping(to: string, fileName: string, caption?: string): Promise<boolean>;
    /**
     * Sends a text message to given chat, by injecting keystrokes
     * @param to chat id: xxxxx@us.c
     * @param content text message
     */
    sendTextViaTyping(to: string, content: string): Promise<boolean>;
}
