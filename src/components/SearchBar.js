import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('Search');

  const handleSearch = async () => {
    navigate(`/explore?q=${query}`);
  };

  console.log('query:', query);
  console.log('filterCriteria:', filterCriteria);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Catbook"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
