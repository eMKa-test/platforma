import { SET_ERROR, RESET_ONE_ERROR, RESET_ERRORS } from "../actions/constants";

const initialState = [];

export default function getErrors(state = initialState, { type, payload }) {
    switch (type) {
        case SET_ERROR:
            return [...state, payload];
        case RESET_ONE_ERROR:
            return [...state.pop()];
        case RESET_ERRORS:
            return [];
        default: return state;
    }
}
