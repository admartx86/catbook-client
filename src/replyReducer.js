const initialState = {
  isReplying: false
};

export const replyReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_IS_REPLYING':
      return {
        ...state,
        isReplying: true
      };
    case 'CLEAR_IS_REPLYING':
      return {
        ...state,
        isReplying: false
      };
    default:
      return state;
  }
};
