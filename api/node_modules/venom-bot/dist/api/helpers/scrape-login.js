"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeLogin = void 0;
async function scrapeLogin(page) {
    const result = await page
        .evaluate(() => {
        const count = document.querySelector('._9a59P');
        let data;
        data = false;
        if (count != null) {
            const text = count.textContent, timeNumber = text.match('Invalid');
            if (timeNumber) {
                data = true;
            }
            return data;
        }
    })
        .catch(() => undefined);
    return result;
}
exports.scrapeLogin = scrapeLogin;
//# sourceMappingURL=scrape-login.js.map