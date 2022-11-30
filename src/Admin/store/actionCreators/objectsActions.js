import {
    LOAD_OBJECTS, GET_OBJECT_BY_ID, LOAD_OBJECT_BY_ID, GET_OBJECTS, PUT_OBJECT, DELETE_OBJECT,
} from "Admin/constants";

export function getObjectByID(id, companyRoute) {
    if (typeof id === "undefined") {
        warn({ id }, "getObjectByID");
        return null;
    }
    return {
        type: GET_OBJECT_BY_ID,
        id,
        companyRoute,
    };
}

export function loadObjectByID(object) {
    return {
        type: LOAD_OBJECT_BY_ID,
        object,
    };
}

export function getObjects(params = {}) {
    return {
        type: GET_OBJECTS,
        params,
    };
}

export function loadObjects(objects) {
    return {
        type: LOAD_OBJECTS,
        objects,
    };
}

export function putObject({ object, params = {} }) {
    if (typeof object === "undefined") {
        warn({ object }, "putObject");
        return null;
    }
    return {
        type: PUT_OBJECT,
        object,
        params,
    };
}

export function deleteObject(id) {
    if (typeof id === "undefined") {
        warn({ id }, "deleteObject");
        return null;
    }
    return {
        type: DELETE_OBJECT,
        id,
    };
}
