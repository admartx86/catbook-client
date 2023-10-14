import React from 'react';
import ComposeMeow from './ComposeMeow';
import MeowFeed from './MeowFeed';
import { useDispatch } from 'react-redux';
import { clearIsEditing } from '../meowActions';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  

  const navigate = useNavigate();
  const dispatch = useDispatch();

//     useEffect(() => {
//     return () => {
//       dispatch(clearIsEditing());
//   }; 
// }, [navigate]);

  
  return (
    <div>
      <ComposeMeow />
      <MeowFeed />
    </div>
  );
};

export default Home;
