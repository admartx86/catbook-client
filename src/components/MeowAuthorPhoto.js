import React from 'react';
import { Link } from 'react-router-dom';

const MeowAuthorPhoto = ({ authorPhoto, authorUsername }) => {
  return (
    <div className="flex flex-shrink-0 items-start">
      {authorPhoto ? (
        <Link
          className="inline-block p-1 md:p-2 lg:p-3 xl:p-4"
          to={`/${authorUsername}`}
          reloadDocument={true}
          onClick={(e) => e.stopPropagation()}
        >
          <img src={authorPhoto} alt="Profile" className="rounded-full w-10 md:w-16 lg:w-20 xl:w-24" />
        </Link>
      ) : (
        <Link
          className="inline-block p-1 "
          to={`/${authorUsername}`}
          reloadDocument={true}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src="https://catbook.s3.us-east-2.amazonaws.com/site-assets/profile-photo-placeholder.png"
            className="rounded-full w-10 md:w-16 lg:w-20 xl:w-24"
          />
        </Link>
      )}
    </div>
  );
};

export default MeowAuthorPhoto;
