import {USER_LOGIN_SUCCESS, USER_LOGIN_FAILURE, USER_LOGOUT, CREATE_STATS, USER_REGISTER} from '../actions/types'
import {BAQEND_CONNECTED} from 'redux-baqend'

const initialState = {
    isLoggedIn: false,
    user: null
};

export default function auth(state = initialState, action = {}) {
    switch (action.type) {
        case BAQEND_CONNECTED:
            return {...state, user: action.user, isLoggedIn: !!action.user};
        // case USER_LOGIN:
        //     return {...state, user: action.payload[0], isLoggedIn: action.payload[1]};
        case USER_LOGIN_SUCCESS:
            return {...state, user: action.payload, isLoggedIn: true};
        case USER_LOGIN_FAILURE:
            return {...state, user: action.payload, isLoggedIn: false};
        case USER_REGISTER:
            return {...state, user: action.payload, isLoggedIn: true};
        case USER_LOGOUT:
            return {...state, user: null, isLoggedIn: false};
            case CREATE_STATS:
            return {...state, user: action.payload};
        default:
            return state;
    }
};
