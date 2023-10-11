import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteMeow as deleteMeowAction, updateMeow as updateMeowAction } from '../meowActions';
import { Link, useNavigate } from 'react-router-dom'; //
import { setIsReplying } from '../replyActions';
import { setIsRemeowing } from '../remeowActions';
import axios from 'axios';

const Meow = ({ meow: initialMeow, isEmbedded = false }) => {
  const navigate = useNavigate();

  const [embeddedMeowData, setEmbeddedMeowData] = useState(null);

  const meow = initialMeow || {};
  //const isDirectRemeow = !meow.meowText && !meow.meowMedia && meow.embeddedMeow;
  const isDirectRemeow = Boolean(!meow.meowText && !meow.meowMedia && meow.embeddedMeow);

  // console.log('meow id'. meow._id)
  console.log('meow.meowText:', meow.meowText);
  console.log('meow.meowMedia:', meow.meowMedia);
  console.log('meow.embeddedMeow:', meow.embeddedMeow);
  console.log('Is this a Direct Remeow?:', isDirectRemeow);

  console.log(meow);
  if (!initialMeow) return <p>Error: Meow not found!</p>;

  const dispatch = useDispatch();

  const { createdAt, meowText, meowMedia, embedMeow } = meow;

  let authorPhoto, authorName, authorUsername;
  if (meow.author) {
    authorPhoto = meow.author.profilePhoto;
    authorName = meow.author.realName;
    authorUsername = meow.author.username;
  }

  const timeSincePosted = new Date(createdAt).toLocaleString();

  useEffect(() => {
    if (meow.embeddedMeow) {
      const fetchEmbeddedMeow = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/meows/${meow.embeddedMeow}`
          );
          setEmbeddedMeowData(response.data);
        } catch (error) {
          console.error('Error fetching embedded meow:', error);
        }
      };

      fetchEmbeddedMeow();
    }
  }, [meow]);

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

  const shouldDisplayButtons = () => {
    if (isEmbedded && (meow.meowText || meow.meowMedia)) {
      return false; // Don't display buttons for embedded meows with text or media
    }
    return true; // Display buttons in all other scenarios
  };

  return (
    <div
      onClick={() => {
        navigate(`/${authorUsername}/status/${meow._id}`);
      }}
      style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
    >
      <div className="meow-header">
        <p>
          {authorPhoto ? (
            <Link to={`/${authorUsername}`} onClick={(e) => e.stopPropagation()}>
              <img src={authorPhoto} alt="Profile" />
            </Link>
          ) : (
            'Profile Photo'
          )}
        </p>
        <p>
          <Link to={`/${authorUsername}`} onClick={(e) => e.stopPropagation()}>
            {authorName}
          </Link>
        </p>
        <p>
          <Link to={`/${authorUsername}`} onClick={(e) => e.stopPropagation()}>
            @{authorUsername}
          </Link>
        </p>
        <p>{getMeowTimeStamp(timeSincePosted)}</p>
      </div>
      <div className="meow-content">
        <p>{meowText || ''}</p>

        <p>{renderMedia(meowMedia)}</p>

        {embeddedMeowData ? <Meow meow={embeddedMeowData} isEmbedded={true} /> : null}
      </div>

      {shouldDisplayButtons() ? (
        <div className="meow-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/${meow.author.username}/status/${meow._id}`);
              dispatch(setIsReplying());
            }}
          >
            Reply
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/${meow.author.username}/status/${meow._id}`);
              dispatch(setIsRemeowing());
            }}
          >
            Remeow{' '}
          </button>

          <p>Like</p>
          <button onClick={handleDeleteMeow}>Delete Meow</button>
          <button onClick={handleUpdateMeow}>Update Meow</button>
        </div>
      ) : null}
    </div>
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
