import { LOAD_COMPANIES } from "Admin/constants";

const companiesReducer = (state = [], action) => {
    switch (action.type) {
        case LOAD_COMPANIES:
            return action.companies;
        default:
            return state;
    }
};

export default companiesReducer;
