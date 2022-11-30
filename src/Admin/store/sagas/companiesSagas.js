import {
    call, put, all, takeLatest, takeEvery,
} from "redux-saga/effects";
import map from "lodash/map";

import {
    COMPANIES_API_URL,
    GET_COMPANIES,
    PUT_COMPANIES,
    DELETE_COMPANIES,
    GET_COMPANIES_BY_ID,
    OBJECTS_API_URL,
} from "Admin/constants";

import { getData, postData, delData } from "api";
import {
    loadCompanies, loadCompaniesByID,
} from "Admin/store/actionCreators/companiesActions";
import { loadObjects } from "Admin/store/actionCreators/objectsActions";
import { loadRoutes, loadSubnav } from "Admin/store/actionCreators/generalActions";

function createCompaniesRoutes(data) {
    return {
        title: "Компании",
        routes: map(data, ({ name, id }) => ({
            exact: true,
            name,
            path: `/admin/companies/${id}`,
            component: "CompaniesEdit",
        })),
        items: map(data, ({ name, id }) => ({
            name,
            url: `/admin/companies/${id}`,
            icon: "hidden",
        })),
    };
}

function* getCompaniesByID(action) {
    try {
        const data = yield call(getData, {
            mainUrl: OBJECTS_API_URL,
            params: { limit: 12 },
        })
        const dataCompany = yield call(getData, {
            mainUrl: `${COMPANIES_API_URL}/${action.id}`,
        });
        const objectFromCompanies = data.payload.filter((obj) => {
            if (obj.companies && obj.companies.includes(Number(action.id))) {
                return obj;
            }
        });
        const promoNav = Array.isArray(dataCompany.payload.contents) && dataCompany.payload.contents.map((name) => {
            const path = `/admin/companies/${action.id}/${name.toLowerCase()}`;
            return {
                exact: true,
                name,
                path,
                component: "Promo",
            };
        });
        const subRoutes
            = Array.isArray(objectFromCompanies) &&
            objectFromCompanies.map(({ name, id }) => {
                const path = `/admin/companies/${action.id}/${id}`;
                return {
                    exact: true,
                    name,
                    path,
                    component: "ObjectEdit",
                };
            });
        yield all([
            put(loadObjects(objectFromCompanies)),
            put(loadCompaniesByID(dataCompany.payload)),
            put(loadSubnav([...subRoutes, ...promoNav])),
        ]);
    } catch (e) {
        warn(e, "saga: getCompaniesByID");
    }
}

export function* watchGetCompaniesByID() {
    yield takeEvery(GET_COMPANIES_BY_ID, getCompaniesByID);
}

function* getCompanies() {
    try {
        const data = yield call(getData, {
            mainUrl: COMPANIES_API_URL,
            params: { limit: 12 },
        });
        yield all([
            put(loadCompanies(data.payload)),
            put(loadRoutes(createCompaniesRoutes(data.payload))),
        ]);
    } catch (e) {
        warn(e, "saga: getCompanies");
    }
}

export function* watchGetCompanies() {
    try {
        yield takeLatest(GET_COMPANIES, getCompanies);
    } catch (e) {
        // ...
    }
}

function* putCompanies(action) {
    try {
        const data = yield call(postData, {
            mainUrl: `${COMPANIES_API_URL}/${action.company.id || ""}`,
            body: action.company,
        });
        if (typeof action.company.id !== "undefined") {
            yield put(loadCompaniesByID(data.payload));
        } else {
            yield all([put(loadCompanies(data.payload)), put(loadRoutes(createCompaniesRoutes(data.payload)))]);
        }
    } catch (e) {
        warn(e, "saga: putCompanies");
    }
}

export function* watchPutCompanies() {
    try {
        yield takeLatest(PUT_COMPANIES, putCompanies);
    } catch (e) {
        // ...
    }
}

function* deleteCompanies({ id }) {
    try {
        const data = yield call(delData, `${COMPANIES_API_URL}/${id}`);
        yield all([put(loadCompanies(data.payload)), put(loadRoutes(createCompaniesRoutes(data.payload)))]);
    } catch (e) {
        warn(e, "saga: deleteCompanies");
    }
}

export function* watchDeleteCompanies() {
    yield takeLatest(DELETE_COMPANIES, deleteCompanies);
}
