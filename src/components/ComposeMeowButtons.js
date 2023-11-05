import React from 'react';
import gifIcon from '../img/piece.png';
import mediaIcon from '../img/picture.png';

const ComposeMeowButtons = ({
  isEditing,
  isSelectingGif,
  onFileChange,
  openGifSelect,
  onUpdateMeow,
  onCreateMeow
}) => {
  return (
    <div className="pl-14 md:pl-24 lg:pl-28 xl:pl-32 flex">
      <div className="flex p-3 lg:p-5">
        {isEditing || isSelectingGif ? null : (
          <button>
            <input type="file" id="fileInput" className="hidden" onChange={onFileChange} />
            <label htmlFor="fileInput" className="cursor-pointer">
              <img
                src={mediaIcon}
                alt="Add Media"
                title="Add Media"
                className="w-6 lg:w-12 self-center hover:scale-110 transition-all ease-in-out duration-200"
              />
            </label>
          </button>
        )}
      </div>

      <div className="flex p-3 lg:p-5">
        {!isEditing && !isSelectingGif ? (
          <button onClick={openGifSelect}>
            <img
              src={gifIcon}
              alt="Add GIF"
              title="Add GIF"
              className="w-6 lg:w-12 hover:scale-110 transition-all ease-in-out duration-200"
            />
          </button>
        ) : null}
      </div>

      <div className="flex p-3 lg:p-5">
        {isEditing ? (
          <div className="self-center">
            <button
              onClick={() => onUpdateMeow()}
              className="bg-purple-400 text-white 
              rounded-full px-4 py-2
              sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
              hover:scale-110 transition-all ease-in-out duration-200"
            >
              Post Changes
            </button>
          </div>
        ) : (
          !isSelectingGif && (
            <div className="self-center">
              <button
                onClick={() => {
                  console.log('Button Clicked');
                  onCreateMeow();
                }}
                className="bg-purple-400 text-white 
              rounded-full px-4 py-2
              sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
              hover:scale-110 transition-all ease-in-out duration-200"
              >
                Post
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ComposeMeowButtons;
