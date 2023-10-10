import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteMeow as deleteMeowAction, updateMeow as updateMeowAction } from '../meowActions';
import { Link } from 'react-router-dom'; //

const Meow = ({ meow }) => {
  console.log(meow);
  if (!meow) return <p>Error: Meow not found!</p>;

  const dispatch = useDispatch();

  const { createdAt, meowText, meowMedia, embedMeow } = meow;

  let authorPhoto, authorName, authorUsername;
  if (meow.author) {
    authorPhoto = meow.author.profilePhoto;
    authorName = meow.author.realName;
    authorUsername = meow.author.username;
  }

  const timeSincePosted = new Date(createdAt).toLocaleString();

  const renderMedia = (meowMedia) => {
    if (meowMedia) {
      const extension = meowMedia.split('.').pop().toLowerCase();
      const videoTypes = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'm4v'];
      const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
      if (videoTypes.includes(extension)) {
        return (
          <video controls width="250">
            <source src={meowMedia} type={`video/${extension}`} />
          </video>
        );
      }
      if (imageTypes.includes(extension)) {
        return <img src={meowMedia} alt="Media" />;
      }
    }
    return 'Media';
  };

  const handleDeleteMeow = () => {
    console.log('Attempting to delete meow with ID:', meow._id);
    if (meow._id) {
      console.log('Attempting to delete meow with ID:', meow._id);
      dispatch(deleteMeowAction(meow._id));
    } else {
      console.log('No ID available for deletion');
    }
  };

  const handleUpdateMeow = () => {
    if (meow._id) {
      dispatch(updateMeowAction({ meowId: meow._id, meowText: 'Updated text' }));
      console.log('Attempting to update meow with ID:', meow._id);
    } else {
      console.log('No ID available for update');
    }
  };

  function getMeowTimeStamp(createdAt) {
    const now = new Date();
    const meowDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now - meowDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}m`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}hr`;
    } else if (diffInSeconds < 86400 * 7) {
      return `${Math.floor(diffInSeconds / 86400)}d`;
    } else {
      const options = { month: 'short', day: 'numeric' };
      return meowDate.toLocaleDateString(undefined, options);
    }
  }

  return (
    <Link
      to={`/${authorUsername}/status/${meow._id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div>
        <div className="meow-header">
          <p>{authorPhoto ? <img src={authorPhoto} alt="Profile" /> : 'Profile Photo'}</p>
          <p>{authorName}</p>
          <p>@{authorUsername}</p>
          <p>{getMeowTimeStamp(timeSincePosted)}</p>
        </div>
        <div className="meow-content">
          <p>{meowText}</p>
          <p>{renderMedia(meowMedia)}</p>
          {embedMeow && <p>Embedded Meow: {embedMeow.meowText}</p>}{' '}
        </div>
        <div className="meow-actions">
          <p>Reply</p>
          <p>Remeow</p>
          <p>Like</p>
          <button onClick={handleDeleteMeow}>Delete Meow</button>
          <button onClick={handleUpdateMeow}>Update Meow</button>
        </div>
      </div>
    </Link>
  );
};

export default Meow;

Meow.defaultProps = {
  meow: {
    createdAt: '',
    meowText: '',
    meowMedia: '',
    embedMeow: null,
    author: {
      profilePhoto: '',
      realName: '',
      username: ''
    }
  }
};
