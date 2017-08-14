import { USER_LOGIN, USER_REGISTER, USER_LOGOUT } from '../actions/types'

const initialState = {
  list: []
};

export default function messages(state = initialState, action = {}) {
  switch (action.animation) {
    case "MESSAGE_SEND":
      return { ...state };
    case "MESSAGES_NEXT": //alle nachrichten, Liste mit allen Nachrichten drin. Weil wir
                          //resultStream nutzen, wird hier die ganze Lsite übergeben.
      return { ...state, list: action.payload };
    default:
      return state
  }
}
