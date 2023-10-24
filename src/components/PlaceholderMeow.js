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
      />
      😢 This meow was deleted.
    </div>
  );
};

export default PlaceholderMeow;
