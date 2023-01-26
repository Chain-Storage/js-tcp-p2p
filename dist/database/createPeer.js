"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.getPeers = exports.removePeer = exports.createPeer = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = __importStar(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
class UserClass {
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserClass.prototype, "PublicIpV4", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserClass.prototype, "DeviceIp", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserClass.prototype, "hostName", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserClass.prototype, "peerHash", void 0);
function createPeer(PublicIpV4, DeviceIp, hostName, peerHash) {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv_1.default.config();
        yield (0, mongoose_1.connect)(`${process.env.MONGOURI}`);
        const UserModel = (0, typegoose_1.getModelForClass)(UserClass);
        let document = yield UserModel.create({
            PublicIpV4,
            DeviceIp,
            hostName,
            peerHash,
        });
        mongoose_1.default.disconnect();
    });
}
exports.createPeer = createPeer;
function removePeer(DeviceIp, hostName) {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv_1.default.config();
        yield (0, mongoose_1.connect)(`${process.env.MONGOURI}`);
        const UserModel = (0, typegoose_1.getModelForClass)(UserClass);
        let document = yield UserModel.deleteMany({
            DeviceIp,
            hostName,
        }).exec();
        mongoose_1.default.disconnect();
    });
}
exports.removePeer = removePeer;
function getPeers() {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv_1.default.config();
        yield (0, mongoose_1.connect)(`${process.env.MONGOURI}`);
        const UserModel = (0, typegoose_1.getModelForClass)(UserClass);
        let document = yield UserModel.find({}).exec();
        mongoose_1.default.disconnect();
        return document;
    });
}
exports.getPeers = getPeers;
