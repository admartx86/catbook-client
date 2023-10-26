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
    <div className="flex flex-col">
      <div className="flex">
        <div className="p-1 break-all text-xs lg:text-base">{authorName}</div>

        <div className="text-slate-600 p-1 break-all text-xs lg:text-base">@{authorUsername}</div>

        <div className="text-slate-600 p-1 break-all text-xs lg:text-base">
          {getMeowTimeStamp(timeSincePosted)}
        </div>
      </div>

      <div>
        <div>
          {meow?.isAReply ? (
            <div className="text-slate-600 p-1 break-all text-xs lg:text-base">
              Replying to @{authorUsername}
            </div>
          ) : null}
        </div>
        <div>
          {meow?.isARemeow ? (
            <div className="text-slate-600 p-1 break-all text-xs lg:text-base">
              Remeowed @{authorUsername}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MeowHeader;
