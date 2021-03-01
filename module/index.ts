import FormModel from "./FormModel";

export function getFormModel (variables: any, id: object, updater: any) {
    new FormModel().load(variables, id, updater).then();
}