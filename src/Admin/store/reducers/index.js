import { combineReducers } from "redux";

import generalReducer from "./generalReducer";
import usersReducer from "./usersReducer";
import companiesReducer from "./companiesReducer";
import objectsReducer from "./objectsReducer";
import currentCompanyReducer from "./currentCompanyReducer";
import currentObjectReducer from "./currentObjectReducer";
import currentLineReducer from "./currentLineReducer";
import navConfigReducer from "./navConfigReducer";
import promoReducer from "./promoReducer";

const reducers = combineReducers({
    general: generalReducer,
    users: usersReducer,
    companies: companiesReducer,
    promo: promoReducer,
    objects: objectsReducer,
    currentCompany: currentCompanyReducer,
    currentObject: currentObjectReducer,
    currentLine: currentLineReducer,
    navConfig: navConfigReducer,
});

export default reducers;
