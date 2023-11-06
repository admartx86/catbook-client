import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  setShowEditForm,
  setIsEditing,
  setLockForClearIsEditing,
  likeMeow,
  unlikeMeow,
  deleteMeow
} from '../meowActions';
import { setIsReplying } from '../replyActions';
import { setIsRemeowing } from '../remeowActions';

import replyIcon from '../img/reply.png';
import remeowIcon from '../img/retweet-arrows-symbol.png';
import likeIcon from '../img/heart-shape-outline.png';
import unlikeIcon from '../img/heart-shape-silhouette.png';
import editIcon from '../img/pencil.png';
import deleteIcon from '../img/trash.png';

const MeowButtons = ({ meow, isEmbedded }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.user.userId);

  const isARemeow = meow ? meow.isARemeow : null;
  const embeddedMeow = meow ? meow.embeddedMeow : null;

  let likesCount = null;
  let repliesCount = null;
  let [remeowCount, setRemeowCount] = useState(0);

  if (!isEmbedded) {
    likesCount = meow?.likedBy?.length ?? 0;
    repliesCount = useSelector(
      (state) =>
        state.meow?.meows.filter(
          (reply) => reply?.repliedToMeow === meow?._id && !reply.isAPlaceholder
        )?.length ?? 0
    );
    remeowCount = meow.remeowedBy?.length ?? 0;
  }

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

  const handleLike = (e) => {
    e.stopPropagation();
    if (meow && meow.likedBy && meow.likedBy.includes(userId)) {
      dispatch(unlikeMeow(meow._id));
    } else if (meow && meow._id) {
      dispatch(likeMeow(meow._id));
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    dispatch(setShowEditForm(true));
    dispatch(setIsEditing(true));
    dispatch(setLockForClearIsEditing(true));
    navigate(`/${meow.author.username}/status/${meow._id}`);
  };

  const handleDeleteMeow = () => {
    if (meow._id) {
      dispatch(deleteMeow(meow._id, isARemeow, embeddedMeow, navigate));
    } else {
      console.log('No ID available for deletion');
    }
  };

  return (
    <div className="pl-14 md:pl-24 lg:pl-28 xl:pl-32 flex">
      <div className="relative p-3 lg:p-5">
        <button onClick={(e) => handleReplyClick(e)}>
          <img
            src={replyIcon}
            alt="Reply"
            title="Reply"
            className="w-6 lg:w-12 hover:scale-110 transition-all ease-in-out duration-200"
          />
        </button>
        {repliesCount ? (
          <div className="absolute top-7 left-7 lg:top-12 lg:left-12 flex items-center justify-center bg-blue-400 rounded-full w-4 h-4 lg:w-10 lg:h-10 lg:text-2xl text-white pointer-events-none">
            {`${repliesCount}`}
          </div>
        ) : null}
      </div>

      <div className="relative p-3 lg:p-5">
        <button onClick={(e) => handleRemeowClick(e)}>
          <img
            src={remeowIcon}
            alt="Remeow"
            title="Remeow"
            className="w-6 lg:w-12 hover:scale-110 transition-all ease-in-out duration-200"
          />
        </button>

        {remeowCount > 0 ? (
          <div className="absolute top-7 left-7 lg:top-12 lg:left-12 flex items-center justify-center bg-blue-400 rounded-full w-4 h-4 lg:w-10 lg:h-10 lg:text-2xl text-white pointer-events-none">
            {`${remeowCount}`}
          </div>
        ) : null}
      </div>

      <div className="relative p-3 lg:p-5">
        <button onClick={handleLike}>
          {meow && meow?.likedBy && meow?.likedBy.includes(userId) ? (
            <img
              src={unlikeIcon}
              alt="Unlike"
              title="Unlike"
              className="w-6 lg:w-12 hover:scale-110 transition-all ease-in-out duration-200"
            />
          ) : (
            <img
              src={likeIcon}
              alt="Like"
              title="Unlike"
              className="w-6 lg:w-12 hover:scale-110 transition-all ease-in-out duration-200"
            />
          )}
        </button>
        {likesCount ? (
          <div className="absolute top-7 left-6 lg:top-12 lg:left-11 flex items-center justify-center bg-blue-400 rounded-full w-4 h-4 lg:w-10 lg:h-10 lg:text-2xl text-white pointer-events-none">
            {`${likesCount}`}
          </div>
        ) : null}
      </div>

      <div className="p-3 lg:p-5">
        {meow.author._id === userId ? (
          <button onClick={handleEditClick}>
            <img
              src={editIcon}
              alt="Edit"
              title="Edit"
              className="w-6 lg:w-12 hover:scale-110 transition-all ease-in-out duration-200"
            />
          </button>
        ) : (
          <button className="w-6 lg:w-12 opacity-0">
            <img src={editIcon} alt="Edit" title="Edit" />
          </button>
        )}
      </div>

      <div className="p-3 lg:p-5">
        {meow.author._id === userId ? (
          <button onClick={handleDeleteMeow}>
            <img
              src={deleteIcon}
              alt="Delete"
              title="Delete"
              className="w-6 lg:w-12 hover:scale-110 transition-all ease-in-out duration-200"
            />
          </button>
        ) : (
          <button className="w-6 lg:w-12 opacity-0">
            <img src={deleteIcon} alt="Delete" title="Delete" className="hover:scale-110" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MeowButtons;
