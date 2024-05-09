"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketStream = exports.SocketState = void 0;
var SocketState;
(function (SocketState) {
    // for state
    SocketState["CONFLICT"] = "CONFLICT";
    SocketState["CONNECTED"] = "CONNECTED";
    SocketState["DEPRECATED_VERSION"] = "DEPRECATED_VERSION";
    SocketState["OPENING"] = "OPENING";
    SocketState["PAIRING"] = "PAIRING";
    SocketState["PROXYBLOCK"] = "PROXYBLOCK";
    SocketState["SMB_TOS_BLOCK"] = "SMB_TOS_BLOCK";
    SocketState["TIMEOUT"] = "TIMEOUT";
    SocketState["TOS_BLOCK"] = "TOS_BLOCK";
    SocketState["UNLAUNCHED"] = "UNLAUNCHED";
    SocketState["UNPAIRED"] = "UNPAIRED";
    SocketState["UNPAIRED_IDLE"] = "UNPAIRED_IDLE";
    // for stream
    SocketState["DISCONNECTED"] = "DISCONNECTED";
    SocketState["SYNCING"] = "SYNCING";
    SocketState["RESUMING"] = "RESUMING";
    SocketState["WITHOUT_INTERNET"] = "WITHOUT INTERNET";
})(SocketState || (exports.SocketState = SocketState = {}));
var SocketStream;
(function (SocketStream) {
    SocketStream["CONNECTED"] = "CONNECTED";
    SocketStream["DISCONNECTED"] = "DISCONNECTED";
    SocketStream["RESUMING"] = "RESUMING";
    SocketStream["SYNCING"] = "SYNCING";
})(SocketStream || (exports.SocketStream = SocketStream = {}));
//# sourceMappingURL=socket-state.js.map