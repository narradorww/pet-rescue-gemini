"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64MimeType = void 0;
function base64MimeType(encoded) {
    let result = null;
    if (typeof encoded !== 'string') {
        return result;
    }
    const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
        result = mime[1];
    }
    return result;
}
exports.base64MimeType = base64MimeType;
//# sourceMappingURL=base64-mimetype.js.map