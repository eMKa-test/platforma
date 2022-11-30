import { LOAD_USERS } from "Admin/constants";
import { arrayOrState } from "utils/helpers";

const usersReducer = (state = [], action) => {
    switch (action.type) {
        case LOAD_USERS:
            return arrayOrState(action.users, state);
        default:
            return state;
    }
};

export default usersReducer;
