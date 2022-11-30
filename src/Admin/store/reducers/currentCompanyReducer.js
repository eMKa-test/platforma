import { LOAD_COMPANIES_BY_ID, CLEAR_MEMORY } from "Admin/constants";

const initialState = () => ({
    id: -1,
    name: "",
    contents: [],
});

const currentCompanyReducer = (state = initialState(), action) => {
    switch (action.type) {
        case CLEAR_MEMORY:
            return initialState();
        case LOAD_COMPANIES_BY_ID:
            return { ...action.companies };
        default:
            return state;
    }
};

export default currentCompanyReducer;
