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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mine = exports.fileToBase64 = void 0;
const mimeTypes = require('mime-types');
const fs = __importStar(require("fs"));
/**
 * Converts given file into base64 string
 * @param path file path
 * @param mime Optional, will retrieve file mime automatically if not defined (Example: 'image/png')
 */
async function fileToBase64(path, mime) {
    if (fs.existsSync(path)) {
        const base64 = fs.readFileSync(path, { encoding: 'base64' });
        if (mime === undefined) {
            mime = await mimeTypes.lookup(path);
        }
        const data = `data:${mime};base64,${base64}`;
        return data;
    }
    else {
        return false;
    }
}
exports.fileToBase64 = fileToBase64;
async function Mine(path) {
    if (fs.existsSync(path)) {
        const mime = await mimeTypes.lookup(path);
        return mime;
    }
    else {
        return false;
    }
}
exports.Mine = Mine;
//# sourceMappingURL=file-to-base64.js.map