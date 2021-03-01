"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegisteredModalDataSource = exports.QUERY_FRAGMENT = exports.MODALS_KEY = exports.REGISTERED_MODAL_KEY = exports.REGISTERED_MODAL_QUERY_KEY = void 0;
var utils_1 = require("../utils");
var lodash_1 = __importDefault(require("lodash"));
exports.REGISTERED_MODAL_QUERY_KEY = 'GlideRegisteredModalQuery_Query';
exports.REGISTERED_MODAL_KEY = 'registeredModals';
exports.MODALS_KEY = 'modals';
exports.QUERY_FRAGMENT = "\n" + exports.REGISTERED_MODAL_QUERY_KEY + " {\n\t" + exports.REGISTERED_MODAL_KEY + " {\n\t\t" + exports.MODALS_KEY + " {\n\t\t\tcomponent\n\t\t\tnamespace\n\t\t\tapi\n\t\t}\n\t}\n}\n";
var registerGlideModal = function (modals, snFormModal) {
    if (modals === void 0) { modals = []; }
    lodash_1.default.forEach(modals, function (modal) {
        snFormModal.registerGlideModal(modal.component, modal.namespace, modal.api);
    });
};
var createTransform = function (getValueOrDefault) { return function (data) {
    var modals = getValueOrDefault(exports.MODALS_KEY, [])(data);
    return {
        modals: modals
    };
}; };
var createRegisteredModalDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + exports.REGISTERED_MODAL_QUERY_KEY + "." + exports.REGISTERED_MODAL_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: exports.QUERY_FRAGMENT,
        variables: [],
        transform: transform,
        selectableProps: {
            modals: {
                default: []
            }
        }
    });
};
exports.createRegisteredModalDataSource = createRegisteredModalDataSource;
