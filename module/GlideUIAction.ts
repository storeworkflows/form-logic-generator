export function createUIAction(options: { name: string, sysId: string, label: string, type: string, hasClientScript: boolean, clientScript: string, hint: string }) {
    const {name, sysId, label, type, hasClientScript, clientScript, hint} = options;
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
