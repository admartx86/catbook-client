import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMeows } from '../meowActions';
import Meow from './Meow';

const MeowFeed = () => {
  const dispatch = useDispatch();
  const meows = useSelector((state) => state.meow.meows);

  useEffect(() => {
    const fetchMeows = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/meows/`, {
          withCredentials: true
        });
        const sortedMeows = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        if (JSON.stringify(sortedMeows) !== JSON.stringify(meows)) {
          dispatch(setMeows(sortedMeows));
        }
      } catch (error) {
        console.error('Error fetching meows:', error);
      }
    };
    fetchMeows();
  }, [dispatch, meows]);

  return (
    <div>
      {meows.length === 0 ? (
        <p>Loading...</p>
      ) : (
        meows.map((meow) => <Meow key={meow._id} meow={meow} />)
      )}
    </div>
  );
};

export default MeowFeed;
