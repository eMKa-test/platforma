import { LOAD_USERS } from "Admin/constants";
import usersReducer from '../usersReducer';

describe('usersReducer', () => {
    const state = [];

    test('init', () => {
        const res = usersReducer(undefined, {});
        expect(res).toEqual([]);
    });

    test('default', () => {
        const action = { type: 'DEFAULT' };
        const res = usersReducer(state, action);
        expect(res).toEqual([]);
    });

    test(LOAD_USERS, () => {
        const users=[];
        const action = { type: LOAD_USERS, users };
        const lastState = usersReducer(state, action);
        expect(lastState).toEqual(users);
    });
});
