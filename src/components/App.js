import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { checkPersistedUser } from '../userActions';

import ScrollToTop from './ScrollToTop';

import MyAccount from './MyAccount';
import Home from './Home';
import Explore from './Explore';
import Profile from './Profile';
import SingleMeowPage from './SingleMeowPage';

import ComposeMeow from './ComposeMeow';
import Following from './Following';
import Followers from './Followers';

import '../css/styles.css';

const App = () => {
  const dispatch = useDispatch();

  const ProtectedElement = ({ children }) => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('CatbookToken') ? true : false;
    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/');
      }
    }, [isAuthenticated, navigate]);
    return isAuthenticated ? children : null;
  };

  useEffect(() => {
    dispatch(checkPersistedUser());
  }, [dispatch]);

  return (
    <div>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MyAccount />} />
        <Route
          path="*"
          element={
            <ProtectedElement>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/:username" element={<Profile />} />
                <Route path="/compose/meow" element={<ComposeMeow />} />
                <Route path="/:username/status/:meowId" element={<SingleMeowPage />} />
                <Route path="/:username/following" element={<Following />} />
                <Route path="/:username/followers" element={<Followers />} />
                <Route path="*" element={<h1>404 Page Not Found</h1>} />
              </Routes>
            </ProtectedElement>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
