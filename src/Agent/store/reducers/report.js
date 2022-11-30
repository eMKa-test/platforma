import { REPORT_TEXT, REPORT_RESET } from "../actions/constants";

const initialState = "";

export default function getReportText(state = initialState, { type, payload }) {
    switch (type) {
        case REPORT_TEXT:
            return payload;
        case REPORT_RESET:
            return "";
        default: return state;
    }
}
