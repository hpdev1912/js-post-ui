import { getPaginationElement } from './selectors';

export function initPagination({ elementId, defaultParams, onChange }) {
  //find ul pagination
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;
  //bind event for Prev button
  const prevLinkElement = ulPagination.firstElementChild?.firstElementChild;
  if (prevLinkElement) {
    prevLinkElement.addEventListener('click', (event) => {
      event.preventDefault();
      const currentPage = Number.parseInt(ulPagination.dataset.page) || 1;
      if (currentPage > 2) onChange?.(currentPage - 1);
    });
  }
  //bind event for Next button
  const nextLinkElement = ulPagination.lastElementChild?.lastElementChild;
  if (nextLinkElement) {
    nextLinkElement.addEventListener('click', (event) => {
      event.preventDefault();

      const currentPage = Number.parseInt(ulPagination.dataset.page) || 1;
      const totalPages = ulPagination.dataset.totalPages;

      if (currentPage < totalPages) onChange?.(currentPage + 1);
    });
  }
}

export function renderPagination(elementId, pagination) {
  const ulPaginationElement = document.getElementById(elementId);
  if (!ulPaginationElement || !pagination) return;

  const { _limit, _page, _totalRows } = pagination;
  //calc total pages
  const totalPages = Math.ceil(_totalRows / _limit);

  const prevLiElement = ulPaginationElement.firstElementChild;
  if (!prevLiElement) return;

  const nextLiElement = ulPaginationElement.lastElementChild;
  if (!nextLiElement) return;
  //set dataset
  ulPaginationElement.dataset.page = _page;
  ulPaginationElement.dataset.totalPages = totalPages;
  //disable prev/next link
  _page <= 1 ? prevLiElement.classList.add('disabled') : prevLiElement.classList.remove('disabled');
  _page >= totalPages
    ? nextLiElement.classList.add('disabled')
    : nextLiElement.classList.remove('disabled');
}
