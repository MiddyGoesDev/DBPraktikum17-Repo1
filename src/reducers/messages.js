import {MESSAGE_SEND, MESSAGES_NEXT} from '../actions/types';

const initialState = {
  list: []
};

export default function messages(state = initialState, action = {}) {
  switch (action.type) {
    case MESSAGE_SEND:
      return { ...state };
    case MESSAGES_NEXT:
      return { ...state, list: action.payload };
    default:
      return state
  }
}
