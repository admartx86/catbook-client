import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUsername } from '../actions'; 

export const usePersistedUser = () => {
    const dispatch = useDispatch();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('CatbookToken');
    if (loggedInUser) {
      try {
        const foundUser = JSON.parse(loggedInUser);
        dispatch(setUsername(foundUser));
      } catch (e) {
        console.error('Invalid JSON', e);
        localStorage.removeItem('CatbookToken');
      }
    }
  }, [dispatch]);
};