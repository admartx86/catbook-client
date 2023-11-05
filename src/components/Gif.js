import React, { useState, useEffect } from 'react';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

const Gif = ({
  setSelectedGif,
  setSelectedGifUrl,
  setIsSelectingGif,
  isEditing,
  isSelectingGif
}) => {
  const [localSelectedGif, setLocalSelectedGif] = useState(null);

  const gf = new GiphyFetch(process.env.REACT_GIPHY_API_KEY);

  const fetchGifs = (offset) => gf.search('kittens meowing', { offset, limit: 10 });

  const handleGifClick = (gif, e) => {
    e.preventDefault();
    setLocalSelectedGif(gif);
    setSelectedGifUrl(gif.images.fixed_height.url);
    setIsSelectingGif(false);
    console.log('Selected GIF:', gif);
  };

  useEffect(() => {
    if (localSelectedGif) {
      setSelectedGif(localSelectedGif);
    }
  }, [localSelectedGif]);

  const closeGifSelect = () => {
    setIsSelectingGif(false);
  };

  return (
    <div className="flex flex-col pl-12">
      <div className="flex p-3">
        {!isEditing && isSelectingGif ? (
          <button
            onClick={closeGifSelect}
            className="bg-purple-400 text-white 
            rounded-full px-4 py-2
            sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
            hover:scale-110 transition-all ease-in-out duration-200"
          >
            Close GIF Select
          </button>
        ) : null}
      </div>
      <div>
        {isSelectingGif ? (
          <Grid
            width={800}
            columns={3}
            fetchGifs={fetchGifs}
            onGifClick={handleGifClick}
            setSelectedGifUrl={setSelectedGifUrl}
            setIsSelectingGif={setIsSelectingGif}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Gif;
