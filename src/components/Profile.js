import React from 'react';
import MeowFeed from './MeowFeed';

const Profile = () => {
  return (
    <div>
      <button>Back</button>
      <p>Profile header image</p>
      <p>Profile Photo</p>
      <button>Edit Profile</button>
      <p>Name</p>
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
