import React from 'react';
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
    } catch (error) {
      console.log('Logout post request failed', error);
    }
  };

  // prettier-ignore
  return (
    <nav className='flex gap-8 p-2'>
      <Link to="/home">
      <img src={homeIcon} alt="Home" title='Home' className='w-8 hover:scale-110 transition-all ease-in-out duration-200'/>
      </Link>
      <Link to="/explore">
        <img src={exploreIcon} alt="Explore" title='Explore' className='w-8 hover:scale-110 transition-all ease-in-out duration-200'/>
      </Link>
      <Link to={`/${username}`} reloadDocument={true}>
        <img src={profileIcon} alt="Profile" title='Profile' className='w-8 hover:scale-110 transition-all ease-in-out duration-200'/>
      </Link>
      {username ? 
      (
      <button onClick={handleLogout}>
        <img src={signOutIcon} title='Sign Out' className='w-8 hover:scale-110 transition-all ease-in-out duration-200'/>
      </button>
      ) : 
      null
      }
    </nav>
  );
};

export default Navigation;
