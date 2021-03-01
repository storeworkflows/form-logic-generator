export declare function createUIAction(options: {
    name: string;
    sysId: string;
    label: string;
    type: string;
    hasClientScript: boolean;
    clientScript: string;
    hint: string;
}): {
    readonly sysId: string;
    readonly name: string;
    readonly type: string;
    readonly label: string;
    readonly hasClientScript: boolean;
    readonly clientScript: string;
    readonly hint: string;
};
