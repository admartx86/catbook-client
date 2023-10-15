import React from 'react';
import ComposeMeow from './ComposeMeow';
import MeowFeed from './MeowFeed';
import { useDispatch } from 'react-redux';
import { clearIsEditing, clearShowEditForm } from '../meowActions';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(clearIsEditing());
    dispatch(clearShowEditForm());
  }, [location]);

  return (
    <div>
      <ComposeMeow />
      <MeowFeed />
    </div>
  );
};

export default Home;
