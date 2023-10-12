import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMeows } from '../meowActions';
import axios from 'axios';
import Meow from './Meow';

const MeowFeed = () => {
  const dispatch = useDispatch();

  const prevMeowsRef = useRef();

  const meows = useSelector((state) => state.meow.meows);

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const query = searchParams.get('q');

  useEffect(() => {
    prevMeowsRef.current = meows;
  }, [meows]);

  useEffect(() => {
    fetchMeows();
  }, [dispatch, query]);

  const fetchMeows = async () => {
    let url = `${process.env.REACT_APP_BACKEND_URL}/meows/`;
    if (query) {
      url = `${process.env.REACT_APP_BACKEND_URL}/search?q=${query}`;
    }
    try {
      const response = await axios.get(url, { withCredentials: true });
      if (response.data.message) {
        dispatch(setMeows([]));
        return;
      }
      const sortedMeows = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const areMeowsDifferent =
        !prevMeowsRef.current ||
        sortedMeows.length !== prevMeowsRef.current.length ||
        !sortedMeows.every((meow, index) => meow._id === prevMeowsRef.current[index]._id);
      if (areMeowsDifferent) {
        dispatch(setMeows(sortedMeows));
      }
    } catch (error) {
      console.error('Error fetching meows:', error);
    }
  };

  return (
    <div>
      {meows.length === 0 ? (
        <p>Loading...</p>
      ) : (
        meows.filter((meow) => !meow.isAReply).map((meow) => <Meow key={meow._id} meow={meow} />)
      )}
    </div>
  );
};

export default MeowFeed;
