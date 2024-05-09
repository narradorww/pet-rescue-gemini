"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceMode = void 0;
var InterfaceMode;
(function (InterfaceMode) {
    /**
     * QR code page.
     */
    InterfaceMode["QR"] = "QR";
    /**
     * Chat page.
     */
    InterfaceMode["MAIN"] = "MAIN";
    /**
     * Connection.
     */
    InterfaceMode["CONNECTION"] = "CONNECTION";
    /**
     * Loading page, waiting data from smartphone.
     */
    InterfaceMode["SYNCING"] = "SYNCING";
    /**
     * Offline page, when there are no internet.
     */
    InterfaceMode["OFFLINE"] = "OFFLINE";
    /**
     * Conflic page, when there are another whatsapp web openned.
     */
    InterfaceMode["CONFLICT"] = "CONFLICT";
    /**
     * Blocked page, by proxy.
     */
    InterfaceMode["PROXYBLOCK"] = "PROXYBLOCK";
    /**
     * Blocked page.
     */
    InterfaceMode["TOS_BLOCK"] = "TOS_BLOCK";
    /**
     * Blocked page.
     */
    InterfaceMode["SMB_TOS_BLOCK"] = "SMB_TOS_BLOCK";
    /**
     * Deprecated page.
     */
    InterfaceMode["DEPRECATED_VERSION"] = "DEPRECATED_VERSION";
})(InterfaceMode || (exports.InterfaceMode = InterfaceMode = {}));
//# sourceMappingURL=interface-mode.js.map