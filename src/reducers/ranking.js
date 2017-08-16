const initialState = {
  list: []
};

export default function rankings(state = initialState, action = {}) {
  switch (action.type) {
    case "RANKING_SORTED":
      return { ...state, list: action.payload };
    default:
      return state
  }
}
