import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { userReducer } from './userReducer';
import { meowReducer } from './meowReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    meow: meowReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});
