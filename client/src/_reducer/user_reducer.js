import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_action/types';

const initialState = {}
// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                loginSuccess: action.payload
            };
        default:
            return state;
    }
}
