import { useContext, useState, ChangeEvent } from 'react';
import { FilterContext } from '../../contexts/FilterContext';

import { ReactComponent as FilterIcon } from '../../assets/images/filter.svg';

import './styles.scss';

export function FilterBar() {
  const [displayFilters, setDisplayFilters] = useState(false);
  const {
    setTextFilter,
    isAnsweredFilter,
    setIsAnsweredFilter,
    isMyQuestionFilter,
    setIsMyQuestionFilter
  } = useContext(FilterContext);

  function handleTextFilter(e: ChangeEvent<HTMLInputElement>) {
    setTextFilter(e.currentTarget.value);
    console.log(e.currentTarget.value);
  }
  function handleIsAnsweredFilter() {
    setIsAnsweredFilter(!isAnsweredFilter);
  }
  function handleIsMyQuestionFilter() {
    setIsMyQuestionFilter(!isMyQuestionFilter);
  }

  function handleDisplayFilters() {
    setDisplayFilters(!displayFilters);
  }

  return (
    <div className={`filter-bar ${displayFilters ? 'active-bar' : ''}`}>
      <input type="text" onChange={handleTextFilter} />
      <div className="right-filters">
        <button
          className={`${isAnsweredFilter ? 'active-filter' : ''}`}
          onClick={handleIsAnsweredFilter}
        >
          Answered
        </button>
        <button
          className={`${isMyQuestionFilter ? 'active-filter' : ''}`}
          onClick={handleIsMyQuestionFilter}
        >
          My Questions
        </button>
        <span className="background-reset">
          <span
            className={`filter-icon ${displayFilters ? 'display-filters' : ''}`}
            onClick={handleDisplayFilters}
          >
            <FilterIcon />
          </span>
        </span>
      </div>
    </div>
  );
}
