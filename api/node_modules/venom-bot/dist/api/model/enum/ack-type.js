"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AckType = void 0;
var AckType;
(function (AckType) {
    AckType[AckType["MD_DOWNGRADE"] = -7] = "MD_DOWNGRADE";
    AckType[AckType["INACTIVE"] = -6] = "INACTIVE";
    AckType[AckType["CONTENT_UNUPLOADABLE"] = -5] = "CONTENT_UNUPLOADABLE";
    AckType[AckType["CONTENT_TOO_BIG"] = -4] = "CONTENT_TOO_BIG";
    AckType[AckType["CONTENT_GONE"] = -3] = "CONTENT_GONE";
    AckType[AckType["EXPIRED"] = -2] = "EXPIRED";
    AckType[AckType["FAILED"] = -1] = "FAILED";
    AckType[AckType["CLOCK"] = 0] = "CLOCK";
    AckType[AckType["SENT"] = 1] = "SENT";
    AckType[AckType["RECEIVED"] = 2] = "RECEIVED";
    AckType[AckType["READ"] = 3] = "READ";
    AckType[AckType["PLAYED"] = 4] = "PLAYED";
})(AckType || (exports.AckType = AckType = {}));
//# sourceMappingURL=ack-type.js.map