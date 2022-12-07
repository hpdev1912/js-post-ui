import postApi from './api/postApi';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { initPagination, initSearchInput, renderPagination, renderPostList, toast } from './utils';

//extend to use fromNow
dayjs.extend(relativeTime);

async function handleFilterChange(filterName, filterValue) {
  try {
    //update query params
    const url = new URL(window.location);
    if (filterName) url.searchParams.set(filterName, filterValue);

    //reset page if neededO
    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    history.pushState({}, '', url);
    //fetch api
    const { data, pagination } = await postApi.getAll(url.searchParams);
    //re-render post list
    renderPostList('postList', data);
    //re-render pagination
    renderPagination('postsPagination', pagination);
  } catch (error) {
    console.log('Failed to fetch posts', error);
  }
}

//add an event listener for listening custom event was triggered from child element
function registerDeletePostEvent() {
  document.addEventListener('delete-post', async (event) => {
    try {
      const post = event.detail;
      const windowMessage = `Are you sure to remove the post with title: ${post.title}`;

      if (window.confirm(windowMessage)) {
        await postApi.remove(post.id);

        //reload
        await handleFilterChange();

        toast.success('Remove Post Successful!');
      }
    } catch (error) {
      toast.error(error.message);
    }
  });
}

(async () => {
  //set default query params if not exist
  try {
    const url = new URL(window.location);
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    registerDeletePostEvent();

    initPagination({
      elementId: 'postsPagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    initSearchInput({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (title) => handleFilterChange('title_like', title),
    });

    // const { data, pagination } = await postApi.getAll(queryParams);
    // renderPostList('postList', data);
    // renderPagination('postsPagination', pagination);
    handleFilterChange();
  } catch (error) {
    console.log(error);
  }
})();
