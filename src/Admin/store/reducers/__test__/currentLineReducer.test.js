import { LOAD_LINE_BY_ID, CLEAR_MEMORY } from "Admin/constants";
import { objectOrState } from "utils/helpers";
import usersReducer from "../usersReducer";

describe("currentLineReducer", ()=>{
    test(LOAD_LINE_BY_ID, () => {
        const state=()=>{};
        const action = { type: LOAD_LINE_BY_ID, state };
        const lastState = usersReducer(state, action);
        expect(lastState).toEqual(state);
    });

})
