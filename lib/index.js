"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormModel = void 0;
var FormModel_1 = __importDefault(require("./FormModel"));
function getFormModel(variables, id, updater) {
    new FormModel_1.default().load(variables, id, updater).then();
}
exports.getFormModel = getFormModel;
