import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import '../css/styles.css';

import MyAccount from './MyAccount';
import Home from './Home';
import Explore from './Explore';
import Profile from './Profile';
import SingleMeowPage from './SingleMeowPage';

import Navigation from './Navigation';
import ComposeMeow from './ComposeMeow';
import Following from './Following';
import Followers from './Followers';

import { checkPersistedUser } from '../userActions';
import ScrollToTop from './ScrollToTop';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkPersistedUser());
  }, [dispatch]);

  return (
    <div>
      <ScrollToTop />
      <Navigation />
      <Routes>
        <Route path="/" element={<MyAccount />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/compose/meow" element={<ComposeMeow />} />
        <Route path="/:username/status/:meowId" element={<SingleMeowPage />} />
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
        <Route path="/:username/following" element={<Following />} />
        <Route path="/:username/followers" element={<Followers />} />
      </Routes>
    </div>
  );
};

export default App;
