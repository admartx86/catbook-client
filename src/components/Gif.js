import React, { useState, useEffect } from 'react';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

const Gif = ({ setSelectedGifUrl, setIsSelectingGif }) => {
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

  return <Grid width={800} columns={3} fetchGifs={fetchGifs} onGifClick={handleGifClick} />;
};

export default Gif;
