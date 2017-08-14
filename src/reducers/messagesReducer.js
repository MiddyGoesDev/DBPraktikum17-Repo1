<<<<<<< HEAD
//import { USER_LOGIN, USER_REGISTER, USER_LOGOUT } from '../actions/types'

=======
>>>>>>> 1160602d5004b4e6afee6b7ab494d471245a5a0f
const initialState = {
  list: []
};

export default function messages(state = initialState, action = {}) {
  switch (action.type) {
    case "MESSAGE_SEND":
      return { ...state };
    case "MESSAGES_NEXT": //alle nachrichten, Liste mit allen Nachrichten drin. Weil wir
                          //resultStream nutzen, wird hier die ganze Lsite übergeben.
      return { ...state, list: action.payload };
    default:
      return state
  }
}
