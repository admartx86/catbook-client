import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRealName, setBio, setLocation, setProfilePhoto } from '../userActions';
import MeowFeed from './MeowFeed';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom'; //

const Profile = () => {
  const urlLocation = useLocation();

  const dispatch = useDispatch();

  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);

  const [dateJoined, setDateJoined] = useState(null);

  const realName = useSelector((state) => state.user.realName);

  const [newBio, setNewBio] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const { username: profileUsername } = useParams();
  const username = useSelector((state) => state.user.username);
  const [userData, setUserData] = useState(null); //

  const bio = useSelector((state) => state.user.bio);
  const location = useSelector((state) => state.user.location);

  //these are local but they conflict with name in redux
  const [isEditing, setIsEditing] = useState(false);
  const [newRealName, setNewRealName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (profileUsername === username) {
          const profilePhotoRes = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/auth/profilePhoto`,
            { withCredentials: true }
          );
          setProfilePhotoUrl(profilePhotoRes.data.profilePhoto);
          dispatch(setProfilePhoto(profilePhotoRes.data.profilePhoto));

          const bioRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/bio`, {
            withCredentials: true
          });
          setBio(bioRes.data.bio);

          const locationRes = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/auth/location`,
            { withCredentials: true }
          );
          setLocation(locationRes.data.location);

          const dateJoinedRes = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/auth/dateJoined`,
            { withCredentials: true }
          );
          setDateJoined(new Date(dateJoinedRes.data.dateJoined));
        } else {
          const userResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/auth/${profileUsername}`
          );
          setUserData(userResponse.data);
          setProfilePhotoUrl(userResponse.data.profilePhoto);
          setBio(userResponse.data.bio);
          setLocation(userResponse.data.location);
          setDateJoined(new Date(userResponse.data.dateJoined));
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [profileUsername, username, dispatch, urlLocation.pathname]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleEditClick = () => {
    setNewRealName(realName);
    setNewBio(bio);
    setNewLocation(location);
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const realNameResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/editRealName`,
        { realName: newRealName },
        { withCredentials: true }
      );

      if (realNameResponse.status === 200) {
        console.log('Real name updated successfully', realNameResponse.data);
        dispatch(setRealName(newRealName));
      }
    } catch (error) {
      console.log('An error occurred while updating real name', error);
    }

    try {
      const bioResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/editBio`,
        { bio: newBio },
        { withCredentials: true }
      );

      if (bioResponse.status === 200) {
        console.log('Bio updated successfully', bioResponse.data);
        dispatch(setBio(newBio));
      }
    } catch (error) {
      console.log('An error occurred while updating bio', error);
    }

    try {
      const locationResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/editLocation`,
        { location: newLocation },
        { withCredentials: true }
      );

      if (locationResponse.status === 200) {
        console.log('Location updated successfully', locationResponse.data);
        dispatch(setLocation(newLocation));
      }
    } catch (error) {
      console.log('An error occurred while updating location', error);
    }
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profilePhoto', selectedFile);

      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/auth/editProfilePhoto`,
          formData,
          { withCredentials: true }
        );

        if (response.status === 200) {
          console.log('Profile photo updated successfully', response.data);
        }
      } catch (error) {
        console.log('An error occurred while updating the profile photo', error);
      }
    }
    setIsEditing(false);
  };

  function formatDate(dateJoined) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    const month = months[dateJoined.getMonth()];
    const year = dateJoined.getFullYear();

    return `${month} ${year}`;
  }

  return (
    <div>
      <img src={profilePhotoUrl} alt="Profile" />
      {isEditing ? (
        <div>
          Name:{' '}
          <input type="text" value={newRealName} onChange={(e) => setNewRealName(e.target.value)} />
          Bio: <input type="text" value={newBio} onChange={(e) => setNewBio(e.target.value)} />
          Location:{' '}
          <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
          <label>
            Change Profile Photo:
            <input type="file" onChange={handleFileChange} />
          </label>
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <>
          <button onClick={handleEditClick}>Edit Profile</button>
          <p>{userData ? userData.realName : ''}</p>
        </>
      )}
      <p>@{profileUsername}</p>
      <p>{userData ? userData.bio : ''}</p>
      <p>{userData ? userData.location : ''}</p>
      {dateJoined ? <p>Joined {formatDate(dateJoined)}</p> : null}
      <p>Following</p> <p>Followers</p>
      <button>Meows</button> <button> Replies</button>
      <button>Media</button> <button>Likes</button>
      <MeowFeed />
    </div>
  );
};

export default Profile;
