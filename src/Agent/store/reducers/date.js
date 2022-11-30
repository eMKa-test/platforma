import { SET_DATE } from "../actions/constants";

const initialState = "";

export default function getDate(state = initialState, { type, payload }) {
    switch (type) {
        case SET_DATE:
            return payload;
        default: return state;
    }
}
