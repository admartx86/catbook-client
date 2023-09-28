import React from "react";

const Meow = ({ meow }) => {
  
  const { authorPhoto, authorName, authorUsername, createdAt, meowText, mediaUrl, embedMeow } = meow;

  
  const timeSincePosted = new Date(createdAt).toLocaleString()

  return(
    <div>
      <div className="meow-header">
        <p>{authorPhoto ? <img src={authorPhoto} alt="Profile" /> : "Profile Photo"}</p>
        <p>{authorName}</p>
        <p>{authorUsername}</p>
        <p>{timeSincePosted}</p>
        <p>More</p>
      </div>

      <div className="meow-content">
        <p>{meowText}</p>
        <p>{mediaUrl ? <img src={mediaUrl} alt="Media" /> : "Media"}</p>
        {embedMeow && <p>Embedded Meow: {embedMeow.meowText}</p>} {/* Assuming embedMeow is also a meow object */}
      </div>

      <div className="meow-actions">
        <p>Reply</p>
        <p>Remeow</p>
        <p>Like</p>
      </div>
    </div>
  );
};

export default Meow;