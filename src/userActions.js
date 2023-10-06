export const setUsername = (username) => ({
  type: 'SET_USERNAME',
  payload: username
});

export const setRealName = (realName) => ({
  type: 'SET_REALNAME',
  payload: realName
});

export const setBio = (bio) => ({
  type: 'SET_BIO',
  payload: bio
});

export const setLocation = (location) => ({
  type: 'SET_LOCATION',
  payload: location
});

export const checkPersistedUser = () => (dispatch) => {
  const storedData = localStorage.getItem('CatbookToken');
  if (storedData) {
    try {
      const { username, realName } = JSON.parse(storedData);

      dispatch(setUsername(username));
      dispatch(setRealName(realName));
    } catch (e) {
      console.error('Invalid JSON', e);
      localStorage.removeItem('CatbookToken');
    }
  }
};
