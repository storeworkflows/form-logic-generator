import { createUIAction } from './GlideUIAction';

const SAVE_ACTION_NAME = 'sysverb_ws_save';

export default class GlideUIActions {
    private getActions: () => any;
    private readonly getAction: (sysId: string) => any;
    private getSaveActionName: () => string;
    private getActionByName: (name: string) => (null | any);
    private submit: (sysId: string, options?: {skipValidation: boolean}) => (boolean | any);
    private click: (sysId: string) => (Promise<never>);
    private getActiveActionName: () => any;

    constructor(
        uiActions: any,
        actionExecutor: any,
        formSubmitValidator: any,
        formSubmitExecutor: any,
        gFormAccessor: any
    ) {
        if (!uiActions) {
            // eslint-disable-next-line no-console
            console.warn('uiActions must be provided');
            return;
        }
        let _currentAction: any;
        let _inProgress = false;
        let _uiActionsById: any = {};
        let _uiActions = uiActions.map((uiAction: any) => {
            if (!uiAction) {
                return;
            }
            let action = createUIAction({
                name: uiAction.name,
                sysId: uiAction.sysId,
                label: uiAction.label,
                type: uiAction.type,
                clientScript: uiAction.clientScript,
                hasClientScript: uiAction.hasClientScript,
                hint: uiAction.hint
            });
            _uiActionsById[action.sysId] = action;
            return action;
        });

        this.getActions = () => {
            return _uiActions;
        };

        this.getAction = sysId => {
            return _uiActionsById[sysId];
        };

        this.getSaveActionName = () => {
            return SAVE_ACTION_NAME;
        };

        /**
         * Search by name or sysId
         * @param name
         */
        this.getActionByName = name => {
            if (_inProgress) {
                return null;
            }
            return _uiActions.find((a: any) => {
                return a.name === name || a.sysId === name;
            });
        };

        this.submit = (sysId, options: {skipValidation: boolean} = {skipValidation: true}) => {
            const { skipValidation } = options;
            let action = this.getAction(sysId);
            _currentAction = action;
            if (!action) {
                return false;
            }
            _inProgress = true;

            // validate the onSubmit scripts
            if (!skipValidation && !formSubmitValidator(action)) {
                _inProgress = false;
                return false;
            }

            return actionExecutor(action, { runOn: 'server' }).finally(() => {
                _inProgress = false;
                _currentAction = undefined;
            });
        };

        this.click = sysId => {
            if (gFormAccessor) {
                let gForm = gFormAccessor();
                if (gForm) gForm.clearMessages();
            }
            let action = this.getAction(sysId);
            _currentAction = action;
            if (!action) {
                return Promise.reject(false);
            }

            // goto server if there is no clientScript
            if (!action.hasClientScript || !action.clientScript) {
                return formSubmitExecutor(action);
            }
            return actionExecutor(action, { runOn: 'client' }).finally(() => {
                _currentAction = undefined;
            });
        };

        this.getActiveActionName = () => {
            return _currentAction
                ? _currentAction.name || _currentAction.sysId
                : 'none';
        };
    }
}
