import React from 'react';
import { Link } from 'react-router-dom';

const MeowHeader = ({ authorName, authorUsername, createdAt, meow, repliedToAuthor }) => {
  const timeSincePosted = new Date(createdAt).toLocaleString();

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

  return (
    <div className="flex">
      <div className="text-xl sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl">{authorName}</div>

      <div className="text-slate-600 text-xl sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl">
        @{authorUsername}
      </div>

      <div className="text-slate-600 text-xl sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl">
        {getMeowTimeStamp(timeSincePosted)}
      </div>

      <div>
        {meow?.isAReply ? (
          <span className="text-slate-600 text-xl sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl">
            Replying to{' '}
            <Link to={`/${authorUsername}`} onClick={(e) => e.stopPropagation()}>
              @{meow?.repliedToAuthor}
            </Link>
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default MeowHeader;
