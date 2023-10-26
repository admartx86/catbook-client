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

  [].forEach.call(document.querySelectorAll('*'), function (el) {
    if (el.offsetWidth > docWidth) {
      console.log('oerflowing elements:', el);
    }
  });

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

      <div className='p-4 border-b-4 border-slate-200'>
      <button 
      className={filterCriteria == "All" ? "border-b-4 border-green-400 px-4 py-2" : "px-4 py-2 text-slate-600"}
      onClick={handleShowAll}>
        All
      </button>
      <button 
      className={filterCriteria == "Following" ? "border-b-4 border-green-400 px-4 py-2" : "px-4 py-2 text-slate-600"}
      onClick={handleShowFollowing}>

        Following
      </button>
</div>

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
