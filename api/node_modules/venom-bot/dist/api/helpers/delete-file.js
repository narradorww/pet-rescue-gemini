"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
async function deleteFiles(mergedOptions, Session, spinnies) {
    try {
        spinnies.add(`removeFile`, { text: '....' });
        const pathTokens = path_1.default.join(path_1.default.resolve(process.cwd() + mergedOptions.mkdirFolderToken, mergedOptions.folderNameToken), `${Session}.data.json`);
        if ((0, fs_1.existsSync)(pathTokens)) {
            (0, fs_1.unlink)(pathTokens, (err) => {
                if (err) {
                    spinnies.fail(`removeFile`, {
                        text: `Not removed file: ${pathTokens}`
                    });
                }
                spinnies.succeed(`removeFile`, {
                    text: `Removed file: ${pathTokens}`
                });
            });
        }
        else {
            spinnies.fail(`removeFile`, { text: `Not Files: ${pathTokens}` });
        }
    }
    catch (e) { }
}
exports.deleteFiles = deleteFiles;
//# sourceMappingURL=delete-file.js.map