import React, { useEffect } from 'react';
import { usePersistedUser } from "./usePersistedUser";
import { useMeowCRUD } from './useMeowCRUD';  // <-- Import the custom hook

const Meow = () => {
  
  usePersistedUser();
  
  const { meow, setMeowId, meowText, setMeowText, createMeow, readMeow, updateMeow, deleteMeow } = useMeowCRUD();

  useEffect(() => {
    setMeowId('some-meow-id');
    readMeow();
  }, []);

  return (
    <div>
      <h1>Meow Component</h1>
      
      <input 
        type="text" 
        placeholder="Meow text" 
        value={meowText} 
        onChange={(e) => setMeowText(e.target.value)}
      />

      <button onClick={createMeow}>Create Meow</button>
     
      
     

      {meow && (
        <div>
          <h2>Read Meow</h2>
          <p>{meow.meowText}</p>
        </div>
      )}
    </div>
  );
};

export default Meow;
