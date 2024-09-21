"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCommandPath = void 0;
const starknet_plugin_error_1 = require("../starknet-plugin-error");
const fs_1 = __importDefault(require("fs"));
function checkCommandPath(commandPath) {
    if (!fs_1.default.existsSync(commandPath)) {
        throw new starknet_plugin_error_1.StarknetPluginError(`Command ${commandPath} not found.`);
    }
}
exports.checkCommandPath = checkCommandPath;
//# sourceMappingURL=check-command-path.js.map