import React, { useState, useMemo, useEffect, useCallback } from 'react';

const SearchBar = ({ questions, searchResult }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Memoize filteredQuestions to avoid unnecessary re-renders
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) =>
      q.question_body.toLowerCase().includes(searchTerm)
    );
  }, [questions, searchTerm]);

  // Memoize debounce function to prevent it from being recreated on every re-render
  const debounce = useCallback((func, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }, []);

  // Handle onChange event of the search input and debounce the execution of the search
  const handleOnChange = useCallback(
    debounce((e) => {
      const keyword = e.target.value.trim().toLowerCase();
      setSearchTerm(keyword);
      setLoading(true);
    }, 500),
    []
  );

  // Update filteredQuestions state when the searchTerm changes
  useEffect(() => {
    setLoading(true);
  }, [searchTerm]);

  // Call searchResult callback when the filteredQuestions or loading state changes
  useEffect(() => {
    if (!loading) {
      searchResult(filteredQuestions);
    }
  }, [filteredQuestions, loading, searchResult]);

  return (
    <form className='search-wrapper'>
      <label htmlFor='search'>
        Have a question? Search for answers...
      </label>
      <input
        id='search'
        type='search'
        minLength='3'
        autoComplete='off'
        value={searchTerm}
        onChange={handleOnChange}
      />
      <i className='fas fa-search' />
    </form>
  );
};

export default SearchBar;
