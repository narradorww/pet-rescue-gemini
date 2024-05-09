"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFileJson = void 0;
const path = require('path');
const fs_1 = require("fs");
function checkFileJson(mergedOptions, Session) {
    const pathTokens = path.join(path.resolve(process.cwd() + mergedOptions.mkdirFolderToken, mergedOptions.folderNameToken), `${Session}.data.json`);
    if ((0, fs_1.existsSync)(pathTokens)) {
        return true;
    }
    else {
        return false;
    }
}
exports.checkFileJson = checkFileJson;
//# sourceMappingURL=check-token-file.js.map