import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const MyAccount = () => {
  const dispatch = useDispatch();

  const username = useSelector((state) => state.user.username);

  const navigate = useNavigate();

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRealName, setRegisterRealName] = useState('');

  const loginUser = async (username, password) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        { username, password },
        { withCredentials: true }
      );
      console.log('Login post request successful', res.data);
      dispatch(setUsername(res.data.user.username));
      dispatch(setRealName(res.data.user.realName));
      dispatch(setUserId(res.data.user._id));
      dispatch(setProfilePhoto(res.data.user.profilePhoto));
      dispatch(setBio(res.data.user.bio));
      dispatch(setLocation(res.data.user.location));
      dispatch(setFollowers(res.data.user.username));
      dispatch(setFollowing(res.data.user.username));
      localStorage.setItem(
        'CatbookToken',
        JSON.stringify({
          username: res.data.user.username,
          realName: res.data.user.realName,
          userId: res.data.user._id,
          profilePhoto: res.data.user.profilePhoto,
          bio: res.data.user.bio,
          location: res.data.user.location,
          followers: res.data.user.followers,
          following: res.data.user.following
        })
      );
      navigate('/home');
    } catch (error) {
      console.log('Login post request failed', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    loginUser(loginUsername, loginPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        { username: registerUsername, password: registerPassword, realName: registerRealName },
        { withCredentials: true }
      );
      console.log('Register post request successful', res.data);
      dispatch(setUsername(registerUsername));
      dispatch(setRealName(res.data.realName));

      loginUser(registerUsername, registerPassword);
    } catch (error) {
      console.log('Register post request failed', error);
    }
  };

  return (
    <div className="account">
      <div className="log-in-out-column"></div>
      <div className="section">
        <h1>Sign In</h1>
        <p>Welcome back! Enter your username and password to sign in.</p>
        <form onSubmit={handleLogin} className="input-column">
          <div>
          <input
            type="text"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
          />
          </div>
          <div>
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          </div>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="section">
        <h1>Register</h1>
        <p>New user? Enter a username and password to register.</p>
        <form onSubmit={handleRegister} className="input-column">
          <div>
          <input
            type="text"
            placeholder="Name"
            value={registerRealName}
            onChange={(e) => setRegisterRealName(e.target.value)}
          />
          </div>
          <div>
          <input
            type="text"
            placeholder="Username"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
          </div>
          <div>
          <input
            type="password"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default MyAccount;
