"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeDeleteToken = void 0;
async function scrapeDeleteToken(page) {
    const result = await page
        .evaluate(() => {
        const scrape = window.pathSession;
        if (scrape === true) {
            return true;
        }
        else {
            return false;
        }
    })
        .catch(() => undefined);
    return result;
}
exports.scrapeDeleteToken = scrapeDeleteToken;
//# sourceMappingURL=scrape-deletetoken.js.map