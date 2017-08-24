import {USER_LOGIN_SUCCESS, USER_LOGIN, USER_LOGIN_FAILURE, USER_LOGOUT, CREATE_STATS, USER_REGISTER, USER_REGISTER_SUCESS, USER_REGISTER_FAILURE} from '../actions/types'
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
        //     return {...state, user: action.payload, isLoggedIn: true};
        case USER_LOGIN_SUCCESS:
            return {...state, user: action.payload, isLoggedIn: true};
        case USER_LOGIN_FAILURE:
            return {...state, user: action.payload, isLoggedIn: false};
        // case USER_REGISTER: //brauchen wir nichts weiter sagen, weil dies denke ich eine Art default Fall ist.
        //     return {...state, user: action.payload, isLoggedIn: true};  //hätte wir den in der action aber auch nicht, würde er immer SUCESS nehmen
        //und dann hätten wir immer isLoggedIn true was dann zu fehlern führen würde
        case USER_REGISTER_SUCESS:
            return {...state, user: action.payload, isLoggedIn: true};
        case USER_REGISTER_FAILURE:
            return {...state, user: action.payload, isLoggedIn: false};
        case USER_LOGOUT:
            return {...state, user: null, isLoggedIn: false};
            case CREATE_STATS:
            return {...state, user: action.payload};
        default:
            return state;
    }
};
