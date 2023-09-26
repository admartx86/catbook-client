
// import { createAction } from '@reduxjs/toolkit';

// export const setUsername = createAction('user/setUsername');

export const setUsername = (username) => ({
    type: "SET_USERNAME",
    payload: username,
  });