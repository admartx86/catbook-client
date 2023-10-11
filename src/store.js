import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { userReducer } from './userReducer';
import { meowReducer } from './meowReducer';
import { replyReducer } from './replyReducer';
import { remeowReducer } from './remeowReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    meow: meowReducer,
    reply: replyReducer,
    remeow: remeowReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});
