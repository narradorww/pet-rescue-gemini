"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrieverLayer = void 0;
const sender_layer_1 = require("./sender.layer");
const layers_interface_1 = require("../helpers/layers-interface");
class RetrieverLayer extends sender_layer_1.SenderLayer {
    browser;
    page;
    constructor(browser, page, session, options) {
        super(browser, page, session, options);
        this.browser = browser;
        this.page = page;
    }
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
    async getAllMessagesDate(chatId, type, idateStart, time, limit) {
        return await this.page.evaluate(({ chatId, type, idateStart, time, limit }) => WAPI.getAllMessagesDate(chatId, type, idateStart, time, limit), { chatId, type, idateStart, time, limit });
    }
    async getNewMessageId(chatId) {
        return new Promise(async (resolve, reject) => {
            const typeFunction = 'getNewMessageId';
            const type = 'string';
            const check = [
                {
                    param: 'text',
                    type: type,
                    value: chatId,
                    function: typeFunction,
                    isUser: true
                }
            ];
            const validating = (0, layers_interface_1.checkValuesSender)(check);
            if (typeof validating === 'object') {
                return reject(validating);
            }
            const result = await this.page.evaluate((chatId) => WAPI.getNewMessageId(chatId), chatId);
            if (result['erro'] == true) {
                return reject(result);
            }
            else {
                return resolve(result);
            }
        });
    }
    /**
     * Returns a list of mute and non-mute users
     * @param type return type: all, toMute and noMute.
     * @returns obj
     */
    async getListMutes(type) {
        return await this.page.evaluate((type) => WAPI.getListMute(type), type);
    }
    /**
     * Returns state connection
     * @returns obj
     */
    async getStateConnection() {
        return await this.page.evaluate(() => WAPI.getStateConnection());
    }
    /**
     * Receive the current theme
     * @returns string light or dark
     */
    async getTheme() {
        return await this.page.evaluate(() => WAPI.getTheme());
    }
    /**
     * Receive all blocked contacts
     * @returns array of [0,1,2,3....]
     */
    async getBlockList() {
        return await this.page.evaluate(() => WAPI.getBlockList());
    }
    /**
     * Retrieves all chats
     * @returns array of [Chat]
     */
    async getAllChats() {
        return await this.page.evaluate(() => {
            let chats = WAPI.getAllChats();
            return chats;
        });
    }
    /**
     * Retrieves all chats new messages
     * @returns array of [Chat]
     */
    async getAllChatsNewMsg() {
        return await this.page.evaluate(() => {
            let chats = WAPI.getAllChatsWithNewMsg();
            return chats;
        });
    }
    /**
     * Retrieves all chats Contacts
     * @returns array of [Chat]
     */
    async getAllChatsContacts() {
        return await this.page.evaluate(async () => {
            let chats = WAPI.getAllChats(), filter = (await chats).filter((chat) => chat.kind === 'chat');
            return filter;
        });
    }
    /**
     * Checks if a number is a valid WA number
     * @param contactId, you need to include the @c.us at the end.
     * @returns contact detial as promise
     */
    async checkNumberStatus(contactId) {
        return new Promise(async (resolve, reject) => {
            const result = await this.page.evaluate((contactId) => WAPI.checkNumberStatus(contactId), contactId);
            if (result['status'] !== 200) {
                reject(result);
            }
            else {
                resolve(result);
            }
        });
    }
    /**
     * Retrieves all chats with messages
     * @returns array of [Chat]
     */
    async getAllChatsWithMessages(withNewMessageOnly = false) {
        return this.page.evaluate((withNewMessageOnly) => WAPI.getAllChatsWithMessages(withNewMessageOnly), withNewMessageOnly);
    }
    /**
     * Retrieve all contact new messages
     * @returns array of groups
     */
    async getChatContactNewMsg() {
        // prettier-ignore
        const chats = await this.page.evaluate(() => WAPI.getAllChatsWithNewMsg());
        return chats.filter((chat) => chat.kind === 'chat');
    }
    /**
     * Retrieves contact detail object of given contact id
     * @param contactId
     * @returns contact detial as promise
     */
    async getContact(contactId) {
        return this.page.evaluate((contactId) => WAPI.getContact(contactId), contactId);
    }
    /**
     * Retrieves all contacts
     * @returns array of [Contact]
     */
    async getAllContacts() {
        return await this.page.evaluate(() => WAPI.getAllContacts());
    }
    /**
     * Retrieves all chats Transmission list
     * @returns array of [Chat]
     */
    async getAllChatsTransmission() {
        return await this.page.evaluate(async () => {
            let chats = WAPI.getAllChats();
            return (await chats).filter((chat) => chat.kind === 'broadcast');
        });
    }
    /**
     * Retrieves chat object of given contact id
     * @param contactId
     * @returns contact detial as promise
     */
    async getChatById(contactId) {
        return await this.page.evaluate((contactId) => WAPI.getChatById(contactId), contactId);
    }
    /**
     * Retrieves chat object of given contact id
     * @param contactId
     * @returns contact detial as promise
     * @deprecated
     */
    async getChat(contactId) {
        return await this.getChatById(contactId);
    }
    /**
     * Retrieves chat picture
     * @param chatId Chat id
     * @returns url of the chat picture or undefined if there is no picture for the chat.
     */
    async getProfilePicFromServer(chatId) {
        return this.page.evaluate((chatId) => WAPI.getProfilePicFromServer(chatId), chatId);
    }
    /**
     * Load more messages in chat object from server. Use this in a while loop
     * @param contactId
     * @returns contact detial as promise
     * @deprecated
     */
    async loadEarlierMessages(contactId) {
        return this.page.evaluate((contactId) => WAPI.loadEarlierMessages(contactId), contactId);
    }
    /**
     * Retrieves status of given contact
     * @param contactId
     */
    async getStatus(contactId) {
        return this.page.evaluate((contactId) => WAPI.getStatus(contactId), contactId);
    }
    /**
     * Checks if a number is a valid whatsapp number
     * @param contactId, you need to include the @c.us at the end.
     * @returns contact detial as promise
     */
    async getNumberProfile(contactId) {
        return new Promise(async (resolve, reject) => {
            const typeFunction = 'getNumberProfile';
            const type = 'string';
            const check = [
                {
                    param: 'contactId',
                    type: type,
                    value: contactId,
                    function: typeFunction,
                    isUser: true
                }
            ];
            const validating = (0, layers_interface_1.checkValuesSender)(check);
            if (typeof validating === 'object') {
                return reject(validating);
            }
            const result = this.page.evaluate((contactId) => WAPI.getNumberProfile(contactId), contactId);
            if (result['erro'] == true) {
                reject(result);
            }
            else {
                resolve(result);
            }
        });
    }
    /**
     * check if it's beta
     * @returns boolean
     */
    async isBeta() {
        return await this.page.evaluate(() => WAPI.isBeta());
    }
    /**
     * Retrieves all undread Messages
     */
    async getUnreadMessages(unread) {
        return await this.page.evaluate((unread) => WAPI.getUnreadMessages(unread), unread);
    }
    /**
     * Retrieves all messages already loaded in a chat
     * For loading every message use loadAndGetAllMessagesInChat
     * @param chatId, the chat to get the messages from
     * @param includeMe, include my own messages? boolean
     * @param includeNotifications
     * @returns any
     */
    async getAllMessagesInChat(chatId, includeMe, includeNotifications) {
        return await this.page.evaluate(({ chatId, includeMe, includeNotifications }) => WAPI.getAllMessagesInChat(chatId, includeMe, includeNotifications), { chatId, includeMe, includeNotifications });
    }
    /**
     * Loads and Retrieves all Messages in a chat
     * @param chatId, the chat to get the messages from
     * @param includeMe, include my own messages? boolean
     * @param includeNotifications
     * @returns any
     */
    async loadAndGetAllMessagesInChat(chatId, includeMe = false, includeNotifications = false) {
        return await this.page.evaluate(({ chatId, includeMe, includeNotifications }) => WAPI.loadAndGetAllMessagesInChat(chatId, includeMe, includeNotifications), { chatId, includeMe, includeNotifications });
    }
    /**
     * Checks if a CHAT contact is online.
     * @param chatId chat id: xxxxx@c.us
     */
    async getChatIsOnline(chatId) {
        return await this.page.evaluate((chatId) => WAPI.getChatIsOnline(chatId), chatId);
    }
    /**
     * Retrieves the last seen of a CHAT.
     * @param chatId chat id: xxxxx@c.us
     */
    async getLastSeen(chatId) {
        return await this.page.evaluate((chatId) => WAPI.getLastSeen(chatId), chatId);
    }
}
exports.RetrieverLayer = RetrieverLayer;
//# sourceMappingURL=retriever.layer.js.map