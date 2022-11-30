import {
    LOAD_PROMO_BY_COMPANIES,
    CLEAR_PROMO,
} from "Admin/constants";

const initState = {
    content: [],
    pagination: {},
    dates: [],
};

const promoReducer = (state = initState, action) => {
    switch (action.type) {
        case CLEAR_PROMO:
            return initState;
        case LOAD_PROMO_BY_COMPANIES:
            return action.promo;
        default:
            return state;
    }
};

export default promoReducer;
