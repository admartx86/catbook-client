import React from 'react';
import clearSelectionIcon from '../img/remove-button.png';

const ComposeMeowGifAndMediaPreview = ({
  selectedGifUrl,
  previewUrl,
  setPreviewUrl,
  setSelectedFile,
  clearSelectedGif,
  fileInputRef
}) => {
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // const clearSelectedGif = () => {
  //   setSelectedGifUrl(null);
  // };

  return (
    <div className="w-full flex flex-col lg:flex-row">
      <figure className="flex-1 p-2 relative">
        {!selectedGifUrl ? (
          <div>
            {previewUrl && (
              <>
                {previewUrl.startsWith('data:image/') ? (
                  <div className="p-2">
                    <img src={previewUrl} alt="Selected Media" className="rounded-lg w-full" />
                  </div>
                ) : (
                  <div className="p-2">
                    <video controls width="200">
                      <source
                        src={previewUrl}
                        alt="SelectedMedia"
                        type="video/mp4"
                        className="w-full rounded-lg"
                      />
                    </video>
                  </div>
                )}
                <button
                  onClick={clearSelectedFile}
                  title="Clear Selected Media"
                  className="absolute top-0 right-0 bg-gray-200 bg-opacity-25 text-white p-2 rounded-full m-4"
                >
                  <img src={clearSelectionIcon} alt="Clear Selected Media" className="w-10" />
                </button>
              </>
            )}
          </div>
        ) : null}

        {selectedGifUrl && (
          <>
            <img src={selectedGifUrl} alt="Selected GIF" className="rounded-lg w-full" />
            <button
              onClick={clearSelectedGif}
              title="Clear Selected GIF"
              className="absolute top-0 right-0 bg-gray-200 bg-opacity-25 text-white p-2 rounded-full m-4"
            >
              <img src={clearSelectionIcon} alt="Clear Selected GIF" className="w-10" />
            </button>
          </>
        )}
      </figure>

      <figure className="relative flex-1">
        {previewUrl && selectedGifUrl && (
          <>
            {previewUrl.startsWith('data:image/') ? (
              <div className="p-2">
                <img src={previewUrl} alt="Selected Media" className="rounded-lg w-full" />
              </div>
            ) : (
              <div className="p-2">
                <video controls width="200">
                  <source
                    src={previewUrl}
                    alt="SelectedMedia"
                    type="video/mp4"
                    className="w-full rounded-lg"
                  />
                </video>
              </div>
            )}
            <button
              onClick={clearSelectedFile}
              title="Clear Selected Media"
              className="absolute top-0 right-0 bg-gray-200 bg-opacity-25 text-white p-2 rounded-full m-4"
            >
              <img src={clearSelectionIcon} alt="Clear Selected Media" className="w-10" />
            </button>
          </>
        )}
      </figure>
    </div>
  );
};

export default ComposeMeowGifAndMediaPreview;
