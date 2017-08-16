
const initialState = {
  int: ""
};

export default function statistics(state = initialState, action = {}) {
  switch (action.type) {
    console.log(action)
    case "STATISTICS":
      return { ...state, int: action.payload};
    default:
      return state
  }
}
