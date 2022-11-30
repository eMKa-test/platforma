import { LOAD_OBJECTS } from "Admin/constants";
import { arrayOrState } from "utils/helpers";

const objectsReducer = (state = [], action) => {
    switch (action.type) {
        case LOAD_OBJECTS:
            return arrayOrState(action.objects, state);
        default:
            return state;
    }
};

export default objectsReducer;
