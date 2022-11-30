import {
    CLEAR_MEMORY, LOAD_OPERATOR, LOAD_NAVIGATION, LOAD_SUB_NAV,
} from "Admin/constants";

export function clearMemory() {
    return { type: CLEAR_MEMORY };
}

export function loadOperator({ payload }) {
    return {
        type: LOAD_OPERATOR,
        operator: payload,
    };
}

export function loadRoutes({ title = "", routes = [], items = [] }) {
    return {
        type: LOAD_NAVIGATION,
        current: { title, items, routes },
    };
}

export function loadSubnav(subnav) {
    return {
        type: LOAD_SUB_NAV,
        subnav,
    };
}

export default null;
