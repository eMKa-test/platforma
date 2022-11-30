import * as action from "./constants";

export function addData(arr) {
    return {
        type: action.GET_DATA,
        payload: arr,
    };
}

export function resetData() {
    return {
        type: action.RESET_DATA,
    };
}

export function setDate(time) {
    return {
        type: action.SET_DATE,
        payload: time,
    };
}

export function getDone(payload) {
    return {
        type: action.IM_DONE,
        payload,
    };
}

export function resetDone() {
    return {
        type: action.RESET_DONE,
    };
}

export function setError(payload) {
    return {
        type: action.SET_ERROR,
        payload,
    };
}

export function resetOneError() {
    return {
        type: action.RESET_ONE_ERROR,
    };
}

export function resetErrors() {
    return {
        type: action.RESET_ERRORS,
    };
}

export function setTotal(payload) {
    return {
        type: action.CALC_TOTAL,
        payload,
    };
}

export function changeTotal(payload) {
    return {
        type: action.CHANGE_TOTAL,
        payload,
    };
}

export function resetTotal() {
    return {
        type: action.RESET_TOTAL,
    };
}

export function setReportText(payload) {
    return {
        type: action.REPORT_TEXT,
        payload,
    };
}

export function resetReportText() {
    return {
        type: action.REPORT_RESET,
    };
}
