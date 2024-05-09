"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
function sleep(time) {
    try {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    catch (e) { }
}
exports.sleep = sleep;
//# sourceMappingURL=sleep.js.map