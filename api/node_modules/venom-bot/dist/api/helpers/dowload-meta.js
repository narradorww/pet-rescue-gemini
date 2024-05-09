"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dowloadMetaFileBase64 = void 0;
const cheerio_1 = require("cheerio");
const axios_1 = __importDefault(require("axios"));
const buffer_1 = require("buffer");
async function dowloadMetaFileBase64(url) {
    const backImage = 'iVBORw0KGgoAAAANSUhEUgAAAGMAAABjCAIAAAAAWSnCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA0SURBVHhe7cExAQAAAMKg9U9tCj8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADipAXM+AAFcstx4AAAAAElFTkSuQmCC';
    try {
        const response = await (0, axios_1.default)(url);
        const htmlContent = response.data;
        const $ = (0, cheerio_1.load)(htmlContent);
        let thumbnail = '';
        $('link[type="image/png"]').each((index, element) => {
            const imgURL = $(element).attr('href');
            if (imgURL) {
                if (!imgURL.includes('http')) {
                    thumbnail = url + imgURL;
                }
                else {
                    thumbnail = imgURL;
                }
                return false;
            }
        });
        $('meta[property="og:image"]').each((index, element) => {
            const imgURL = $(element).attr('content');
            if (imgURL) {
                if (!imgURL.includes('http')) {
                    thumbnail = url + imgURL;
                }
                else {
                    thumbnail = imgURL;
                }
                return false;
            }
        });
        $('meta[itemprop="image"]').each((index, element) => {
            const imgURL = $(element).attr('content');
            if (imgURL) {
                if (!imgURL.includes('http')) {
                    thumbnail = url + imgURL;
                }
                else {
                    thumbnail = imgURL;
                }
                return false;
            }
        });
        if (!thumbnail) {
            $('meta[name="twitter:image"]').each((index, element) => {
                const imgURL = $(element).attr('content');
                if (imgURL) {
                    if (!imgURL.includes('http')) {
                        thumbnail = url + imgURL;
                    }
                    else {
                        thumbnail = imgURL;
                    }
                    return false;
                }
            });
        }
        if (thumbnail) {
            const imageResponse = await (0, axios_1.default)(thumbnail, {
                responseType: 'arraybuffer'
            });
            const base64Thumbnail = buffer_1.Buffer.from(imageResponse.data).toString('base64');
            return base64Thumbnail;
        }
        return backImage;
    }
    catch (e) {
        console.log('Erro meta thumbnail', e);
        return backImage;
    }
}
exports.dowloadMetaFileBase64 = dowloadMetaFileBase64;
//# sourceMappingURL=dowload-meta.js.map