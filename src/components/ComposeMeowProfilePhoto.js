import React from 'react';
import { useSelector } from 'react-redux';

const ComposeMeowProfilePhoto = () => {
  const profilePhoto = useSelector((state) => state.user.profilePhoto);

  return (
    <div>
      {profilePhoto ? (
        <div className="p-1 md:p-2 lg:p-3 xl:p-4">
          <img
            src={profilePhoto}
            alt={'Profile Photo'}
            className="block rounded-full w-10 md:w-16 lg:w-20 xl:w-24"
          />
        </div>
      ) : (
        <div className="p-1">
          <img
            src="https://catbook.s3.us-east-2.amazonaws.com/site-assets/profile-photo-placeholder.png"
            className="inline-block p-1 justify-center rounded-full w-10"
          />
        </div>
      )}
    </div>
  );
};

export default ComposeMeowProfilePhoto;
