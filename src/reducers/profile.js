
const initialState = {
  int: ""
};

export default function statistics(state = initialState, action = {}) {
  switch (action.type) {
    console.log(action)
    case "STATISTICS_KILL":
      return { ...state, int: action.payload};
    case "STATISTICS_DEATHS":
      return { ...state, int: action.payload};
    case "STATISTICS_EXP":
      return { ...state, int: action.payload};
    default:
      return state
  }
}
