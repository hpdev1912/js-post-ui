import postApi from './api/postApi';
import { registerLightbox, renderPostDetail } from './utils';

//Main
(async () => {
  registerLightbox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });
  //get post Id from url
  const url = new URL(window.location);
  const postId = url.searchParams.get('id');
  if (!postId) return;

  try {
    const postDetail = await postApi.getById(postId);
    renderPostDetail(postDetail);
  } catch (error) {
    console.log(`Failed to fetch post detail by id ${postId}`, error);
  }
})();
