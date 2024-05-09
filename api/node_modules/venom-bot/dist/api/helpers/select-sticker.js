"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeImg = exports.stickerSelect = void 0;
const sharp_1 = __importDefault(require("sharp"));
async function stickerSelect(_B, _t) {
    let _w, _ins;
    switch (_t) {
        case 0:
            _ins = await (0, sharp_1.default)(_B, { failOnError: false })
                .resize({ width: 512, height: 512 })
                .toBuffer();
            _w = (0, sharp_1.default)(_ins, { failOnError: false }).webp();
            break;
        case 1:
            _w = (0, sharp_1.default)(_B, { animated: true }).webp();
            break;
        default:
            console.error('Enter a valid number 0 or 1');
            return false;
    }
    const metadata = await _w.metadata();
    if (metadata.width > 512 || metadata.pageHeight > 512) {
        console.error(`Invalid image size (max 512x512):${metadata.width}x${metadata.pageHeight}`);
        return false;
    }
    const obj = {
        webpBase64: (await _w.toBuffer()).toString('base64'),
        metadata: {
            width: metadata.width,
            height: metadata.pageHeight
        }
    };
    return obj;
}
exports.stickerSelect = stickerSelect;
async function resizeImg(buff, size) {
    const _ins = await (0, sharp_1.default)(buff, { failOnError: false })
        .resize({ width: size.width, height: size.height })
        .toBuffer(), _w = (0, sharp_1.default)(_ins, { failOnError: false }).jpeg(), _webb64 = (await _w.toBuffer()).toString('base64');
    return _webb64;
}
exports.resizeImg = resizeImg;
//# sourceMappingURL=select-sticker.js.map