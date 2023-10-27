import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUsername,
  setRealName,
  setUserId,
  setProfilePhoto,
  setBio,
  setLocation,
  setFollowers,
  setFollowing
} from '../userActions';
import axios from 'axios';
import homeIcon from '../img/home.png';
import exploreIcon from '../img/magnifying-glass.png';
import profileIcon from '../img/user-shape.png';
import signOutIcon from '../img/sign-out-option.png';

const Navigation = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const username = useSelector((state) => state.user.username);
  const realName = useSelector((state) => state.user.realName);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      console.log('Logout post request successful', res.data);
      localStorage.clear();
      dispatch(setUsername(''));
      dispatch(setRealName(''));
      dispatch(setUserId(''));
      dispatch(setProfilePhoto(''));
      dispatch(setBio(''));
      dispatch(setLocation(''));
      dispatch(setFollowers([]));
      dispatch(setFollowing([]));
      navigate('/');
      toggleModal();
    } catch (error) {
      console.log('Logout post request failed', error);
    }
  };

  return (
    <div>
      <nav
        className="flex sticky bg-white border-slate-200 border-b-4
    justify-around top-0 p-2 z-10
    "
      >
        <Link to="/home">
          <img
            src={homeIcon}
            alt="Home"
            title="Home"
            className="w-8 hover:scale-110 transition-all ease-in-out duration-200"
          />
        </Link>
        <Link to="/explore">
          <img
            src={exploreIcon}
            alt="Explore"
            title="Explore"
            className="w-8 hover:scale-110 transition-all ease-in-out duration-200"
          />
        </Link>
        <Link to={`/${username}`} reloadDocument={true}>
          <img
            src={profileIcon}
            alt="Profile"
            title="Profile"
            className="w-8 hover:scale-110 transition-all ease-in-out duration-200"
          />
        </Link>
        {username ? (
          // <button onClick={handleLogout}>
          <button onClick={toggleModal}>
            <img
              src={signOutIcon}
              title="Sign Out"
              className="w-8 hover:scale-110 transition-all ease-in-out duration-200"
            />
          </button>
        ) : null}
      </nav>

      {showModal ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-64 text-center">
            <button className="absolute top-2 right-2" onClick={toggleModal}>
              &times;
            </button>
            <p className="mb-4">👋 See you next time!</p>
            <button
              className="bg-purple-400 text-white p-2 rounded-full w-full mb-2"
              onClick={handleLogout}
            >
              Log Out
            </button>
            <button
              className="bg-gray-300 text-black p-2 rounded-full w-full"
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Navigation;
