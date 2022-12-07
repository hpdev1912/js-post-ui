function showModal(modalElement) {
  const myModal = new window.bootstrap.Modal(modalElement);
  if (myModal) myModal.show();
}
//handle click for all image -> event delegation
//img click -> find all imgs with the same album / gallery
//determine index of selected img
//show modal with selected img
//handle prev/next click
export function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;
  //prevent multi event click was triggered on one modal
  if (modalElement.dataset.registered) return;
  //
  const imgElement = modalElement.querySelector(imgSelector);
  const prevButtonElement = modalElement.querySelector(prevSelector);
  const nextButtonElement = modalElement.querySelector(nextSelector);

  if (!imgElement || !prevButtonElement || !nextButtonElement) return;

  let imgList = [];
  let currentIndex = 0;

  function showImageAtIndex(index) {
    imgElement.src = imgList[index].src;
  }

  document.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;

    //img with data-album
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);

    //show img at index
    showImageAtIndex(currentIndex);
    //show modal
    showModal(modalElement);
  });

  prevButtonElement.addEventListener('click', () => {
    //back to previous img
    //go to next img
    //may be negative number
    //0->2->1->0->2->1
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;

    showImageAtIndex(currentIndex);
  });

  nextButtonElement.addEventListener('click', () => {
    //go to next img
    //0 -> 1 -> 2 -> 0 -> 1 ->2
    currentIndex = (currentIndex + 1) % imgList.length;

    showImageAtIndex(currentIndex);
  });

  modalElement.dataset.registered = 'true';
}
