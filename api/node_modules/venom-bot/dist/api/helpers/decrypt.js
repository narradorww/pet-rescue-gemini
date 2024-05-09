"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.magix = exports.mediaTypes = exports.timeout = exports.makeOptions = void 0;
const crypto = __importStar(require("crypto"));
const futoin_hkdf_1 = __importDefault(require("futoin-hkdf"));
const makeOptions = (useragentOverride) => ({
    responseType: 'arraybuffer',
    headers: {
        'User-Agent': processUA(useragentOverride),
        DNT: 1,
        'Upgrade-Insecure-Requests': 1,
        origin: 'https://web.whatsapp.com/',
        referer: 'https://web.whatsapp.com/'
    }
});
exports.makeOptions = makeOptions;
const timeout = (ms) => new Promise((res) => setTimeout(res, ms));
exports.timeout = timeout;
exports.mediaTypes = {
    IMAGE: 'Image',
    VIDEO: 'Video',
    AUDIO: 'Audio',
    PTT: 'Audio',
    DOCUMENT: 'Document',
    STICKER: 'Image'
};
const processUA = (userAgent) => {
    let ua = userAgent ||
        'WhatsApp/2.2108.8 Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36';
    if (!ua.includes('WhatsApp'))
        ua = 'WhatsApp/2.2108.8 ' + ua;
    return ua;
};
const magix = (fileData, mediaKeyBase64, mediaType, expectedSize) => {
    const encodedHex = fileData.toString('hex');
    const encodedBytes = hexToBytes(encodedHex);
    const mediaKeyBytes = base64ToBytes(mediaKeyBase64);
    const info = `WhatsApp ${exports.mediaTypes[mediaType.toUpperCase()]} Keys`;
    const hash = 'sha256';
    const salt = new Uint8Array(32);
    const expandedSize = 112;
    const mediaKeyExpanded = (0, futoin_hkdf_1.default)(mediaKeyBytes, expandedSize, {
        salt,
        info,
        hash
    });
    const iv = mediaKeyExpanded.slice(0, 16);
    const cipherKey = mediaKeyExpanded.slice(16, 48);
    const decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, iv);
    const decoded = decipher.update(encodedBytes);
    const mediaDataBuffer = expectedSize
        ? fixPadding(decoded, expectedSize)
        : decoded;
    return mediaDataBuffer;
};
exports.magix = magix;
const fixPadding = (data, expectedSize) => {
    let padding = (16 - (expectedSize % 16)) & 0xf;
    if (padding > 0) {
        if (expectedSize + padding == data.length) {
            //  console.log(`trimmed: ${padding} bytes`);
            data = data.slice(0, data.length - padding);
        }
        else if (data.length + padding == expectedSize) {
            // console.log(`adding: ${padding} bytes`);
            let arr = new Uint16Array(padding).map((b) => padding);
            data = Buffer.concat([data, Buffer.from(arr)]);
        }
    }
    //@ts-ignore
    return Buffer.from(data, 'utf-8');
};
const hexToBytes = (hexStr) => {
    const intArray = [];
    for (let i = 0; i < hexStr.length; i += 2) {
        intArray.push(parseInt(hexStr.substr(i, 2), 16));
    }
    return new Uint8Array(intArray);
};
const base64ToBytes = (base64Str) => {
    const binaryStr = Buffer.from(base64Str, 'base64').toString('binary');
    const byteArray = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        byteArray[i] = binaryStr.charCodeAt(i);
    }
    return byteArray;
};
//# sourceMappingURL=decrypt.js.map