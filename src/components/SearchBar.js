import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('Search');

  const handleSearch = async () => {
    navigate(`/explore?q=${query}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  
  console.log('query:', query);
  console.log('filterCriteria:', filterCriteria);

  return (
    <div className='flex'>
    <div className='flex-grow self-center px-2'>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search Catbook"
        className='rounded-2xl border-4 border-slate-200 pl-2 w-full'
      />
    </div>
          <button className="bg-purple-400 text-white 
              rounded-full px-4 py-2 m-2
              hover:scale-110 transition-all ease-in-out duration-200" 
          onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
