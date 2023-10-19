import React, { useState } from 'react';
import ComposeMeow from './ComposeMeow';
import MeowFeed from './MeowFeed';
import { useDispatch } from 'react-redux';
import { clearIsEditing, clearShowEditForm } from '../meowActions';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isSelectingGif, setIsSelectingGif] = useState(false);

  useEffect(() => {
    dispatch(clearIsEditing());
    dispatch(clearShowEditForm());
  }, [location]);

  return (
    <div>
     <ComposeMeow isSelectingGif={isSelectingGif} setIsSelectingGif={setIsSelectingGif}/>

      { !isSelectingGif ? (
        <MeowFeed isSelectingGif={isSelectingGif} setIsSelectingGif={setIsSelectingGif}/>
      ) : null }

    </div>
  );
};

export default Home;
