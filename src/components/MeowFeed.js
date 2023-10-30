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

  const [noMeows, setNoMeows] = useState(false);

  const searchParams = new URLSearchParams(location.search);

  const query = searchParams.get('q');

  username = useSelector((state) => state.user.username);
  userId = useSelector((state) => state.user.userId);

  // const [isSelectingGif, setIsSelectingGif] = useState(false);
  let [dummyValue, setDummyValue] = useState(0);

  const filteredMeows = meows.filter((meow) => {
    if (filterCriteria === 'Meows') {
      return meow.author.username === username && !meow.isAReply && !meow.isAPlaceholder;
    } else if (filterCriteria === 'Replies') {
      return meow.author.username === username && meow.isAReply && !meow.isAPlaceholder;
    } else if (filterCriteria === 'Media') {
      return (
        meow.author.username === username &&
        (meow.meowMedia || meow.gifUrl) &&
        !meow.isAReply &&
        !meow.isAPlaceholder
      );
    } else if (filterCriteria === 'Likes') {
      return meow?.likedBy.includes(userId) && !meow.isAPlaceholder;
    } 
    
    else if (following && filterCriteria === 'Following') {
      return following?.includes(meow?.author._id) && !meow?.isAPlaceholder;
    } 
    
    else if (filterCriteria === 'All') {
      return !meow.isAReply && !meow.isAPlaceholder;
    } else if (filterCriteria === 'Search') {
      return !meow.isAPlaceholder;
    }
    return false;
  });

  const forceRerender = () => {
    setDummyValue((prevDummyValue) => prevDummyValue + 1);
  };

  useEffect(() => {
    setNoMeows(false);
  }, [setNoMeows]);


  useEffect(() => {
    prevMeowsRef.current = meows;
  }, [meows]);

  useEffect(() => {
    forceRerender();
  }, []);
  //meows
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
        if (response.data.message === 'No Meows matching search found') {
          setNoMeows(true);
          return;
        }
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
        setNoMeows(false);
      }
    } catch (error) {
      console.error('Error fetching meows:', error);
    }
  };

  console.log('Filtered meows:', filteredMeows);

  console.log('following:', following);

  return (
    <div className="">
      {noMeows ? (
        <div className='p-5 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl'>
        <p className='break-all'>💨🍃😿 No results for "{query}".</p>
        <br></br>
        <p>😺🔎🐾 Try searching for something else.</p>
        </div>
      ) : filteredMeows.length === 0 ? (
        <p>Loading...</p>
      ) : (
        filteredMeows.map((meow) => (
          <div>
            <Meow
              key={meow._id}
              meow={meow}
              isSelectingGif={isSelectingGif}
              setIsSelectingGif={setIsSelectingGif}
            />
            <hr className="border-b-4 border-slate-200 " />
          </div>
        ))
      )}
    </div>
  );
};

export default MeowFeed;
