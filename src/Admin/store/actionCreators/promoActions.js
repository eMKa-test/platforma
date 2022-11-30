import {
    LOAD_PROMO_BY_COMPANIES,
    GET_PROMO_BY_COMPANIES,
    PUT_PROMO,
    DELETE_PROMO_BY_ID,
    CLEAR_PROMO,
} from "Admin/constants";

export function getPromoByCompaniesID(companyId, section) {
    return {
        type: GET_PROMO_BY_COMPANIES,
        companyId,
        section,
    };
}

export function loadPromo(promo) {
    return {
        type: LOAD_PROMO_BY_COMPANIES,
        promo,
    };
}

export function putPromo(promo, company) {
    return {
        type: PUT_PROMO,
        promo,
        company,
    };
}

export function deletePromo(contentid, { section, companyId }) {
    return {
        type: DELETE_PROMO_BY_ID,
        contentid,
        section,
        companyId,
    };
}

export function clearPromo() {
    return {
        type: CLEAR_PROMO,
    };
}
