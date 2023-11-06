import React from 'react';

const ComposeMeowTextArea = ({ isAReply, isARemeow, meowText, setMeowText, inputRef }) => {

  return (
    <textarea
      ref={inputRef}
      placeholder={
        isAReply ? 'Post your reply' : isARemeow ? 'Add a comment...' : "What's happening?"
      }
      value={meowText}
      fullwidth="true"
      onChange={(e) => {
        if (e.target.value.length <= 280) {
          setMeowText(e.target.value);
        }
      }}
      className="box-border
          flex-shrink-0
          block
          w-full lg:w-1/2
          h-48 lg:h-32
          m-0 p-2 
          overflow-y-auto overflow-x-hidden
          sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
          focus:outline-none"
    />
  );
};

export default ComposeMeowTextArea;
