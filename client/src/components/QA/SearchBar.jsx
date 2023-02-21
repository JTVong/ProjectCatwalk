import React, { useState, useMemo, useEffect, useCallback } from 'react';

const SearchBar = ({ questions, searchResult }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Memorize filteredQuestions to avoid unnecessary re-renders
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) =>
      q.question_body.toLowerCase().includes(searchTerm)
    );
  }, [questions, searchTerm]);

  // Memorize delayed func to prevent it from being recreated on every re-render
  const delayed = useCallback((func, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }, []);

  // Handle onChange search input event and delayed the execution of the search
  const handleOnChange = useCallback(
    delayed((e) => {
      const keyword = e.target.value.trim().toLowerCase();
      setSearchTerm(keyword);
      setLoading(true);
    }, 500),
    []
  );

  // Update filteredQuestions state when searchTerm changes
  useEffect(() => {
    setLoading(true);
  }, [searchTerm]);

  // Call searchResult callback when the filteredQuestions or loading state changes
  useEffect(() => {
    if (loading) {
      searchResult(filteredQuestions);
      setLoading(false); // set loading back to false after searchResult is called
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
