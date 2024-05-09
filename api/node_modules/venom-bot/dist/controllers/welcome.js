"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeScreen = void 0;
const yoo_hoo_1 = require("yoo-hoo");
let welcomeShown = false;
function welcomeScreen() {
    if (welcomeShown) {
        return;
    }
    welcomeShown = true;
    (0, yoo_hoo_1.yo)('VENOM-BOT', { color: 'cyan' });
    console.log('\n\n');
}
exports.welcomeScreen = welcomeScreen;
//# sourceMappingURL=welcome.js.map