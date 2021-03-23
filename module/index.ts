import FormModel from "./FormModel";
import {IForm} from "./interface/IForm";

export async function getFormModel (variables: any, id: object, updater: any): Promise<IForm> {
    return await new FormModel().load(variables, id, updater);
}