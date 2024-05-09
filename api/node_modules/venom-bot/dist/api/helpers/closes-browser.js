"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkingCloses = void 0;
async function checkingCloses(browser, mergedOptions, callStatus) {
    new Promise(async (resolve, reject) => {
        if (typeof browser !== 'string') {
            let err;
            do {
                try {
                    await new Promise((r) => setTimeout(r, 2000));
                    if (browser['isClose'] ||
                        (mergedOptions.browserWS && !browser.isConnected())) {
                        if (mergedOptions.browserWS) {
                            browser.disconnect();
                            callStatus && callStatus('serverClose');
                        }
                        if (browser['isClose']) {
                            browser.close().catch((e) => reject(e));
                            callStatus && callStatus('browserClose');
                        }
                        err = false;
                    }
                    else {
                        throw 1;
                    }
                }
                catch (e) {
                    err = true;
                }
            } while (err);
        }
    });
}
exports.checkingCloses = checkingCloses;
//# sourceMappingURL=closes-browser.js.map