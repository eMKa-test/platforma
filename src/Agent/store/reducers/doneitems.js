import { IM_DONE, RESET_DONE } from "../actions/constants";

const initialState = [];

export default function getAllDone(state = initialState, { type, payload }) {
    switch (type) {
        case IM_DONE:
            return [...state, payload];
        case RESET_DONE:
            return [];
        default: return state;
    }
}
