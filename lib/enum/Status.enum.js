"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status;
(function (Status) {
    Status["CHANGED"] = "RECORD_STATUS_CHANGED";
    Status["UPDATED"] = "updated";
    Status["INSERTED"] = "inserted";
    Status["DELETED"] = "deleted";
    Status["LIVEUPDATED"] = "liveUpdated";
    Status["UNMODIFIED"] = "unmodified";
    Status["MODIFIED"] = "modified";
    Status["CLOSED"] = "closed";
})(Status || (Status = {}));
exports.default = Status;
