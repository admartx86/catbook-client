import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const formRef = useRef(null); 
  
  const handleSearch = async (e) => {
    e.preventDefault();
    navigate(`/explore?q=${query}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      formRef.current && formRef.current.requestSubmit(); // Request form submission
    }
  };

  return (
    <form ref={formRef} className="flex" onSubmit={handleSearch}>
      <input
        className="rounded-2xl border-4 border-slate-200 pl-2 w-full flex-grow self-center px-2 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search Catbook"
      />
      <button
        type="submit"
        className="bg-purple-400 text-white 
          rounded-full px-4 py-2 m-2
          sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
          hover:scale-110 transition-all ease-in-out duration-200"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
