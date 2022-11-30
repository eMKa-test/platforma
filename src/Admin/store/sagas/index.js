import { all } from "redux-saga/effects";

import { watchGetOperator } from "./generalSagas";
import { watchGetUsers, watchPutUser } from "./usersSagas";
import { watchPutLine, watchGetLineByID } from "./linesSagas";
import {
    watchPutPromo,
    watchDeletePromo,
    watchGetPromoByCompanyId,
} from "./promoSagas";
import {
    watchGetObjects,
    watchPutObject,
    watchGetObjectByID,
    watchDeleteObject,
} from "./objectsSagas";
import {
    watchGetCompanies,
    watchPutCompanies,
    watchGetCompaniesByID,
    watchDeleteCompanies,
} from "./companiesSagas";

const watchers = [
    watchGetUsers(),
    watchPutUser(),
    watchGetOperator(),
    watchGetObjects(),
    watchPutObject(),
    watchGetObjectByID(),
    watchPutLine(),
    watchGetLineByID(),
    watchGetCompanies(),
    watchPutCompanies(),
    watchPutPromo(),
    watchGetCompaniesByID(),
    watchDeleteCompanies(),
    watchDeleteObject(),
    watchDeletePromo(),
    watchGetPromoByCompanyId(),
];

const rootSaga = function* rootSaga() {
    yield all(watchers);
};

export default rootSaga;
