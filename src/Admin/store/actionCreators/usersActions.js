import { LOAD_USERS, GET_USERS, PUT_USER } from "Admin/constants";

export function getUsers(params = {}) {
    return {
        type: GET_USERS,
        params,
    };
}

export function loadUsers({ payload = [] }) {
    return {
        type: LOAD_USERS,
        users: payload,
    };
}

export function putUser({ user, params = {} }) {
    if (typeof user === "undefined") {
        warn({ user }, "putUser");
        return null;
    }
    return {
        type: PUT_USER,
        user,
        params,
    };
}
