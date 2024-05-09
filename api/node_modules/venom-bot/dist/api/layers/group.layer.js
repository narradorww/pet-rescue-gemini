"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupLayer = void 0;
const retriever_layer_1 = require("./retriever.layer");
const layers_interface_1 = require("../helpers/layers-interface");
const helpers_1 = require("../helpers");
class GroupLayer extends retriever_layer_1.RetrieverLayer {
    browser;
    page;
    constructor(browser, page, session, options) {
        super(browser, page, session, options);
        this.browser = browser;
        this.page = page;
    }
    /**
     * Parameters to change group settings, see {@link GroupSettings for details}
     * @param {string} groupId group number
     * @param {GroupSettings} settings
     * @param {boolean} value
     */
    async setGroupSettings(groupId, settings, value) {
        return new Promise(async (resolve, reject) => {
            const typeFunction = 'setGroupSettings';
            const type = 'string';
            const check = [
                {
                    param: 'groupId',
                    type: type,
                    value: groupId,
                    function: typeFunction,
                    isUser: true
                },
                {
                    param: 'settings',
                    type: type,
                    value: settings,
                    function: typeFunction,
                    isUser: true
                },
                {
                    param: 'value',
                    type: type,
                    value: value,
                    function: typeFunction,
                    isUser: true
                }
            ];
            const validating = (0, layers_interface_1.checkValuesSender)(check);
            if (typeof validating === 'object') {
                return reject(validating);
            }
            const result = await this.page.evaluate(({ groupId, settings, value }) => {
                return WAPI.setGroupSettings(groupId, settings, value);
            }, { groupId, settings, value });
            if (result['erro'] == true) {
                return reject(result);
            }
            else {
                return resolve(result);
            }
        });
    }
    /**
     * Parameters to change group image
     * @param {string} groupId group number
     * @param {string} path of image
     */
    async setGroupImage(groupId, path) {
        let b64 = await (0, helpers_1.downloadFileToBase64)(path, [
            'image/gif',
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/webp'
        ]);
        if (!b64) {
            b64 = await (0, helpers_1.fileToBase64)(path);
        }
        if (b64) {
            const buff = Buffer.from(b64.replace(/^data:image\/(png|jpe?g|webp);base64,/, ''), 'base64');
            const mimeInfo = (0, helpers_1.base64MimeType)(b64);
            if (!mimeInfo || mimeInfo.includes('image')) {
                let _webb64_96 = await (0, helpers_1.resizeImg)(buff, { width: 96, height: 96 }), _webb64_640 = await (0, helpers_1.resizeImg)(buff, { width: 640, height: 640 });
                let obj = { a: _webb64_640, b: _webb64_96 };
                return await this.page.evaluate(({ obj, groupId }) => WAPI.setProfilePic(obj, groupId), {
                    obj,
                    groupId
                });
            }
            else {
                console.log('Not an image, allowed formats png, jpeg and webp');
                return false;
            }
        }
    }
    /**
     * Parameters to change group title
     * @param {string} groupId group number
     * @param {string} title group title
     */
    async setGroupTitle(groupId, title) {
        return new Promise(async (resolve, reject) => {
            const typeFunction = 'setGroupTitle';
            const type = 'string';
            const check = [
                {
                    param: 'groupId',
                    type: type,
                    value: groupId,
                    function: typeFunction,
                    isUser: true
                },
                {
                    param: 'title',
                    type: type,
                    value: title,
                    function: typeFunction,
                    isUser: true
                }
            ];
            const validating = (0, layers_interface_1.checkValuesSender)(check);
            if (typeof validating === 'object') {
                return reject(validating);
            }
            const result = await this.page.evaluate(({ groupId, title }) => {
                return WAPI.setGroupTitle(groupId, title);
            }, { groupId, title });
            if (result['erro'] == true) {
                return reject(result);
            }
            else {
                return resolve(result);
            }
        });
    }
    /**
     * Parameters to change group description
     * @param {string} groupId group number
     * @param {string} description group description
     */
    async setGroupDescription(groupId, description) {
        return new Promise(async (resolve, reject) => {
            const typeFunction = 'setGroupDescription';
            const type = 'string';
            const check = [
                {
                    param: 'groupId',
                    type: type,
                    value: groupId,
                    function: typeFunction,
                    isUser: true
                },
                {
                    param: 'description',
                    type: type,
                    value: description,
                    function: typeFunction,
                    isUser: true
                }
            ];
            const validating = (0, layers_interface_1.checkValuesSender)(check);
            if (typeof validating === 'object') {
                return reject(validating);
            }
            const result = await this.page.evaluate(({ groupId, description }) => {
                return WAPI.setGroupDescription(groupId, description);
            }, { groupId, description });
            if (result['erro'] == true) {
                return reject(result);
            }
            else {
                return resolve(result);
            }
        });
    }
    /**
     * Retrieve all groups
     * @returns array of groups
     */
    async getAllChatsGroups() {
        return await this.page.evaluate(async () => {
            let chats = WAPI.getAllChats();
            return (await chats).filter((chat) => chat.kind === 'group');
        });
    }
    /**
     * Retrieve all groups new messages
     * @returns array of groups
     */
    async getChatGroupNewMsg() {
        return await this.page.evaluate(() => {
            let chats = WAPI.getAllChatsWithNewMsg();
            return chats.filter((chat) => chat.kind === 'group');
        });
    }
    /**
     * Removes the host device from the group
     * @param groupId group id
     */
    async leaveGroup(groupId) {
        return this.page.evaluate((groupId) => WAPI.leaveGroup(groupId), groupId);
    }
    /**
     * Retrieves group members as [Id] objects
     * @param groupId group id
     */
    async getGroupMembers(groupId, time) {
        return new Promise(async (resolve, reject) => {
            const typeFunction = 'getGroupMembers';
            const type = 'string';
            const check = [
                {
                    param: 'groupId',
                    type: type,
                    value: groupId,
                    function: typeFunction,
                    isUser: true
                }
            ];
            const validating = (0, layers_interface_1.checkValuesSender)(check);
            if (typeof validating === 'object') {
                return reject(validating);
            }
            const result = this.page.evaluate((groupId, time) => WAPI.getGroupParticipant(groupId, time), groupId, time);
            if (result['erro'] == true) {
                reject(result);
            }
            else {
                resolve(result);
            }
        });
    }
    // /**
    //  * Returns group members [Contact] objects
    //  * @param groupId
    //  */
    // public async getGroupMembers(groupId: string) {
    //   const membersIds = await this.getGroupMembersIds(groupId);
    //   const actions = membersIds.map((memberId) => {
    //     return this.getContact(memberId._serialized);
    //   });
    //   return Promise.all(actions);
    // }
    /**
     * Reset group invitation link
     * @param chatId
     * @returns boolean
     */
    async revokeGroupInviteLink(chatId) {
        return await this.page.evaluate((chatId) => WAPI.revokeGroupInviteLink(chatId), chatId);
    }
    /**
     * Generates group-invite link
     * @param chatId
     * @returns Invitation link
     */
    async getGroupInviteLink(chatId) {
        return await this.page.evaluate((chatId) => WAPI.getGroupInviteLink(chatId), chatId);
    }
    /**
     * Generates group-invite link
     * @param inviteCode
     * @returns Invite code from group link. Example: CMJYfPFqRyE2GxrnkldYED
     */
    async getGroupInfoFromInviteLink(inviteCode) {
        inviteCode = inviteCode.replace('chat.whatsapp.com/', '');
        inviteCode = inviteCode.replace('invite/', '');
        inviteCode = inviteCode.replace('https://', '');
        inviteCode = inviteCode.replace('http://', '');
        return await this.page.evaluate((inviteCode) => WAPI.getGroupInfoFromInviteLink(inviteCode), inviteCode);
    }
    /**
     * Creates a new chat group
     * @param groupName Group name
     * @param contacts Contacts that should be added.
     */
    async createGroup(groupName, contacts) {
        return await this.page.evaluate(({ groupName, contacts }) => WAPI.createGroup(groupName, contacts), { groupName, contacts });
    }
    /**
     * Removes participant from group
     * @param groupId Chat id ('0000000000-00000000@g.us')
     * @param participantId Participant id'000000000000@c.us'
     */
    async removeParticipant(groupId, participantId) {
        return await this.page.evaluate(({ groupId, participantId }) => WAPI.removeParticipant(groupId, participantId), { groupId, participantId });
    }
    /**
     * Adds participant to Group
     * @param groupId Chat id ('0000000000-00000000@g.us')
     * @param participantId Participant id'000000000000@c.us'
     */
    async addParticipant(groupId, participantId) {
        return await this.page.evaluate(({ groupId, participantId }) => WAPI.addParticipant(groupId, participantId), { groupId, participantId });
    }
    /**
     * Promotes participant as Admin in given group
     * @param groupId Chat id ('0000000000-00000000@g.us')
     * @param participantId Participant id'000000000000@c.us'
     */
    async promoteParticipant(groupId, participantId) {
        return await this.page.evaluate(({ groupId, participantId }) => WAPI.promoteParticipant(groupId, participantId), { groupId, participantId });
    }
    /**
     * Demotes admin privileges of participant
     * @param groupId Chat id ('0000000000-00000000@g.us')
     * @param participantId Participant id'000000000000@c.us'
     */
    async demoteParticipant(groupId, participantId) {
        return await this.page.evaluate(({ groupId, participantId }) => WAPI.demoteParticipant(groupId, participantId), { groupId, participantId });
    }
    /**
     * Retrieves group admins
     * @param groupId Group/Chat id ('0000000000-00000000@g.us')
     */
    async getGroupAdmins(groupId) {
        return new Promise(async (resolve, reject) => {
            const typeFunction = 'getGroupAdmins';
            const type = 'string';
            const check = [
                {
                    param: 'groupId',
                    type: type,
                    value: groupId,
                    function: typeFunction,
                    isUser: true
                }
            ];
            const validating = (0, layers_interface_1.checkValuesSender)(check);
            if (typeof validating === 'object') {
                return reject(validating);
            }
            const result = this.page.evaluate((groupId) => WAPI.getGroupAdmins(groupId), groupId);
            if (result['erro'] == true) {
                reject(result);
            }
            else {
                resolve(result);
            }
        });
    }
    /**
     * Join a group with invite code
     * @param inviteCode
     */
    async joinGroup(inviteCode) {
        inviteCode = inviteCode.replace('chat.whatsapp.com/', '');
        inviteCode = inviteCode.replace('invite/', '');
        inviteCode = inviteCode.replace('https://', '');
        inviteCode = inviteCode.replace('http://', '');
        return await this.page.evaluate((inviteCode) => WAPI.joinGroup(inviteCode), inviteCode);
    }
}
exports.GroupLayer = GroupLayer;
//# sourceMappingURL=group.layer.js.map