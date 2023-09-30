export const setUsername = (username) => ({
  type: 'SET_USERNAME',
  payload: username
});

export const checkPersistedUser = () => (dispatch) => {
  const loggedInUser = localStorage.getItem('CatbookToken');
  if (loggedInUser) {
    try {
      console.log('Found user in localStorage:', loggedInUser);
      const foundUser = JSON.parse(loggedInUser);
      dispatch(setUsername(foundUser));
    } catch (e) {
      console.error('Invalid JSON', e);
      localStorage.removeItem('CatbookToken');
    }
  }
};
