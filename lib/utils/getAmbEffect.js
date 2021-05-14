"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var amb_client_js_1 = __importDefault(require("amb-client-js"));
var ambClient;
function getAMBClient() {
    if (!ambClient)
        ambClient = amb_client_js_1.default.getClient();
    return ambClient;
}
exports.default = getAMBClient;
