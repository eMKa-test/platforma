import { call, put, takeLatest } from "redux-saga/effects";

import { USERS_API_URL, GET_USERS, PUT_USER } from "Admin/constants";

import { getData, postData } from "api";
import { loadUsers } from "Admin/store/actionCreators/usersActions";

function* getUsers(action) {
    const data = yield call(getData, {
        mainUrl: USERS_API_URL,
        params: {
            limit: 200,
            ...action.params,
        },
    });
    yield put(loadUsers(data));
}

export function* watchGetUsers() {
    try {
        yield takeLatest(GET_USERS, getUsers);
    } catch (e) {
        // ...
    }
}

function* putUser(action) {
    try {
        const data = yield call(postData, {
            mainUrl: `${USERS_API_URL}/${action.user.id || ""}`,
            body: action.user,
            params: {
                limit: 200,
                ...action.params,
            },
        });
        yield put(loadUsers(data));
    } catch (e) {
        // ...
    }
}

export function* watchPutUser() {
    try {
        yield takeLatest(PUT_USER, putUser);
    } catch (e) {
        // ...
    }
}
