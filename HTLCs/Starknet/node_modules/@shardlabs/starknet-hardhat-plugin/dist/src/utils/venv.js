"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrefixedCommand = exports.normalizeVenvPath = void 0;
const path_1 = __importDefault(require("path"));
const check_command_path_1 = require("./check-command-path");
function normalizeVenvPath(venvPath) {
    if (venvPath[0] === "~") {
        venvPath = path_1.default.join(process.env.HOME, venvPath.slice(1));
    }
    return path_1.default.normalize(venvPath);
}
exports.normalizeVenvPath = normalizeVenvPath;
function getPrefixedCommand(venvPath, command) {
    const prefixedCommand = path_1.default.join(venvPath, "bin", command);
    (0, check_command_path_1.checkCommandPath)(prefixedCommand);
    return prefixedCommand;
}
exports.getPrefixedCommand = getPrefixedCommand;
//# sourceMappingURL=venv.js.map