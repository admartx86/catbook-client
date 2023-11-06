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
    justify-around top-0 p-2 md:p-4 lg:p-6 xl:p-8 z-10"
        aria-label="Main Navigation"
      >
        <Link to="/home" aria-label="Home">
          <div className="flex items-center hover:scale-110 transition-all ease-in-out duration-200">
            <img src={homeIcon} alt="Home" title="Home" className="w-8 lg:w-12" />
            <span className="hidden lg:block lg:text-2xl xl:text-4xl pl-6">Home</span>
          </div>
        </Link>
        <Link to="/explore" aria-label="Explore">
          <div className="flex items-center hover:scale-110 transition-all ease-in-out duration-200">
            <img src={exploreIcon} alt="Explore" title="Explore" className="w-8 lg:w-12" />
            <span className="hidden lg:block lg:text-2xl xl:text-4xl pl-6">Explore</span>
          </div>
        </Link>
        <Link to={`/${username}`} reloadDocument={true} aria-label="Profile">
          <div className="flex items-center hover:scale-110 transition-all ease-in-out duration-200">
            <img src={profileIcon} alt="Profile" title="Profile" className="w-8 lg:w-12" />
            <span className="hidden lg:block lg:text-2xl xl:text-4xl pl-6">Profile</span>
          </div>
        </Link>
        {username ? (
          // <button onClick={handleLogout}>
          <button
            onClick={toggleModal}
            aria-label="Sign Out"
            className="flex items-center hover:scale-110 transition-all ease-in-out duration-200"
          >
            <img src={signOutIcon} title="Sign Out" className="w-8 lg:w-12" />
            <span className="hidden lg:block lg:text-2xl xl:text-4xl pl-6">Sign Out</span>
          </button>
        ) : null}
      </nav>

      <dialogue>
        {showModal ? (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalText"
          >
            <div className="bg-white p-6 rounded-lg w-64 md:w-72 lg:w-auto text-center">
              <p id="modalText" className="mb-4 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                👋 See you next time!
              </p>
              <button
                className="bg-purple-400 text-white hover:scale-110 transition-all ease-in-out duration-200 p-2 rounded-full w-full sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-4"
                onClick={handleLogout}
              >
                Log Out
              </button>
              <button
                className="bg-gray-300 text-black hover:scale-110 transition-all ease-in-out duration-200 p-2 rounded-full sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl w-full"
                onClick={toggleModal}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </dialogue>
    </div>
  );
};

export default Navigation;
