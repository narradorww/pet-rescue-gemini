"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadForceConnect = void 0;
const sleep_1 = require("../../utils/sleep");
async function loadForceConnect(page, callback, attempts, sleeps) {
    try {
        page.on('load', async () => {
            await page
                .evaluate(() => {
                window['connectionAttempts'] = 0;
            })
                .catch(() => undefined);
        });
        while (true) {
            if (page.isClosed())
                break;
            if (attempts <= 0) {
                attempts = 1;
            }
            if (sleeps === 0) {
                sleeps = 5000;
            }
            const checkStatus = (await page
                .evaluate((attempts) => {
                if (window.Store &&
                    window.Store.State &&
                    window.Store.State.Socket &&
                    window.Store.State.Socket.state) {
                    const status = window.Store.State.Socket.state;
                    if (status !== 'CONNECTED') {
                        if (window['connectionAttempts'] >= attempts) {
                            window.location.reload();
                            window['connectionAttempts'] = 0;
                            return true;
                        }
                        window['connectionAttempts']++;
                        return `Number of attempts ${window['connectionAttempts']} of ${attempts}, status connection: ${status}`;
                    }
                    else {
                        window['connectionAttempts'] = 0;
                    }
                }
                else {
                    const att = document.querySelectorAll('._2Nr6U');
                    if (att.length) {
                        if (window['connectionAttempts'] >= attempts) {
                            window.location.reload();
                            window['connectionAttempts'] = 0;
                            return true;
                        }
                        window['connectionAttempts']++;
                        return `Number of attempts ${window['connectionAttempts']} of ${attempts}, status connection: Not Defined`;
                    }
                }
            }, attempts)
                .catch(() => undefined));
            if (checkStatus) {
                callback(checkStatus);
            }
            await (0, sleep_1.sleep)(sleeps);
        }
    }
    catch (e) { }
}
exports.loadForceConnect = loadForceConnect;
//# sourceMappingURL=force-connect.js.map