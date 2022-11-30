import {
    call, put, all, takeLatest,
} from "redux-saga/effects";
import map from "lodash/map";

import {
    OBJECTS_API_URL, GET_OBJECTS, PUT_OBJECT, GET_OBJECT_BY_ID, DELETE_OBJECT,
} from "Admin/constants";

import { getData, postData, delData } from "api";
import { loadObjects, loadObjectByID } from "Admin/store/actionCreators/objectsActions";
import { loadRoutes, loadSubnav } from "Admin/store/actionCreators/generalActions";

function* getObjectByID(action) {
    try {
        const data = yield call(getData, {
            mainUrl: `${OBJECTS_API_URL}/${action.id}`,
        });
        const subRoutes
            = Array.isArray(data.payload.lines) &&
            data.payload.lines.map(({ name, id }) => {
                const path = action.companyRoute
                    ? `/admin/companies/${action.companyRoute}/${action.id}/${id}`
                    : `/admin/objects/${action.id}/${id}`;
                return {
                    exact: true,
                    name,
                    path,
                    component: "LineEdit",
                };
            });
        yield all([put(loadObjectByID(data.payload)), put(loadSubnav(subRoutes))]);
    } catch (e) {
        warn(e, "saga: getObjectByID");
    }
}

export function* watchGetObjectByID() {
    try {
        yield takeLatest(GET_OBJECT_BY_ID, getObjectByID);
    } catch (e) {
        // ..
    }
}

function createObjectRoutes(data) {
    return {
        title: "Объекты",
        routes: map(data, ({ name, id }) => ({
            exact: true,
            name,
            path: `/admin/objects/${id}`,
            component: "ObjectEdit",
        })),
        items: map(data, ({ name, id }) => ({
            name,
            url: `/admin/objects/${id}`,
            icon: "hidden",
        })),
    };
}

function* getObjects() {
    try {
        const data = yield call(getData, {
            mainUrl: OBJECTS_API_URL,
            params: { limit: 12 },
        });
        yield all([
            put(loadObjects(data.payload)),
            put(loadRoutes(createObjectRoutes(data.payload))),
        ]);
    } catch (e) {
        warn(e, "saga: getObjects");
    }
}

export function* watchGetObjects() {
    try {
        yield takeLatest(GET_OBJECTS, getObjects);
    } catch (e) {
        // ...
    }
}

function* putObject(action) {
    try {
        const data = yield call(postData, {
            mainUrl: `${OBJECTS_API_URL}/${action.object.id || ""}`,
            body: action.object,
        });
        if (typeof action.object.id !== "undefined") {
            yield put(loadObjectByID(data.payload));
        } else {
            yield all([put(loadObjects(data.payload)), put(loadRoutes(createObjectRoutes(data.payload)))]);
        }
    } catch (e) {
        warn(e, "saga: putObject");
    }
}

export function* watchPutObject() {
    try {
        yield takeLatest(PUT_OBJECT, putObject);
    } catch (e) {
    }
}

function* deleteObject({ id }) {
    try {
        const data = yield call(delData, `${OBJECTS_API_URL}/${id}`);
        yield put(loadObjects(data.payload));
    } catch (e) {
        warn(e, "saga: deleteCompanies");
    }
}

export function* watchDeleteObject() {
    try {
        yield takeLatest(DELETE_OBJECT, deleteObject);
    } catch (e) {
    }
}
