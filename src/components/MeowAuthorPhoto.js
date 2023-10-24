import React from 'react';
import { Link } from 'react-router-dom';

const MeowAuthorPhoto = ({ authorPhoto, authorUsername }) => {
  return (
    <div>
      {authorPhoto ? (
        <Link to={`/${authorUsername}`} reloadDocument={true} onClick={(e) => e.stopPropagation()}>
          <img
            src={authorPhoto}
            alt="Profile"
            className="flex flex-shrink-0 rounded-full w-18 sm:w-20 md:w-22 lg:w-24 xl:w-26"
          />
        </Link>
      ) : (
        <Link to={`/${authorUsername}`} reloadDocument={true} onClick={(e) => e.stopPropagation()}>
          <img
            src="https://catbook.s3.us-east-2.amazonaws.com/site-assets/profile-photo-placeholder.png"
            className="flex flex-p-5 m-7 rounded-full w-18 sm:w-20 md:w-22 lg:w-24 xl:w-26"
          />
        </Link>
      )}
    </div>
  );
};

export default MeowAuthorPhoto;
