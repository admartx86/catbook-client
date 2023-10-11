const initialState = {
  username: '',
  realName: '',
  bio: '',
  location: '',
  userId: ''
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_REALNAME':
      return { ...state, realName: action.payload };
    case 'SET_BIO':
      return { ...state, bio: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };
    default:
      return state;
  }
};
