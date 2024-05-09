"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpinnies = void 0;
const spinnies_1 = __importDefault(require("spinnies"));
let spinnies = null;
function getSpinnies(options) {
    if (!spinnies) {
        spinnies = new spinnies_1.default(options);
    }
    return spinnies;
}
exports.getSpinnies = getSpinnies;
//# sourceMappingURL=spinnies.js.map