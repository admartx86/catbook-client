import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMeows } from '../meowActions';
import axios from 'axios';
import Meow from './Meow';

const MeowFeed = ({ isSelectingGif, setIsSelectingGif, filterCriteria, username, userId }) => {
  const dispatch = useDispatch();

  const prevMeowsRef = useRef();

  const meows = useSelector((state) => state.meow.meows);
const following = useSelector((state) => state.user.following);

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const query = searchParams.get('q');

  // const [isSelectingGif, setIsSelectingGif] = useState(false);
  let [dummyValue, setDummyValue] = useState(0);

  const filteredMeows = meows.filter(meow => {
    if (filterCriteria === 'Meows') {
      return (meow.author.username === username) && !meow.isAReply && !meow.isAPlaceholder;
    } else if (filterCriteria === 'Replies') {
      return meow.author.username === username && meow.isAReply && !meow.isAPlaceholder;
    } else if (filterCriteria === 'Media') {
      return meow.author.username === username && (meow.meowMedia || meow.gifUrl) && !meow.isAReply && !meow.isAPlaceholder; 
    } else if (filterCriteria === 'Likes') {
      return meow.likedBy.includes(userId) && !meow.isAPlaceholder;
    } else if (filterCriteria === 'Following') {
      return  following.includes(meow.author._id); 
    } else if (filterCriteria === 'All') {
      return !meow.isAReply && !meow.isAPlaceholder
    }
      return false;
    }
  );

  const forceRerender = () => {
    setDummyValue((prevDummyValue) => prevDummyValue + 1);
  };

  useEffect(() => {
    prevMeowsRef.current = meows;
  }, [meows]);

  useEffect(() => {
    forceRerender();
  }, [meows]);

  useEffect(() => {
    fetchMeows();
  }, [dispatch, query, meows]);

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
        sortedMeows?.length !== prevMeowsRef?.current?.length ||
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
      {filteredMeows.length === 0 ? (
        <p>Loading...</p>
      ) : (
        filteredMeows
        // meows
          // .filter((meow) => !meow.isAReply && !meow.isAPlaceholder)
          .map((meow) => <Meow key={meow._id} meow={meow} isSelectingGif={isSelectingGif} setIsSelectingGif={setIsSelectingGif}/>)
      )}
    </div>
  );
};

export default MeowFeed;
