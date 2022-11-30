import { GET_DATA, RESET_DATA } from "../actions/constants";

const initialState = [];

export default function getAllUploads(state = initialState, { type, payload }) {
    switch (type) {
        case GET_DATA:
            return [...state, payload];
        case RESET_DATA:
            return [];
        default: return state;
    }
}
