import React, { useState } from 'react';
import ComposeMeow from './ComposeMeow';
import MeowFeed from './MeowFeed';
import { useDispatch, useSelector } from 'react-redux';
import { clearIsEditing, clearShowEditForm } from '../meowActions';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const Home = () => {
  
  var docWidth = document.documentElement.offsetWidth;

[].forEach.call(
  document.querySelectorAll('*'),
  function(el) {
    if (el.offsetWidth > docWidth) {
      console.log("oerflowing elements:", el);
    }
  }
);

  const dispatch = useDispatch();
  const location = useLocation();
  const [isSelectingGif, setIsSelectingGif] = useState(false);

  const [filterCriteria, setFilterCriteria] = useState('All');

  const username = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user.userId);
  const following = useSelector((state) => state.user.following); //just for console log

  useEffect(() => {
    dispatch(clearIsEditing());
    dispatch(clearShowEditForm());
  }, [location]);

  const handleShowAll = () => {
    setFilterCriteria('All');
  };

  const handleShowFollowing = () => {
    setFilterCriteria('Following');
  };
  console.log('folowing:', following);

  return (
    <div>
      <Navigation />
      <ComposeMeow isSelectingGif={isSelectingGif} setIsSelectingGif={setIsSelectingGif} />

      <button onClick={handleShowAll}>All</button>
      <button onClick={handleShowFollowing}>Following</button>

      {!isSelectingGif ? (
        // <MeowFeed isSelectingGif={isSelectingGif} setIsSelectingGif={setIsSelectingGif}/>
        <MeowFeed
          filterCriteria={filterCriteria}
          username={username}
          userId={userId}
          isSelectingGif={isSelectingGif}
          setIsSelectingGif={setIsSelectingGif}
        />
      ) : null}
    </div>
  );
};

export default Home;
