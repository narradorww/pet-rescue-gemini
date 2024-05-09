"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceState = void 0;
var InterfaceState;
(function (InterfaceState) {
    /**
     * When there are no internet.
     */
    InterfaceState["OFFLINE"] = "OFFLINE";
    /**
     * When the whatsapp web page is loading.
     */
    InterfaceState["OPENING"] = "OPENING";
    /**
     * When the whatsapp web is connecting to smartphone after QR code scan.
     */
    InterfaceState["PAIRING"] = "PAIRING";
    /**
     * When the whatsapp web is syncing messages with smartphone.
     */
    InterfaceState["SYNCING"] = "SYNCING";
    /**
     * When the whatsapp web is syncing messages with smartphone after a disconnection.
     */
    InterfaceState["RESUMING"] = "RESUMING";
    /**
     * When the whatsapp web is connecting to whatsapp server.
     */
    InterfaceState["CONNECTING"] = "CONNECTING";
    /**
     * When the whatsapp web is ready.
     */
    InterfaceState["NORMAL"] = "NORMAL";
    /**
     * When the whatsapp web couldn't connect to smartphone.
     */
    InterfaceState["WITHOUT_INTERNET"] = "WITHOUT INTERNET";
})(InterfaceState || (exports.InterfaceState = InterfaceState = {}));
//# sourceMappingURL=interface-state.js.map