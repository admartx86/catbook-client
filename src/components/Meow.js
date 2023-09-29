import React from "react";
import { useDispatch } from 'react-redux';
import { deleteMeow as deleteMeowAction, updateMeow as updateMeowAction } from '../meowActions';

// import { useMeowCRUD } from './useMeowCRUD';
// import { deleteMeow } from '../meowActions';

const Meow = ({ meow }) => {
  //TS: 'deleteMeow' is declared but its value is never read.//

  const dispatch = useDispatch();

  const { _id, authorPhoto, authorName, authorUsername, createdAt, meowText, mediaUrl, embedMeow } = meow;
  // const { updateMeow } = useMeowCRUD();
  
  const timeSincePosted = new Date(createdAt).toLocaleString()
  
  const handleDeleteMeow = () => {
    console.log("Attempting to delete meow with ID:", meow._id);  
    if (meow._id) {
      console.log("Attempting to delete meow with ID:", meow._id);
      dispatch(deleteMeowAction(meow._id));  
    } else {
      console.log("No ID available for deletion");
    }
  };

  const handleUpdateMeow = () => {
if (meow._id) {
    dispatch(updateMeowAction({ meowId: meow._id, meowText: "Updated text" }));
    console.log("Attempting to update meow with ID:", meow._id);
} else {
  console.log("No ID available for update");
  }
  }

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
        <button onClick={handleDeleteMeow}>Delete Meow</button>
        <button onClick={handleUpdateMeow}>Update Meow</button>
      </div>
    </div>
  );
};

export default Meow;