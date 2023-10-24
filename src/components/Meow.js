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
import replyIcon from '../img/reply.png';
import remeowIcon from '../img/retweet-arrows-symbol.png';
import likeIcon from '../img/heart-shape-outline.png';
import unlikeIcon from '../img/heart-shape-silhouette.png';
import editIcon from '../img/pencil.png';
import deleteIcon from '../img/trash.png';

const placeholderMeow = {
  author: {
    _id: 'placeholder',
    username: 'placeholder',
    realName: 'placeholder',
    profilePhoto: 'placeholder'
  },
  createdAt: '',
  gifUrl: '',
  isAPlaceholder: true,
  isARemeow: false,
  isAReply: false,
  likedBy: [],
  meowText: '',
  meowMedia: '',
  embedMeow: null,
  repliedToAuthor: '',
  repliedToMeow: '',
  repliedBy: [],
  remeowedBy: []
};

const Meow = ({ meow: initialMeow, isEmbedded = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [embeddedMeowData, setEmbeddedMeowData] = useState(null);
  const userId = useSelector((state) => state.user.userId);
  const isReplying = useSelector((state) => state.reply.isReplying);
  const isRemeowing = useSelector((state) => state.remeow.isRemeowing);
  const isEditing = useSelector((state) => state.meow.isEditing);
  const remeowedBy = useSelector((state) => {
    const specificMeow = state.meow.meows.find((m) => m._id === initialMeow._id);
    return specificMeow ? specificMeow.remeowedBy : [];
  });

  let username = useSelector((state) => state.user.username);

  const meow = useSelector((state) => state.meow.meows.find((m) => m._id === initialMeow._id));
  const isARemeow = meow ? meow.isARemeow : null; //Pass to removeRemeowedBy action
  const embeddedMeow = meow ? meow.embeddedMeow : null; //Pass to removeRemeowedBy action

  const { createdAt, meowText, meowMedia, gifUrl } = meow || {};

  const timeSincePosted = new Date(createdAt).toLocaleString();

  let likesCount = null;
  let repliesCount = null;
  let [remeowCount, setRemeowCount] = useState(0);
  let [dummyValue, setDummyValue] = useState(0);

  let authorPhoto, authorName, authorUsername;

  if (!isEmbedded) {
    likesCount = meow?.likedBy?.length ?? 0;
    repliesCount = useSelector(
      (state) =>
        state.meow?.meows.filter(
          (reply) => reply?.repliedToMeow === meow?._id && !reply.isAPlaceholder
        )?.length ?? 0
    );
    remeowCount = remeowedBy?.length ?? 0;
  }

  if (meow?.author) {
    authorPhoto = meow?.author?.profilePhoto;
    authorName = meow?.author?.realName;
    authorUsername = meow?.author?.username;
  }

  const forceRerender = () => {
    setDummyValue((prevDummyValue) => prevDummyValue + 1);
  };

  useEffect(() => {
    forceRerender();
  }, []);
  //meow, remeowedBy

  useEffect(() => {
    if (meow?.embeddedMeow) {
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
  }, []);
  //meow
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
      dispatch(deleteMeow(meow._id, isARemeow, embeddedMeow, navigate)); //why navigate?
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
      (isEmbedded && (meow?.meowText || meow?.meowMedia)) ||
      isReplying ||
      isRemeowing ||
      isEditing ||
      meow?.isAPlaceholder
    ) {
      return false;
    }
    return true;
  };

  const handleReplyClick = (e) => {
    e.stopPropagation();
    navigate(`/${meow.author.username}/status/${meow._id}`);
    dispatch(setIsReplying());
  };

  const handleRemeowClick = (e) => {
    e.stopPropagation();
    navigate(`/${meow.author.username}/status/${meow._id}`);
    dispatch(setIsRemeowing());
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
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      
      
      {!meow?.isAPlaceholder ?
      (
      <div onClick={() => {
        navigate(`/${authorUsername}/status/${meow?._id}`);
        }}
        style={{textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
        >
          <div className="meow-header">
            {meow?.isAReply ? (
              <span>
                Replying to{' '}
                <Link to={`/${authorUsername}`} onClick={(e) => e.stopPropagation()}>
                  @{meow?.repliedToAuthor}
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
                  <img src={authorPhoto} alt="Profile" 
                  className="flex flex-shrink-0 rounded-full w-18 sm:w-20 md:w-22 lg:w-24 xl:w-26"
                  />
                </Link>
              ) : (
                <Link
                  to={`/${authorUsername}`}
                  reloadDocument={true}
                  onClick={(e) => e.stopPropagation()}
                >
                <img src='https://catbook.s3.us-east-2.amazonaws.com/site-assets/profile-photo-placeholder.png'
                className="flex flex-shrink-0 rounded-full w-18 sm:w-20 md:w-22 lg:w-24 xl:w-26"
                />
                </Link>
              
              )}
            </p>
            <p>{authorName}</p>
            <p>@{authorUsername}</p>
            <p>{getMeowTimeStamp(timeSincePosted)}</p>
          </div>
          <div className="meow-content">
            <p>{meowText || ''}</p>
            { gifUrl ?
        <img src={gifUrl} alt="GIF" width="200" />
        : null    
        }
            <p>{renderMedia(meowMedia)}</p>

            {embeddedMeowData ? (
              <Meow meow={embeddedMeowData} isEmbedded={true} />
            ) : meow?.isARemeow && !embeddedMeowData ? (
              <div className="placeholder-meow"> 
              <img src={'https://catbook.s3.us-east-2.amazonaws.com/site-assets/crying-cat.gif'} alt="A Crying Kitten"/>
              😢 Meow does not exist.</div>
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
          <img src={'https://catbook.s3.us-east-2.amazonaws.com/site-assets/crying-cat.gif'} alt="A Crying Kitten"/>
          😢 This meow was deleted.
        </div>
      )}
     

      {shouldDisplayButtons() ? (
        <div className="flex gap-5 p-3">
          <button
            onClick={(e) => {
              handleReplyClick(e);
            }}
          >
            <img src={replyIcon} alt="Reply" className='w-5'/> {repliesCount ? `(${repliesCount})` : ''}
          </button>
          <button
            onClick={(e) => {
              handleRemeowClick(e);
            }}
          >
            <img src={remeowIcon} alt="Remeow" className='w-5'/> {remeowCount > 0 ? `(${remeowCount})` : ''}
          </button>
          <button onClick={handleLike}  className="tw-bg-amber-500">
            {meow && meow?.likedBy && meow?.likedBy.includes(userId) ? <img src={unlikeIcon} alt="Unlike" className='w-5'/> : <img src={likeIcon} alt="Like" className='w-5'/>} {likesCount ? ` (${likesCount})` : ''}
          </button>
          
 { meow.author._id === userId ? (
         
<button onClick={handleEditClick}>
<img src={editIcon} alt="Edit" className='w-5'/>
  </button>
          ) : ( null )
          }
          { meow.author._id === userId ? (
          <button onClick={handleDeleteMeow}>
            <img src={deleteIcon} alt="Delete" className='w-5'/>
            </button>
          ) : ( null )
          }
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
