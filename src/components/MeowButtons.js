import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import replyIcon from '../img/reply.png';
import remeowIcon from '../img/retweet-arrows-symbol.png';
import likeIcon from '../img/heart-shape-outline.png';
import unlikeIcon from '../img/heart-shape-silhouette.png';
import editIcon from '../img/pencil.png';
import deleteIcon from '../img/trash.png';
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


    <div className="pl-32">


    

<div className="flex gap-8 sm:gap-10 md:p-4 md:gap-12 lg:gap-14 xl:gap-16">





        <div className="p-0 m-0 relative w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16">
        <button className="absolute p-0 m-0" onClick={(e) => handleReplyClick(e)}>
            <div>
            <img
                src={replyIcon}
                alt="Reply"
                title="Reply"
                className="p-0 m-0 hover:scale-110 transition-all ease-in-out duration-200"
            />
            </div>
        </button>
        {repliesCount ? (
            <div className="absolute flex items-center justify-center bg-purple-400 rounded-full w-8 h-8 bottom-0 right-1 transform translate-x-1/2 -translate-y-1 text-white">
            {`${repliesCount}`}
            </div>
        ) : null}
        </div>

      
        <div className="p-0 m-0 relative w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16">

  <button className="absolute p-0 m-0" onClick={(e) => handleRemeowClick(e)}>
    
    
    <div>
      <img
        src={remeowIcon}
        alt="Remeow"
        title="Remeow"
        className="p-0 m-0 hover:scale-110 transition-all ease-in-out duration-200"
      />
    </div>
  </button>
  {remeowCount > 0 ? (
    <div className="absolute flex items-center justify-center bg-purple-400 rounded-full w-8 h-8 bottom-0 right-1 transform translate-x-1/2 -translate-y-1 text-white">
      {`${remeowCount}`}
    </div>
  ) : null}
</div>


        <div className="p-0 m-0 relative w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16">
          <button className="absolute p-0 m-0" onClick={handleLike}>
            {meow && meow?.likedBy && meow?.likedBy.includes(userId) ? (
              <div>
                <img
                  src={unlikeIcon}
                  alt="Unlike"
                  title="Unlike"
                  className="p-0 m-0 hover:scale-110 transition-all ease-in-out duration-200"
                />
              </div>
            ) : (
              <div>
                <img
                  src={likeIcon}
                  alt="Like"
                  title="Unlike"
                  className="p-0 m-0 hover:scale-110 transition-all ease-in-out duration-200"
                />
              </div>
            )}
          </button>
          {likesCount ? (
            <div className="absolute focus:outline-none flex items-center justify-center bg-purple-400 rounded-full w-8 h-8 bottom-0 right-1 transform translate-x-1/2 -translate-y-1 text-white">
              {`${likesCount}`}
            </div>
          ) : null}
        </div>

        {meow.author._id === userId ? (
          <button onClick={handleEditClick}>
            <img
              src={editIcon}
              alt="Edit"
              title="Edit"
              className="w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 hover:scale-110 transition-all ease-in-out duration-200"
            />
          </button>
        ) : <img
        src={editIcon}
        alt="Edit"
        title="Edit"
        className="w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 opacity-0"
      />}



        {meow.author._id === userId ? (
          <button onClick={handleDeleteMeow}>
            <img
              src={deleteIcon}
              alt="Delete"
              title="Delete"
              className="w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 hover:scale-110 transition-all ease-in-out duration-200"
            />
          </button>
        ) : <img
        src={deleteIcon}
        alt="Delete"
        title="Delete"
        className="w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 hover:scale-110 opacity-0"
      />}
      </div>
    </div>
  );
};

export default MeowButtons;
