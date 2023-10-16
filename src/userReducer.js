const initialState = {
  username: '',
  realName: '',
  bio: '',
  location: '',
  userId: '',
  profilePhoto: '',
  following: [],
  followers: []
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
    case 'SET_PROFILE_PHOTO':
      return { ...state, profilePhoto: action.payload };
    case 'SET_FOLLOWERS':
      return { ...state, followers: action.payload };
    case 'SET_FOLLOWING':
      return { ...state, following: action.payload };
    case 'FOLLOW_USER':
      return { ...state, following: action.payload.following };
    case 'UNFOLLOW_USER':
      return { ...state, following: action.payload.following };

    default:
      return state;
  }
};
