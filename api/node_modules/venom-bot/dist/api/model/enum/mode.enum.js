"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMode = void 0;
var onMode;
(function (onMode) {
    /**
     * Indicates a change in the user interface.
     * @description Used to receive information about the current interface the user is on.
     */
    onMode["interfaceChange"] = "interfaceChange";
    /**
     * Monitors new messages.
     * @description Used to receive notifications when a new message is received.
     */
    onMode["newMessage"] = "newMessage";
    /**
     * Receives QR code updates.
     * @description Used to receive updated information about the QR code.
     */
    onMode["qrcode"] = "qrcode";
    /**
     * User connection information.
     * @description Used to obtain information about the user's connection.
     */
    onMode["connection"] = "connection";
    /**
     * Monitors the status of a message.
     * @description Used to receive notifications about the delivery status of a message.
     */
    onMode["newOnAck"] = "newOnAck";
})(onMode || (exports.onMode = onMode = {}));
//# sourceMappingURL=mode.enum.js.map