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
  const [isRegistering, setIsRegistering] = useState(false);

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
      dispatch(setFollowers(res.data.user.followers));
      dispatch(setFollowing(res.data.user.following));
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
    <div
      style={{
        backgroundImage: `url(https://catbook.s3.us-east-2.amazonaws.com/site-assets/catbook-background.png)`
      }}
      className="scrolling-background bg-cover h-screen w-full flex flex-col place-content-evenly"
    >
      <div className="flex justify-center self-center rounded-xl">
        <img
          src={'https://catbook.s3.us-east-2.amazonaws.com/site-assets/catbook-logo.png'}
          alt="CATBOOK"
          className="p-1 scale-50 lg:scale-75 rounded-xl"
        />
      </div>
      <div className="flex justify-center align-center border-5">
        {!isRegistering ? (
          <div className="flex flex-column justify-left bg-white p-5 rounded-xl">
            <form onSubmit={handleLogin} className="input-column">
              <h1 className="p-5 block  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                Sign In
              </h1>
              <p className="p-5 block  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl ">
                Welcome back! Enter your username and password to sign in.
              </p>

              <div className="p-5">
                <input
                  type="text"
                  placeholder="Username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="border border-gray-300 rounded-md p-1  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl "
                />
              </div>
              <div className="p-5">
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="border border-gray-300 rounded-md p-1  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl "
                />
              </div>
              <div className="flex p-5">
                <button
                  type="submit"
                  className="bg-purple-400 text-white 
                  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 
                  rounded-full px-4 py-2 hover:scale-110 transition-all ease-in-out duration-200"
                >
                  Sign In
                </button>

                <p className="block sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl p-5"> or </p>
                <button
                  onClick={() => setIsRegistering(true)}
                  className="bg-purple-400 text-white 
                  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 
                  rounded-full px-4 py-2 hover:scale-110 transition-all ease-in-out duration-200"
                >
                  Create an Account
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-column justify-left bg-white rounded-xl p-5">
            <form onSubmit={handleRegister} className="input-column">
              <h1 className="block  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl p-5 font-bold ">
                Register
              </h1>
              <p className="block  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl p-5">
                Welcome! Enter a name, username and password to register.
              </p>
              <div className="p-5">
                <input
                  type="text"
                  placeholder="Name"
                  value={registerRealName}
                  onChange={(e) => setRegisterRealName(e.target.value)}
                  className="border border-gray-300 rounded-md p-1  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl "
                />
              </div>
              <div className="p-5">
                <input
                  type="text"
                  placeholder="Username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className="border border-gray-300 rounded-md p-1  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl "
                />
              </div>
              <div className="p-5">
                <input
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="border border-gray-300 rounded-md p-1  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl "
                />
              </div>
              <div className="p-5 flex">
                <button
                  type="submit"
                  className="bg-purple-400 text-white 
                  sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 
                  rounded-full px-4 py-2 hover:scale-110 transition-all ease-in-out duration-200"
                >
                  Register
                </button>
                <p className="block sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl p-5"> or </p>
                <button
                  onClick={() => setIsRegistering(false)}
                  className="bg-purple-400 text-white
                sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
                rounded-full px-4 py-2 hover:scale-110 transition-all ease-in-out duration-200"
                >
                  Back to Sign In
                </button>
              </div>
              {/* <p className='block'>or</p>
              <button
                type="submit"
                className="bg-purple-400 text-white rounded-full px-4 py-2 hover:scale-110 transition-all ease-in-out duration-200"
              >
                Quick Register (Just Click and Begin!)
              </button> */}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
