const initialState = {
  isRemeowing: false
};

export const remeowReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_IS_REMEOWING':
      return {
        ...state,
        isRemeowing: true
      };
    case 'CLEAR_IS_REMEOWING':
      return {
        ...state,
        isRemeowing: false
      };
    default:
      return state;
  }
};
