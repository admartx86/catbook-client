const initialState = {
  username: '',
  realName: ''
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_REALNAME':
      return { ...state, realName: action.payload };
    default:
      return state;
  }
};
