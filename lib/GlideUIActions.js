"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GlideUIAction_1 = require("./GlideUIAction");
var SAVE_ACTION_NAME = 'sysverb_ws_save';
var GlideUIActions = /** @class */ (function () {
    function GlideUIActions(uiActions, actionExecutor, formSubmitValidator, formSubmitExecutor, gFormAccessor) {
        var _this = this;
        if (!uiActions) {
            // eslint-disable-next-line no-console
            console.warn('uiActions must be provided');
            return;
        }
        var _currentAction;
        var _inProgress = false;
        var _uiActionsById = {};
        var _uiActions = uiActions.map(function (uiAction) {
            if (!uiAction) {
                return;
            }
            var action = GlideUIAction_1.createUIAction({
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
        this.getActions = function () {
            return _uiActions;
        };
        this.getAction = function (sysId) {
            return _uiActionsById[sysId];
        };
        this.getSaveActionName = function () {
            return SAVE_ACTION_NAME;
        };
        /**
         * Search by name or sysId
         * @param name
         */
        this.getActionByName = function (name) {
            if (_inProgress) {
                return null;
            }
            return _uiActions.find(function (a) {
                return a.name === name || a.sysId === name;
            });
        };
        this.submit = function (sysId, options) {
            if (options === void 0) { options = { skipValidation: true }; }
            var skipValidation = options.skipValidation;
            var action = _this.getAction(sysId);
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
            return actionExecutor(action, { runOn: 'server' }).finally(function () {
                _inProgress = false;
                _currentAction = undefined;
            });
        };
        this.click = function (sysId) {
            if (gFormAccessor) {
                var gForm = gFormAccessor();
                if (gForm)
                    gForm.clearMessages();
            }
            var action = _this.getAction(sysId);
            _currentAction = action;
            if (!action) {
                return Promise.reject(false);
            }
            // goto server if there is no clientScript
            if (!action.hasClientScript || !action.clientScript) {
                return formSubmitExecutor(action);
            }
            return actionExecutor(action, { runOn: 'client' }).finally(function () {
                _currentAction = undefined;
            });
        };
        this.getActiveActionName = function () {
            return _currentAction
                ? _currentAction.name || _currentAction.sysId
                : 'none';
        };
    }
    return GlideUIActions;
}());
exports.default = GlideUIActions;
