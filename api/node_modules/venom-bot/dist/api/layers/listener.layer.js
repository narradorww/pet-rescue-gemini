"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerLayer = void 0;
const events_1 = require("events");
const exposed_enum_1 = require("../helpers/exposed.enum");
const profile_layer_1 = require("./profile.layer");
const helpers_1 = require("../helpers");
const callonMessage = new helpers_1.callbackWile();
const callOnack = new helpers_1.callbackWile();
class ListenerLayer extends profile_layer_1.ProfileLayer {
    browser;
    page;
    listenerEmitter = new events_1.EventEmitter();
    constructor(browser, page, session, options) {
        super(browser, page, session, options);
        this.browser = browser;
        this.page = page;
        this.page.on('close', () => {
            this.cancelAutoClose();
            this.spin('Page Closed', 'fail');
        });
    }
    async initialize() {
        const functions = [...Object.values(exposed_enum_1.ExposedFn)];
        for (const func of functions) {
            const has = await this.page
                .evaluate((func) => typeof window[func] === 'function', func)
                .catch(() => false);
            if (!has) {
                await this.page
                    .exposeFunction(func, (...args) => this.listenerEmitter.emit(func, ...args))
                    .catch(() => { });
            }
        }
        this.addMsg();
        await this.page
            .evaluate(() => {
            window.WAPI.onInterfaceChange((e) => {
                window.onInterfaceChange(e);
            });
            window.WAPI.onStreamChange((e) => {
                window.onStreamChange(e);
            });
            window.WAPI.onChatState((e) => {
                window.onChatState(e);
            });
            window.WAPI.onStateChange((e) => {
                window.onStateChange(e);
            });
            window.WAPI.onUnreadMessage((e) => {
                window.onUnreadMessage(e);
            });
            window.WAPI.waitNewMessages(false, (data) => {
                data.forEach((message) => {
                    window.onMessage(message);
                });
            });
            window.WAPI.onAddedToGroup((e) => {
                window.onAddedToGroup(e);
            });
            window.WAPI.onAck((e) => {
                window.onAck(e);
            });
            window.WAPI.onPoll((e) => {
                window.onPoll(e);
            });
        })
            .catch(() => { });
    }
    async addMsg() {
        this.page
            .evaluate(() => {
            let isHeroEqual = {};
            // try {
            window.Store.Msg.on('add', async (newMessage) => {
                if (!Object.is(isHeroEqual, newMessage)) {
                    isHeroEqual = newMessage;
                    if (newMessage && newMessage.isNewMsg) {
                        const processMessageObj = await window.WAPI.processMessageObj(newMessage, true, false);
                        window.onAnyMessage(processMessageObj);
                    }
                }
            });
            // } catch { }
        })
            .catch(() => { });
    }
    async onPoll(fn) {
        this.listenerEmitter.on(exposed_enum_1.ExposedFn.onPoll, (e) => {
            fn(e);
        });
        return {
            dispose: () => {
                this.listenerEmitter.off(exposed_enum_1.ExposedFn.onPoll, (e) => {
                    fn(e);
                });
            }
        };
    }
    /**
     * @event Listens to all new messages
     * @param to callback
     * @fires Message
     */
    async onAnyMessage(fn) {
        this.listenerEmitter.on(exposed_enum_1.ExposedFn.OnAnyMessage, (msg) => {
            fn(msg);
        });
        return {
            dispose: () => {
                this.listenerEmitter.off(exposed_enum_1.ExposedFn.OnAnyMessage, (msg) => {
                    fn(msg);
                });
            }
        };
    }
    /**
     * @event Listens to messages received
     * @returns Observable stream of messages
     */
    async onStateChange(fn) {
        this.listenerEmitter.on(exposed_enum_1.ExposedFn.onStateChange, fn);
        return {
            dispose: () => {
                this.listenerEmitter.off(exposed_enum_1.ExposedFn.onStateChange, fn);
            }
        };
    }
    /**
     * @returns Returns chat state
     */
    async onChatState(fn) {
        this.listenerEmitter.on(exposed_enum_1.ExposedFn.onChatState, (state) => {
            fn(state);
        });
        return {
            dispose: () => {
                this.listenerEmitter.off(exposed_enum_1.ExposedFn.onChatState, fn);
            }
        };
    }
    ////////////////////////////////////////////////////
    /**
     * @returns Returns the current state of the connection
     */
    async onStreamChange(fn) {
        this.listenerEmitter.on(exposed_enum_1.ExposedFn.onStreamChange, (state) => {
            fn(state);
        });
        return {
            dispose: () => {
                this.listenerEmitter.off(exposed_enum_1.ExposedFn.onStreamChange, fn);
            }
        };
    }
    /**
     * @event Listens to interface mode change See {@link InterfaceState} and {@link InterfaceMode} for details
     * @returns A disposable object to cancel the event
     */
    async onInterfaceChange(fn) {
        this.listenerEmitter.on(exposed_enum_1.ExposedFn.onInterfaceChange, fn);
        return {
            dispose: () => {
                this.listenerEmitter.off(exposed_enum_1.ExposedFn.onInterfaceChange, fn);
            }
        };
    }
    //////////////////////////////////////PRO
    /**
     * @returns Returns new UnreadMessage
     */
    async onUnreadMessage(fn) {
        this.listenerEmitter.on(exposed_enum_1.ExposedFn.onUnreadMessage, fn);
        return {
            dispose: () => {
                this.listenerEmitter.off(exposed_enum_1.ExposedFn.onUnreadMessage, fn);
            }
        };
    }
    /**
     * @returns Returns new PicThumb
     */
    async onFilePicThumb(fn) {
        this.listenerEmitter.on(exposed_enum_1.ExposedFn.onFilePicThumb, fn);
        return {
            dispose: () => {
                this.listenerEmitter.off(exposed_enum_1.ExposedFn.onFilePicThumb, fn);
            }
        };
    }
    /**
     * @event Listens to messages received
     * @returns Observable stream of messages
     */
    async onMessage(fn) {
        this.listenerEmitter.on(exposed_enum_1.ExposedFn.OnMessage, (state) => {
            if (!callonMessage.checkObj(state.from, state.id)) {
                callonMessage.addObjects(state.from, state.id);
                fn(state);
            }
        });
        return {
            dispose: () => {
                this.listenerEmitter.off(exposed_enum_1.ExposedFn.OnMessage, (state) => {
                    if (!callonMessage.checkObj(state.from, state.id)) {
                        callonMessage.addObjects(state.from, state.id);
                        fn(state);
                    }
                });
            }
        };
    }
    /**
     * @event Listens to messages acknowledgement Changes
     * @returns Observable stream of messages
     */
    async onAck(fn) {
        this.listenerEmitter.on(exposed_enum_1.ExposedFn.onAck, (e) => {
            if (!callOnack.checkObj(e.ack, e.id._serialized)) {
                let key = callOnack.getObjKey(e.id._serialized);
                if (key) {
                    callOnack.module[key].id = e.ack;
                    fn(e);
                }
                else {
                    callOnack.addObjects(e.ack, e.id._serialized);
                    fn(e);
                }
            }
        });
        return {
            dispose: () => {
                this.listenerEmitter.off(exposed_enum_1.ExposedFn.onAck, (e) => {
                    if (!callOnack.checkObj(e.ack, e.id._serialized)) {
                        let key = callOnack.getObjKey(e.id._serialized);
                        if (key) {
                            callOnack.module[key].id = e.ack;
                            fn(e);
                        }
                        else {
                            callOnack.addObjects(e.ack, e.id._serialized);
                            fn(e);
                        }
                    }
                });
            }
        };
    }
    /**
     * @event Listens to live locations from a chat that already has valid live locations
     * @param chatId the chat from which you want to subscribes to live location updates
     * @param fn callback that takes in a LiveLocation
     * @returns boolean, if returns false then there were no valid live locations in the chat of chatId
     * @emits <LiveLocation> LiveLocation
     */
    async onLiveLocation(chatId, fn) {
        const method = 'onLiveLocation_' + chatId.replace('_', '').replace('_', '');
        return this.page
            .exposeFunction(method, (liveLocationChangedEvent) => fn(liveLocationChangedEvent))
            .then((_) => this.page.evaluate(({ chatId, method }) => {
            //@ts-ignore
            return WAPI.onLiveLocation(chatId, window[method]);
        }, { chatId, method }));
    }
    /**
     * @event Listens to participants changed
     * @param to group id: xxxxx-yyyy@us.c
     * @param to callback
     * @returns Stream of ParticipantEvent
     */
    async onParticipantsChanged(groupId, fn) {
        const method = 'onParticipantsChanged_' + groupId.replace('_', '').replace('_', '');
        return this.page
            .exposeFunction(method, (participantChangedEvent) => fn(participantChangedEvent))
            .then((_) => this.page.evaluate(({ groupId, method }) => {
            //@ts-ignore
            WAPI.onParticipantsChanged(groupId, window[method]);
        }, { groupId, method }));
    }
    /**
     * @event Fires callback with Chat object every time the host phone is added to a group.
     * @param to callback
     * @returns Observable stream of Chats
     */
    async onAddedToGroup(fn) {
        this.listenerEmitter.on('onAddedToGroup', fn);
        return {
            dispose: () => {
                this.listenerEmitter.off('onAddedToGroup', fn);
            }
        };
    }
    /**
     * @event Listens to messages received
     * @returns Observable stream of messages
     */
    async onIncomingCall(fn) {
        this.listenerEmitter.on('onIncomingCall', fn);
        return {
            dispose: () => {
                this.listenerEmitter.off('onIncomingCall', fn);
            }
        };
    }
}
exports.ListenerLayer = ListenerLayer;
//# sourceMappingURL=listener.layer.js.map