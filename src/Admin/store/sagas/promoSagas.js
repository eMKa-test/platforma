import {
    call, put, all, takeLatest,
} from "redux-saga/effects";

import {
    PROMO_API_URL,
    GET_PROMO_BY_COMPANIES,
    PUT_PROMO,
    DELETE_PROMO_BY_ID,
} from "Admin/constants";

import { getData, postData, delData } from "api";
import { loadPromo } from "Admin/store/actionCreators/promoActions";

function* getPromoByCompanyId(action) {
    try {
        const data = yield call(getData, {
            mainUrl: `${PROMO_API_URL}/${action.companyId}/${action.section}/video`,
        });
        const dataDates = yield call(getData, {
            mainUrl: `${PROMO_API_URL}/${action.companyId}/${action.section}/video/calendar`,
        });
        const result = {
            content: data.payload,
            dates: dataDates.payload,
        };
        yield put(loadPromo(result));
    } catch (e) {
        warn(e, "saga: getPromoByCompanyId");
    }
}

export function* watchGetPromoByCompanyId() {
    try {
        yield takeLatest(GET_PROMO_BY_COMPANIES, getPromoByCompanyId);
    } catch (e) {
    }
}

function* putPromo(action) {
    try {
        yield call(postData, {
            mainUrl: `${PROMO_API_URL}/${action.promo.id}`,
            body: action.promo,
        });
        const data = yield call(getData, {
            mainUrl: `${PROMO_API_URL}/${action.company.id}/${action.company.section}/video`,
        });
        const dataDates = yield call(getData, {
            mainUrl: `${PROMO_API_URL}/${action.company.id}/${action.company.section}/video/calendar`,
        });
        const result = {
            content: data.payload,
            dates: dataDates.payload,
        };
        yield put(loadPromo(result));
    } catch (e) {
        warn(e, "saga: putPromo");
    }
}

export function* watchPutPromo() {
    try {
        yield takeLatest(PUT_PROMO, putPromo);
    } catch (e) {
    }
}

function* deletePromoById({ contentid, section, companyId }) {
    try {
        const data = yield call(delData, `${PROMO_API_URL}/${contentid}`);
        if (data.success) {
            yield call(getPromoByCompanyId, { section, companyId });
        }
    } catch (e) {
        warn(e, "saga: deletePromo");
    }
}

export function* watchDeletePromo() {
    try {
        yield takeLatest(DELETE_PROMO_BY_ID, deletePromoById);
    } catch (e) {
    }
}
