import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlaceholderMeow = ({ meow, isEmbedded }) => {
  const navigate = useNavigate();

  return (
    <div
      className="placeholder-meow"
      onClick={() => {
        if (!isEmbedded) {
          navigate(`/${meow.author.username}/status/${meow._id}`);
        }
      }}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        cursor: isEmbedded ? 'default' : 'pointer'
      }}
    >
      <img
        src={'https://catbook.s3.us-east-2.amazonaws.com/site-assets/cryingcat.gif'}
        alt="A Crying Kitten"
        className="w-max-w-full p-5"
      />
      <p className="text-2xl sm:text-2xl md:text-4xl lg:text-4xl xl:text-5xl p-5">
        😢 This meow was deleted.
      </p>
    </div>
  );
};

export default PlaceholderMeow;
