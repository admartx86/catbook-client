import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRealName } from '../userActions';
import MeowFeed from './MeowFeed';
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();

  const realName = useSelector((state) => state.user.realName);

  const [isEditing, setIsEditing] = useState(false);
  const [newRealName, setNewRealName] = useState('');

  const handleEditClick = () => {
    setNewRealName(realName);
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/editRealName`,
        { realName: newRealName },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log('Real name updated successfully', response.data);
        dispatch(setRealName(newRealName));
        setIsEditing(false);
      }
    } catch (error) {
      console.log('An error occurred while updating real name', error);
    }
  };

  return (
    <div>
      <button>Back</button>
      <p>Profile header image</p>
      <p>Profile Photo</p>
      {isEditing ? (
        <div>
          Name{' '}
          <input type="text" value={newRealName} onChange={(e) => setNewRealName(e.target.value)} />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <>
          <button onClick={handleEditClick}>Edit Profile</button>
          <p>Name: {realName}</p>
        </>
      )}
      <p>Username</p>
      <p>Bio</p>
      <p>Location</p>
      <p>Date joined</p>
      <p>Following</p> <p>Followers</p>
      <button>Meows</button> <button> Replies</button>
      <button>Media</button> <button>Likes</button>
      <MeowFeed />
    </div>
  );
};

export default Profile;
