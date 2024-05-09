import { Page, Browser } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { GroupLayer } from './group.layer';
export declare class UILayer extends GroupLayer {
    browser: Browser;
    page: Page;
    constructor(browser: Browser, page: Page, session?: string, options?: CreateConfig);
    /**
     * MouveMouse
     */
    mouseMove(x: number, y: number): Promise<void>;
    /**
     * checks and returns whether a message and a reply
     * @param messages
     */
    returnReply(messages: any): Promise<object>;
    /**
     * Opens given chat at last message (bottom)
     * Will fire natural workflow events of whatsapp web
     * @param chatId
     */
    openChat(chatId: string, force?: boolean): Promise<unknown>;
    /**
     * Opens chat at given message position
     * @param chatId Chat id
     * @param messageId Message id (For example: '06D3AB3D0EEB9D077A3F9A3EFF4DD030')
     */
    openChatAt(chatId: string, messageId: string): Promise<{
        wasVisible: boolean;
        alignAt: string;
    }>;
}
