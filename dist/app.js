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
const net_1 = __importDefault(require("net"));
const peerIp_1 = require("./peers/peerIp");
const createPeer_1 = require("./database/createPeer");
const files_1 = require("./database/files");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const peresFunction = yield (0, peerIp_1.peers)();
        console.log(peresFunction);
        const server = net_1.default.createServer((socket) => {
            // get client's IP address
            const clientIp = socket.remoteAddress;
            console.log(`client connected from ${clientIp}`);
            // 'connection' listener
            let data = "";
            socket.on("data", (chunk) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Received data from peer: ${chunk}`);
                const obj = JSON.parse(chunk);
                if (obj.type === "sendFile") {
                    console.log(obj.fileName);
                    (0, files_1.createFile)(obj.data, obj.fileName, "utf8", obj.fileHash);
                    socket.end();
                }
                else if (obj.type === "getFile") {
                    const fileData = yield (0, files_1.getFileDb)(obj.fileHash);
                    console.log(fileData[1]);
                    let jsonString = JSON.stringify(fileData);
                    let chunks = [];
                    let chunkSize = 256;
                    for (let i = 0; i < jsonString.length; i += chunkSize) {
                        chunks.push(jsonString.slice(i, i + chunkSize));
                    }
                    for (let i = 0; i < chunks.length; i++) {
                        socket.write(chunks[i]);
                    }
                    socket.end();
                }
            }));
            socket.on("end", () => {
                console.log("peer disconnected");
            });
            socket.on("error", (err) => {
                console.log(err);
            });
        });
        process.on("SIGINT", function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("Delete to databse");
                yield (0, createPeer_1.removePeer)(peresFunction.DeviceIp, peresFunction.hostName);
                server.close(function () {
                    process.exit();
                });
            });
        });
        server.listen({
            host: peresFunction.DeviceIp,
            port: peresFunction.port,
            path: `${__dirname}/files`,
        }, () => {
            (0, createPeer_1.createPeer)(peresFunction.PublicIpV4, peresFunction.DeviceIp, peresFunction.hostName, peresFunction.peerHash);
            console.log("server bound");
        });
    });
}
main();
