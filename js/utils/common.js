import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//extend to use fromNow
dayjs.extend(relativeTime);

export function setElementText(parentElement, selector, text) {
  if (!parentElement) return;
  const childElement = parentElement.querySelector(selector);
  if (childElement) childElement.textContent = text;
}

export function setFieldValue(parentElement, selector, value) {
  if (!parentElement) return;
  const childElement = parentElement.querySelector(selector);
  if (childElement) childElement.value = value;
}

export function setElementThumbnail(parentElement, selector, url) {
  if (!parentElement) return;
  const childElement = parentElement.querySelector(selector);
  if (childElement) {
    childElement.src = url;
    //when loading image get an error, browser will listen event error
    childElement.addEventListener('error', () => {
      childElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 1)}…`;
}

export function getTimeFromNow(milliseconds) {
  return dayjs(milliseconds).fromNow();
}

export function formatTime(milliseconds) {
  return dayjs(milliseconds).format('HH:mm DD/MM/YYYY');
}

export function setBackgroundImage(elementId, url) {
  const backgroundImage = document.getElementById(elementId);
  if (!backgroundImage) return;
  backgroundImage.style.backgroundImage = `url(${url})`;
  backgroundImage.addEventListener('error', () => {
    backgroundImage.style.backgroundImage = `url('https://via.placeholder.com/1368x400?text=thumbnail')`;
  });
}

export function randomNumber(n) {
  if (n <= 0) return -1;

  const random = Math.random() * n;
  return Math.round(random);
}
