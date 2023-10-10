import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { userReducer } from './userReducer';
import { meowReducer } from './meowReducer';
import { replyReducer } from './replyReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    meow: meowReducer,
    reply: replyReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});
