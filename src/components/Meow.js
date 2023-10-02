import React from 'react';

import { useDispatch } from 'react-redux';
import { deleteMeow as deleteMeowAction, updateMeow as updateMeowAction } from '../meowActions';

const Meow = ({ meow }) => {
  const dispatch = useDispatch();

  const {
    _id,
    authorPhoto,
    authorName,
    authorUsername,
    createdAt,
    meowText,
    meowMedia,
    embedMeow
  } = meow;

  const timeSincePosted = new Date(createdAt).toLocaleString();

  const renderMedia = (meowMedia) => {
    if (meowMedia) {
      const isVideo = meowMedia.endsWith('.mp4') || meowMedia.endsWith('.webm');
      if (isVideo) {
        return (
          <video controls width="250">
            <source src={meowMedia} type="video/mp4" />
          </video>
        );
      } else {
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

  return (
    <div>
      <div className="meow-header">
        <p>{authorPhoto ? <img src={authorPhoto} alt="Profile" /> : 'Profile Photo'}</p>
        <p>{authorName}</p>
        <p>{authorUsername}</p>
        <p>{timeSincePosted}</p>
        <p>More</p>
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
  );
};

export default Meow;
