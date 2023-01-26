"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
function readFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(process.argv[2]);
        const fileName = path_1.default.basename(process.argv[2]);
        const buffer = fs_1.default.readFileSync(filePath);
        const fileHash = crypto_1.default
            .createHash("sha256")
            .update("Ec" + fileName)
            .digest("hex");
        function mySplit(a, delimiter) {
            const result = [];
            let currentToken = [];
            for (let i = 0; i < a.length; i++) {
                if (a[i] === delimiter) {
                    if (currentToken.length !== 0)
                        result.push(currentToken);
                    currentToken = [];
                }
                else {
                    currentToken.push(a[i]);
                }
            }
            if (currentToken.length !== 0)
                result.push(currentToken);
            return result;
        }
        const fileData = mySplit(buffer, -1)[0];
        console.log(fileData, fileHash, fileName);
        return {
            fileData,
            fileHash,
            fileName,
        };
    });
}
exports.readFile = readFile;
