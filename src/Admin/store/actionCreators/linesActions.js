import { GET_LINE_BY_ID, LOAD_LINE_BY_ID, PUT_LINE } from "Admin/constants";

export function getLineByID({ objectID, id }) {
    if (typeof objectID === "undefined" || typeof id === "undefined") {
        warn({ id, objectID }, "putLine");
        return null;
    }
    return {
        type: GET_LINE_BY_ID,
        objectID,
        id,
    };
}

export function loadLineByID(line) {
    return {
        type: LOAD_LINE_BY_ID,
        line,
    };
}

export function putLine({ objectID, line, params = {} }) {
    if (typeof line === "undefined" || typeof objectID === "undefined") {
        warn({ line, objectID }, "putLine");
        return null;
    }
    return {
        type: PUT_LINE,
        objectID,
        line,
        params,
    };
}
