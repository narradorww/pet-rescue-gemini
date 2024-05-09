import { Page, Browser } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { WhatsappProfile } from '../model';
import { SenderLayer } from './sender.layer';
export declare class RetrieverLayer extends SenderLayer {
    browser: Browser;
    page: Page;
    constructor(browser: Browser, page: Page, session?: string, options?: CreateConfig);
    /**
   * Return messages by dates!
   * @param {string} id contact number id
   * @param {string} type
    types:
    lowerThan: Return all messages after the date informed;
    higherThan: Return all messages before the date informed;
    equal: Return all messages from the informed date;
    full: Return all messages, with two new stringdate parameters, dateNumeric;
   * @param {string} date Pass the example date 00/00/0000 or 00-00-0000
   * @param {string} date Pass the example time 00:00 24 hours
   */
    getAllMessagesDate(chatId: string, type: string, idateStart: string, time: string, limit: number): Promise<import("../model").Message[]>;
    getNewMessageId(chatId: string): Promise<unknown>;
    /**
     * Returns a list of mute and non-mute users
     * @param type return type: all, toMute and noMute.
     * @returns obj
     */
    getListMutes(type?: string): Promise<object>;
    /**
     * Returns state connection
     * @returns obj
     */
    getStateConnection(): Promise<String>;
    /**
     * Receive the current theme
     * @returns string light or dark
     */
    getTheme(): Promise<string>;
    /**
     * Receive all blocked contacts
     * @returns array of [0,1,2,3....]
     */
    getBlockList(): Promise<import("../model").Contact[]>;
    /**
     * Retrieves all chats
     * @returns array of [Chat]
     */
    getAllChats(): Promise<import("../model").Chat[] | object[]>;
    /**
     * Retrieves all chats new messages
     * @returns array of [Chat]
     */
    getAllChatsNewMsg(): Promise<import("../model").Chat[]>;
    /**
     * Retrieves all chats Contacts
     * @returns array of [Chat]
     */
    getAllChatsContacts(): Promise<object[]>;
    /**
     * Checks if a number is a valid WA number
     * @param contactId, you need to include the @c.us at the end.
     * @returns contact detial as promise
     */
    checkNumberStatus(contactId: string): Promise<WhatsappProfile>;
    /**
     * Retrieves all chats with messages
     * @returns array of [Chat]
     */
    getAllChatsWithMessages(withNewMessageOnly?: boolean): Promise<import("../model").Chat[]>;
    /**
     * Retrieve all contact new messages
     * @returns array of groups
     */
    getChatContactNewMsg(): Promise<import("../model").Chat[]>;
    /**
     * Retrieves contact detail object of given contact id
     * @param contactId
     * @returns contact detial as promise
     */
    getContact(contactId: string): Promise<import("../model").Contact>;
    /**
     * Retrieves all contacts
     * @returns array of [Contact]
     */
    getAllContacts(): Promise<import("../model").Contact[]>;
    /**
     * Retrieves all chats Transmission list
     * @returns array of [Chat]
     */
    getAllChatsTransmission(): Promise<object[]>;
    /**
     * Retrieves chat object of given contact id
     * @param contactId
     * @returns contact detial as promise
     */
    getChatById(contactId: string): Promise<import("../model").Chat>;
    /**
     * Retrieves chat object of given contact id
     * @param contactId
     * @returns contact detial as promise
     * @deprecated
     */
    getChat(contactId: string): Promise<import("../model").Chat>;
    /**
     * Retrieves chat picture
     * @param chatId Chat id
     * @returns url of the chat picture or undefined if there is no picture for the chat.
     */
    getProfilePicFromServer(chatId: string): Promise<string>;
    /**
     * Load more messages in chat object from server. Use this in a while loop
     * @param contactId
     * @returns contact detial as promise
     * @deprecated
     */
    loadEarlierMessages(contactId: string): Promise<import("../model").Message[]>;
    /**
     * Retrieves status of given contact
     * @param contactId
     */
    getStatus(contactId: string): Promise<import("../model").ContactStatus>;
    /**
     * Checks if a number is a valid whatsapp number
     * @param contactId, you need to include the @c.us at the end.
     * @returns contact detial as promise
     */
    getNumberProfile(contactId: string): Promise<unknown>;
    /**
     * check if it's beta
     * @returns boolean
     */
    isBeta(): Promise<boolean>;
    /**
     * Retrieves all undread Messages
     */
    getUnreadMessages(unread?: boolean): Promise<any>;
    /**
     * Retrieves all messages already loaded in a chat
     * For loading every message use loadAndGetAllMessagesInChat
     * @param chatId, the chat to get the messages from
     * @param includeMe, include my own messages? boolean
     * @param includeNotifications
     * @returns any
     */
    getAllMessagesInChat(chatId: string, includeMe: boolean, includeNotifications: boolean): Promise<import("../model").Message[]>;
    /**
     * Loads and Retrieves all Messages in a chat
     * @param chatId, the chat to get the messages from
     * @param includeMe, include my own messages? boolean
     * @param includeNotifications
     * @returns any
     */
    loadAndGetAllMessagesInChat(chatId: string, includeMe?: boolean, includeNotifications?: boolean): Promise<import("../model").Message[]>;
    /**
     * Checks if a CHAT contact is online.
     * @param chatId chat id: xxxxx@c.us
     */
    getChatIsOnline(chatId: string): Promise<boolean>;
    /**
     * Retrieves the last seen of a CHAT.
     * @param chatId chat id: xxxxx@c.us
     */
    getLastSeen(chatId: string): Promise<number | boolean>;
}
