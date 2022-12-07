import debounce from 'lodash.debounce';

export function initSearchInput({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;
  //   const queryParams = new URLSearchParams(window.location.search);
  if (defaultParams.get('title_like')) searchInput.value = defaultParams.get('title_like');
  //set default value for search input
  const debounceSearch = debounce((event) => onChange?.(event.target.value), 500);
  searchInput.addEventListener('input', debounceSearch);
}
