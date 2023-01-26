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
Object.defineProperty(exports, "__esModule", { value: true });
const connectPeer_1 = require("../peers/connectPeer");
const createPeer_1 = require("../database/createPeer");
const readFile_1 = require("./readFile");
function sendMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        const findPeers = yield (0, createPeer_1.getPeers)();
        const peers = [findPeers];
        let peersIp = [];
        for (let index = 0; index < findPeers.length; index++) {
            peersIp.push(peers[0][index].DeviceIp);
        }
        let uniqueChars = [...new Set(peersIp)];
        console.log(uniqueChars);
        const readFiles = (0, readFile_1.readFile)();
        console.log((yield readFiles).fileData.length / 60000);
        console.log(Math.trunc((yield readFiles).fileData.length / 60000) + 1);
        const loopCount = Math.trunc((yield readFiles).fileData.length / 256) + 1;
        const sliceSize = Math.ceil((yield readFiles).fileData.length / loopCount);
        const partsArray = [];
        console.log(loopCount);
        for (let i = 0; i < loopCount; i++) {
            const start = i * sliceSize;
            const end = start + sliceSize;
            partsArray.push((yield readFiles).fileData.slice(start, end));
            let elementIp = "";
            // Change Configuration Send File by External IpV4
            if (typeof uniqueChars[i] !== "undefined") {
                elementIp = uniqueChars[i];
            }
            else {
                elementIp = uniqueChars[0];
            }
            console.log("Peers Ip: " + elementIp);
            (0, connectPeer_1.connectPeer)(elementIp, partsArray[partsArray.length - 1], `${(yield readFiles).fileHash}-${i + 1}`, "sendFile", `${(yield readFiles).fileName}`);
            if (loopCount === 1) {
                continue;
            }
        }
        console.log(partsArray);
        setTimeout(() => {
            process.exit(0);
        }, 20000);
    });
}
sendMessage();
