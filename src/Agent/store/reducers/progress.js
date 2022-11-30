import { CALC_TOTAL, CHANGE_TOTAL, RESET_TOTAL } from "../actions/constants";

const initialState = 0;

export default function getCountLoadContent(state = initialState, { type, payload }) {
    switch (type) {
        case CALC_TOTAL:
            return state + payload;
        case CHANGE_TOTAL:
            return state - payload;
        case RESET_TOTAL:
            return 0;
        default: return state;
    }
}
