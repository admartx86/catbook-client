import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteMeow,
  likeMeow,
  unlikeMeow,
  setIsEditing,
  setShowEditForm,
  setLockForClearIsEditing
} from '../meowActions';
import { setIsReplying } from '../replyActions';
import { setIsRemeowing } from '../remeowActions';
import axios from 'axios';

const Meow = ({ meow: initialMeow, isEmbedded = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [embeddedMeowData, setEmbeddedMeowData] = useState(null);

  const userId = useSelector((state) => state.user.userId);
  const isReplying = useSelector((state) => state.reply.isReplying);
  const isRemeowing = useSelector((state) => state.remeow.isRemeowing);
  const isEditing = useSelector((state) => state.meow.isEditing);

  const meow = useSelector((state) => state.meow.meows.find((m) => m._id === initialMeow._id));

  const { createdAt, meowText, meowMedia } = meow;

  const timeSincePosted = new Date(createdAt).toLocaleString();

  let likesCount = null;
  let repliesCount = null;
  let remeowCount = null;

  let authorPhoto, authorName, authorUsername;

  if (!isEmbedded) {
    likesCount = meow?.likedBy?.length ?? 0;
    repliesCount = useSelector(
      (state) =>
        state.meow?.meows.filter((reply) => reply?.repliedToMeow === meow?._id)?.length ?? 0
    );
    remeowCount = !meow?.isARemeow && meow?.remeowedBy ? meow?.remeowedBy?.length ?? 0 : 0;
  }

  if (meow.author) {
    authorPhoto = meow.author.profilePhoto;
    authorName = meow.author.realName;
    authorUsername = meow.author.username;
  }

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
          setEmbeddedMeowData(placeholderMeow);
        }
      };
      fetchEmbeddedMeow();
    }
  }, [meow]);

  const handleLike = () => {
    if (meow && meow.likedBy && meow.likedBy.includes(userId)) {
      dispatch(unlikeMeow(meow._id));
    } else if (meow && meow._id) {
      dispatch(likeMeow(meow._id));
    }
  };

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
  };

  const handleDeleteMeow = () => {
    if (meow._id) {
      dispatch(deleteMeow(meow._id, navigate));
    } else {
      console.log('No ID available for deletion');
    }
  };

  function getMeowTimeStamp(createdAt) {
    const now = new Date();
    const meowDate = new Date(createdAt);
    let diffInSeconds = Math.floor((now - meowDate) / 1000);
    if (diffInSeconds < 1) {
      diffInSeconds = 1;
    }
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
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
    if (
      (isEmbedded && (meow.meowText || meow.meowMedia)) ||
      isReplying ||
      isRemeowing ||
      isEditing ||
      meow.isAPlaceholder
    ) {
      return false;
    }
    return true;
  };

  const handleReplyClick = (e) => {
    e.stopPropagation();
    navigate(`/${meow.author.username}/status/${meow._id}`);
    dispatch(setIsReplying(false));
  };

  const handleRemeowClick = (e) => {
    e.stopPropagation();
    navigate(`/${meow.author.username}/status/${meow._id}`);
    dispatch(setIsRemeowing(false));
  };

  const handleEditClick = (e) => {
    e.stopPropagation();

    dispatch(setShowEditForm(true));
    dispatch(setIsEditing(true));
    dispatch(setLockForClearIsEditing(true));
    navigate(`/${meow.author.username}/status/${meow._id}`);
  };

  // prettier-ignore
  return (
    <div className="meow">
      {!meow.isAPlaceholder ? (
        <div
          onClick={() => {
            navigate(`/${authorUsername}/status/${meow._id}`);
          }}
          style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
        >
          <div className="meow-header">
            {meow.isAReply ? (
              <span>
                Replying to{' '}
                <Link to={`/${authorUsername}`} onClick={(e) => e.stopPropagation()}>
                  @{meow.repliedToAuthor}
                </Link>
              </span>
            ) : null}
            <p>
              {authorPhoto ? (
                <Link
                  to={`/${authorUsername}`}
                  reloadDocument={true}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src={authorPhoto} alt="Profile" />
                </Link>
              ) : (
                'Profile Photo'
              )}
            </p>
            <p>{authorName}</p>
            <p>@{authorUsername}</p>
            <p>{getMeowTimeStamp(timeSincePosted)}</p>
          </div>
          <div className="meow-content">
            <p>{meowText || ''}</p>
            <p>{renderMedia(meowMedia)}</p>
            {embeddedMeowData ? (
              <Meow meow={embeddedMeowData} isEmbedded={true} />
            ) : meow.isARemeow && !embeddedMeowData ? (
              <div className="placeholder-meow">Meow does not exist.</div>
            ) : null} 
          </div>
        </div>
      ) : (
        <div
          className="placeholder-meow"
          onClick={() => {
            navigate(`/${authorUsername}/status/${meow._id}`);
          }}
          style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
        >
          This meow was deleted.
        </div>
      )}

      {shouldDisplayButtons() ? (
        <div className="meow-actions">
          <button
            onClick={(e) => {
              handleReplyClick(e);
            }}
          >
            Reply {repliesCount ? `(${repliesCount})` : ''}
          </button>
          <button
            onClick={(e) => {
              handleRemeowClick(e);
            }}
          >
            Remeow {remeowCount > 0 ? `(${remeowCount})` : ''}
          </button>
          <button onClick={handleLike}>
            {meow && meow.likedBy && meow.likedBy.includes(userId) ? 'Unlike' : 'Like'}
            {likesCount ? ` (${likesCount})` : ''}
          </button>
          <button onClick={handleDeleteMeow}>Delete Meow</button>
          <button onClick={handleEditClick}>Edit Meow</button>
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
