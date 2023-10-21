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

  return (
    <div>
      <div className='bg-red-500'>TEST TAILWIND CSS</div>
      <Link to="/home" className='bg-red-500'>Home</Link>
      <Link to="/explore">Explore</Link>
      <Link to={`/${username}`} reloadDocument={true}>
        Profile
      </Link>
      {username ? (
        <div className="sign-out section">
          {/* <h1>Sign Out</h1>
            <p>
              You are signed in as
              <span style={{ fontWeight: 'bold' }}>
                {typeof username === 'string' ? username : 'Invalid Username'}(
                {typeof realName === 'string' ? realName : 'Invalid Real Name'})
              </span>
              .
            </p> */}
          <button className="sign-out-button" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Navigation;
