import { Page, Browser } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { RetrieverLayer } from './retriever.layer';
import { GroupSettings } from '../model/enum';
export declare class GroupLayer extends RetrieverLayer {
    browser: Browser;
    page: Page;
    constructor(browser: Browser, page: Page, session?: string, options?: CreateConfig);
    /**
     * Parameters to change group settings, see {@link GroupSettings for details}
     * @param {string} groupId group number
     * @param {GroupSettings} settings
     * @param {boolean} value
     */
    setGroupSettings(groupId: string, settings: GroupSettings, value: boolean): Promise<Object>;
    /**
     * Parameters to change group image
     * @param {string} groupId group number
     * @param {string} path of image
     */
    setGroupImage(groupId: string, path: string): Promise<boolean>;
    /**
     * Parameters to change group title
     * @param {string} groupId group number
     * @param {string} title group title
     */
    setGroupTitle(groupId: string, title: string): Promise<Object>;
    /**
     * Parameters to change group description
     * @param {string} groupId group number
     * @param {string} description group description
     */
    setGroupDescription(groupId: string, description: string): Promise<Object>;
    /**
     * Retrieve all groups
     * @returns array of groups
     */
    getAllChatsGroups(): Promise<object[]>;
    /**
     * Retrieve all groups new messages
     * @returns array of groups
     */
    getChatGroupNewMsg(): Promise<import("../model").Chat[]>;
    /**
     * Removes the host device from the group
     * @param groupId group id
     */
    leaveGroup(groupId: string): Promise<any>;
    /**
     * Retrieves group members as [Id] objects
     * @param groupId group id
     */
    getGroupMembers(groupId: string, time: string): Promise<Object>;
    /**
     * Reset group invitation link
     * @param chatId
     * @returns boolean
     */
    revokeGroupInviteLink(chatId: string): Promise<boolean>;
    /**
     * Generates group-invite link
     * @param chatId
     * @returns Invitation link
     */
    getGroupInviteLink(chatId: string): Promise<string>;
    /**
     * Generates group-invite link
     * @param inviteCode
     * @returns Invite code from group link. Example: CMJYfPFqRyE2GxrnkldYED
     */
    getGroupInfoFromInviteLink(inviteCode: string): Promise<string | boolean>;
    /**
     * Creates a new chat group
     * @param groupName Group name
     * @param contacts Contacts that should be added.
     */
    createGroup(groupName: string, contacts: string | string[]): Promise<import("../model").GroupCreation>;
    /**
     * Removes participant from group
     * @param groupId Chat id ('0000000000-00000000@g.us')
     * @param participantId Participant id'000000000000@c.us'
     */
    removeParticipant(groupId: string, participantId: string | string[]): Promise<void>;
    /**
     * Adds participant to Group
     * @param groupId Chat id ('0000000000-00000000@g.us')
     * @param participantId Participant id'000000000000@c.us'
     */
    addParticipant(groupId: string, participantId: string | string[]): Promise<boolean>;
    /**
     * Promotes participant as Admin in given group
     * @param groupId Chat id ('0000000000-00000000@g.us')
     * @param participantId Participant id'000000000000@c.us'
     */
    promoteParticipant(groupId: string, participantId: string | string[]): Promise<void>;
    /**
     * Demotes admin privileges of participant
     * @param groupId Chat id ('0000000000-00000000@g.us')
     * @param participantId Participant id'000000000000@c.us'
     */
    demoteParticipant(groupId: string, participantId: string | string[]): Promise<void>;
    /**
     * Retrieves group admins
     * @param groupId Group/Chat id ('0000000000-00000000@g.us')
     */
    getGroupAdmins(groupId: string): Promise<Object>;
    /**
     * Join a group with invite code
     * @param inviteCode
     */
    joinGroup(inviteCode: string): Promise<string | boolean>;
}
