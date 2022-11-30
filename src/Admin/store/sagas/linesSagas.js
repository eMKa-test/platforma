import {
    call, put, takeLatest, all,
} from "redux-saga/effects";

import { OBJECTS_API_URL, PUT_LINE, GET_LINE_BY_ID } from "Admin/constants";

import { getData, postData } from "api";
import { loadLineByID } from "Admin/store/actionCreators/linesActions";
import { loadObjectByID, getObjects } from "Admin/store/actionCreators/objectsActions";
import { loadSubnav } from "Admin/store/actionCreators/generalActions";

function* getLineByID(action) {
    try {
        const data = yield call(getData, {
            mainUrl: `${OBJECTS_API_URL}/${action.objectID}/lines/${action.id}`,
        });
        // const subRoutes
        //     = Array.isArray(data.payload.points) &&
        //     data.payload.points.map(point => ({
        //         exact: true,
        //         name: point.name,
        //         path: `/admin/objects/${point.projectId}/${point.lineId}/${point.id}`,
        //         component: "PointEdit",
        //     }));
        yield all([put(loadLineByID(data.payload))]);
    } catch (e) {
        warn(e, "saga: getLineByID");
    }
}

export function* watchGetLineByID() {
    try {
        yield takeLatest(GET_LINE_BY_ID, getLineByID);
    } catch (e) {
        // ...
    }
}

function* putLine(action) {
    try {
        const data = yield call(postData, {
            mainUrl: `${OBJECTS_API_URL}/${action.objectID}/lines/${action.line.id || ""}`,
            body: action.line,
            params: action.params,
        });
        yield put(getObjects());
        if (!action.line.id) {
            const subRoutes = Array.isArray(data.payload.lines) &&
            data.payload.lines.map(({ projectId, id, name }) => ({
                exact: true,
                name,
                path: `/admin/objects/${projectId}/${id}`,
                component: "LineEdit",
            }));
            yield all([put(loadObjectByID(data.payload)), put(loadSubnav(subRoutes))]);
        } else {
            yield put(loadLineByID(data.payload));
        }
    } catch (e) {
        warn(e, "saga: putLine");
    }
}

export function* watchPutLine() {
    try {
        yield takeLatest(PUT_LINE, putLine);
    } catch (e) {
        // ..
    }
}
