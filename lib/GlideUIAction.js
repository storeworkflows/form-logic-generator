"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUIAction = void 0;
function createUIAction(options) {
    var name = options.name, sysId = options.sysId, label = options.label, type = options.type, hasClientScript = options.hasClientScript, clientScript = options.clientScript, hint = options.hint;
    return {
        get sysId() {
            return sysId;
        },
        get name() {
            return name;
        },
        get type() {
            return type;
        },
        get label() {
            return label;
        },
        get hasClientScript() {
            return hasClientScript;
        },
        get clientScript() {
            return clientScript;
        },
        get hint() {
            return hint;
        }
    };
}
exports.createUIAction = createUIAction;
