import React, { useState, useEffect } from 'react';

const ComposeMeowRemainingCharacters = ({ meowText }) => {
  const [remainingCharacters, setRemainingCharacters] = useState(280);

  useEffect(() => {
    setRemainingCharacters(280 - meowText.length);
  }, [meowText]);

  return (
    <div className="p-1 md:p-2 lg:p-3 xl:p-4 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
      {remainingCharacters}
    </div>
  );
};

export default ComposeMeowRemainingCharacters;
