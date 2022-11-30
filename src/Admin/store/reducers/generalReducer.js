import { LOAD_OPERATOR } from "Admin/constants";

const initialState = () => ({
    loading: true,
    operator: { email: "" },
});

const loaderReducer = (state = initialState(), action) => {
    switch (action.type) {
        case LOAD_OPERATOR:
            // actual client user
            return Object.assign({}, state, { operator: action.operator });
        case /PUT_\S\w*/.test(action.type) && action.type:
        case /GET_\S\w*/.test(action.type) && action.type:
            return Object.assign({}, state, { loading: true });
        case /LOAD_\S\w*/.test(action.type) && action.type:
            return Object.assign({}, state, { loading: false });
        default:
            return state;
    }
};

export default loaderReducer;
