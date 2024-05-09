"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlsLayer = void 0;
const ui_layer_1 = require("./ui.layer");
const layers_interface_1 = require("../helpers/layers-interface");
class ControlsLayer extends ui_layer_1.UILayer {
    browser;
    page;
    constructor(browser, page, session, options) {
        super(browser, page, session, options);
        this.browser = browser;
        this.page = page;
    }
    /**
     * Unblock contact
     * @param contactId {string} id '000000000000@c.us'
     * @returns boolean
     */
    async unblockContact(contactId) {
        return this.page.evaluate((contactId) => WAPI.unblockContact(contactId), contactId);
    }
    /**
     * Block contact
     * @param contactId {string} id '000000000000@c.us'
     * @returns boolean
     */
    async blockContact(contactId) {
        return this.page.evaluate((contactId) => WAPI.blockContact(contactId), contactId);
    }
    /**
     * Mark unread chat
     * @param contactId {string} id '000000000000@c.us'
     * @returns bollean
     */
    async markUnseenMessage(contactId) {
        return new Promise(async (resolve, reject) => {
            const typeFunction = 'markUnseenMessage';
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
            const result = await this.page.evaluate((contactId) => WAPI.markUnseenMessage(contactId), contactId);
            if (result['erro'] == true) {
                return reject(result);
            }
            else {
                return resolve(result);
            }
        });
    }
    /**
     * Mark chat as read ✔️✔️
     * @param contactId {string} id '000000000000@c.us'
     * @returns boolean
     */
    async markMarkSeenMessage(contactId) {
        return new Promise(async (resolve, reject) => {
            const typeFunction = 'markMarkSeenMessage';
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
            const result = await this.page.evaluate((contactId) => WAPI.markMarkSeenMessage(contactId), contactId);
            if (result['erro'] == true) {
                return reject(result);
            }
            else {
                return resolve(result);
            }
        });
    }
    /**
     * Deletes the given chat
     * @param chatId {string} id '000000000000@c.us'
     * @returns boolean
     */
    async deleteChat(chatId) {
        return await this.page.evaluate((chatId) => WAPI.deleteConversation(chatId), chatId);
    }
    /**
     * Archive and unarchive chat messages with true or false
     * @param chatId {string} id '000000000000@c.us'
     * @param option {boolean} true or false
     * @returns boolean
     */
    async archiveChat(chatId, option) {
        return this.page.evaluate(({ chatId, option }) => WAPI.archiveChat(chatId, option), { chatId, option });
    }
    /**
     * Pin and Unpin chat messages with true or false
     * @param chatId {string} id '000000000000@c.us'
     * @param option {boolean} true or false
     * @param nonExistent {boolean} Pin chat, non-existent (optional)
     * @returns object
     */
    async pinChat(chatId, option, nonExistent) {
        return new Promise(async (resolve, reject) => {
            const result = await this.page.evaluate(({ chatId, option, nonExistent }) => {
                return WAPI.pinChat(chatId, option, nonExistent);
            }, { chatId, option, nonExistent });
            if (result['erro'] == true) {
                reject(result);
            }
            else {
                resolve(result);
            }
        });
    }
    /**
     * Deletes all messages of given chat
     * @param chatId
     * @returns boolean
     */
    async clearChatMessages(chatId) {
        return this.page.evaluate((chatId) => WAPI.clearChatMessages(chatId), chatId);
    }
    /**
     * Deletes message of given message id
     * @param chatId The chat id from which to delete the message.
     * @param messageId The specific message id of the message to be deleted
     * @param onlyLocal If it should only delete locally (message remains on the other recipienct's phone). Defaults to false.
     */
    async deleteMessage(chatId, messageId) {
        return new Promise(async (resolve, reject) => {
            const typeFunction = 'deleteMessage';
            const type = 'string';
            const check = [
                {
                    param: 'chatId',
                    type: type,
                    value: chatId,
                    function: typeFunction,
                    isUser: true
                },
                {
                    param: 'messageId',
                    type: 'object',
                    value: messageId,
                    function: typeFunction,
                    isUser: true
                }
            ];
            const validating = (0, layers_interface_1.checkValuesSender)(check);
            if (typeof validating === 'object') {
                return reject(validating);
            }
            const result = await this.page.evaluate(({ chatId, messageId }) => WAPI.deleteMessages(chatId, messageId), { chatId, messageId });
            if (result['erro'] === true) {
                return reject(result);
            }
            else {
                return resolve(result);
            }
        });
    }
    /**
     * Archive and unarchive chat messages with true or false
     * @param chatId {string} id '000000000000@c.us'
     * @param option {boolean} true or false
     * @returns boolean
     */
    async setMessagesAdminsOnly(chatId, option) {
        return this.page.evaluate(({ chatId, option }) => WAPI.setMessagesAdminsOnly(chatId, option), { chatId, option });
    }
    async reload() {
        await this.page.evaluate(() => {
            window.location.reload();
        });
    }
}
exports.ControlsLayer = ControlsLayer;
//# sourceMappingURL=controls.layer.js.map