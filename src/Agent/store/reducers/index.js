import { combineReducers } from "redux";
import uploads from "./uploads";
import progress from "./progress";
import date from "./date";
import doneItems from "./doneitems";
import report from "./report";
import errors from "./errors";

export default combineReducers({
    uploads,
    progress,
    date,
    doneItems,
    report,
    errors,
});
