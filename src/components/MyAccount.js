import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUsername } from '../actions';
import { usePersistedUser } from './usePersistedUser';

const MyAccount = () => {
  usePersistedUser();

  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.username);
  const navigate = useNavigate();
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

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
      dispatch(setUsername(null));

      navigate('/');
    } catch (error) {
      console.log('Logout post request failed', error);
    }
  };

  const loginUser = async (username, password) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        { username, password },
        { withCredentials: true }
      );
      dispatch(setUsername(username));

      localStorage.setItem('CatbookToken', JSON.stringify(username));
      navigate('/');
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
        { username: registerUsername, password: registerPassword },
        { withCredentials: true }
      );
      console.log('Register post request successful', res.data);
      loginUser(registerUsername, registerPassword);
    } catch (error) {
      console.log('Register post request failed', error);
    }
  };

  return (
    <div className="account">
      <div className="log-in-out-column">
        {username ? (
          <div className="sign-out section">
            <h1>Sign Out</h1>
            <p>
              You are signed in as <span style={{ fontWeight: 'bold' }}>{username}</span>.
            </p>
            <button className="sign-out-button" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        ) : null}
      </div>
      <div className="section">
        <h1>{username ? 'Switch Accounts' : 'Sign In'}</h1>
        <p>
          {username
            ? 'Enter a different username and password to switch accounts.'
            : 'Welcome back! Enter your username and password to sign in.'}
        </p>
        <form onSubmit={handleLogin} className="input-column">
          <input
            type="text"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button type="submit">Sign In</button>
        </form>
      </div>

      <div className="section">
        <h1>Register</h1>
        <p>
          {username
            ? 'Enter a new username and password to register an account.'
            : 'New user? Enter a username and password to register.'}
        </p>
        <form onSubmit={handleRegister} className="input-column">
          <input
            type="text"
            placeholder="Username"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default MyAccount;
