export const setUsername = (username) => ({
  type: 'SET_USERNAME',
  payload: username
});

export const setRealName = (realName) => ({
  type: 'SET_REALNAME',
  payload: realName
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

// export const checkPersistedUser = () => (dispatch) => {
//   const loggedInUser = localStorage.getItem('CatbookToken');
//   if (loggedInUser) {
//     try {
//       console.log('Found user in localStorage:', loggedInUser);
//       const foundUser = JSON.parse(loggedInUser);

//       // Dispatch actions to set username and realName
//       if (foundUser.username) {
//         dispatch(setUsername(foundUser.username));
//       }
//       if (foundUser.realName) {
//         dispatch(setRealName(foundUser.realName));
//       }
//     } catch (e) {
//       console.error('Invalid JSON', e);
//       localStorage.removeItem('CatbookToken');
//     }
//   }
// };

// export const checkPersistedUser = () => (dispatch) => {
//   const loggedInUser = localStorage.getItem('CatbookToken');
//   if (loggedInUser) {
//     try {
//       console.log('Found user in localStorage:', loggedInUser);
//       const foundUser = JSON.parse(loggedInUser);
//       dispatch(setUsername(foundUser));
//     } catch (e) {
//       console.error('Invalid JSON', e);
//       localStorage.removeItem('CatbookToken');
//     }
//   }
// };
