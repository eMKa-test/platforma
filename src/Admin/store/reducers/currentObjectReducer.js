import { LOAD_OBJECT_BY_ID, CLEAR_MEMORY } from "Admin/constants";
import { objectOrState } from "utils/helpers";

const initialState = () => ({
    id: 1,
    name: "",
    gps: {
        lat: 0,
        long: 0,
    },
    companies: [],
});

const currentObjectReducer = (state = initialState(), action) => {
    switch (action.type) {
        case CLEAR_MEMORY:
            return initialState();
        case LOAD_OBJECT_BY_ID:
            return objectOrState(action.object, state);
        default:
            return state;
    }
};

export default currentObjectReducer;
