import FormModel from "./FormModel";
import {IForm} from "./interface/IForm";
import PlatformResource from "./PlatformResource";

export async function getFormModel (variables: any, id: object, updater: any): Promise<IForm> {
    return await new FormModel().load(variables, id, updater);
}

export async function loadResources () {
    return await new PlatformResource().loadPlatformResources();
}