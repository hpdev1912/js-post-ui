import {
  formatTime,
  getTimeFromNow,
  setBackgroundImage,
  setElementText,
  setElementThumbnail,
  setFieldValue,
  truncateText,
} from './common';

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  //clear before render
  ulElement.textContent = '';

  for (const post of postList) {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  }
}

export function createPostElement(post) {
  if (!post) return;
  const { id, author, description, title, imageUrl, updatedAt } = post;
  const timeFromNow = getTimeFromNow(updatedAt);
  //find template
  const template = document.getElementById('postItemTemplate');
  if (!template) return;

  //find and clone template
  const postElement = template.content.firstElementChild.cloneNode(true);
  if (!postElement) return;
  //update title, description, author, thumbnail
  setElementText(postElement, '[data-id="title"]', title);
  setElementText(postElement, '[data-id="description"]', truncateText(description, 100));
  setElementText(postElement, '[data-id="author"]', author);
  setElementText(postElement, '[data-id="timeSpan"]', `- ${timeFromNow}`);

  setElementThumbnail(postElement, '[data-id="thumbnail"]', imageUrl);
  //attach events
  //go to post detail page when click div.post-item
  const divElement = postElement.firstElementChild;
  if (divElement) {
    divElement.addEventListener('click', (event) => {
      //if event was triggered inside menu -> ignore
      const menuElement = postElement.querySelector('[data-id="menu"]');

      //event.target is current element was clicked
      if (menuElement && menuElement.contains(event.target)) return;

      window.location.assign(`/post-detail.html?id=${id}`);
    });
  }

  //add click event for edit button
  const editButton = divElement.querySelector('[data-id="edit"]');
  if (editButton) {
    editButton.addEventListener('click', (event) => {
      //prevent bubbling to parent events but will impact to web tracking
      //because it will not bubbling to document for analytics
      // another solution is check from parents node
      //event.stopPropagation();

      window.location.assign(`/add-edit-post.html?id=${id}`);
    });
  }

  //add click event for remove button
  const removeButton = divElement.querySelector('[data-id="remove"]');
  if (removeButton) {
    removeButton.addEventListener('click', (event) => {
      const customEvent = new CustomEvent('delete-post', {
        bubbles: true, //bubbling
        detail: post, //data attach to this event
      });

      //dispatch an custom event to parent element (home page)
      removeButton.dispatchEvent(customEvent);
    });
  }

  return postElement;
}

export function renderPostDetail(postDetail) {
  setElementText(document, '#postDetailTitle', postDetail.title);

  setElementText(document, '#postDetailAuthor', postDetail.author);

  setElementText(document, '#postDetailTimeSpan', `- ${formatTime(postDetail.updatedAt)}`);
  setElementText(document, '#postDetailDescription', postDetail.description);

  setBackgroundImage('postHeroImage', postDetail.imageUrl);

  //render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');

  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${postDetail.id}`;
    editPageLink.innerHTML = '<i class= "fas fa-edit"></i>Edit Post';
  }
}
