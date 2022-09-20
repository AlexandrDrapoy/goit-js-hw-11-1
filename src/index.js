import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import {
  getUser,
  createMarkup,
  onVisible,
  notLastPage,
  perPage,
} from './js/taskService';

import { gallery, searchForm, loadMore } from './js/element';

let requestText = '';
let pageNumber = 1;
let lightbox;
let totalCard = 0;
searchForm.addEventListener('submit', onSubmitForm);

async function onSubmitForm(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  requestText = evt.target.elements.searchQuery.value;
  try {
    const data = await getUser(requestText);
    totalCard = data.totalHits;
    if (!data.totalHits) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
    }

    createMarkup(data);

    lightbox = new SimpleLightbox('.gallery a', {
      captionDelay: 250,
      captionsData: 'alt',
    }).refresh();

    console.log(data.total);
    if (data.totalHits > perPage) {
      onVisible();
    }
    pageNumber = notLastPage(data, pageNumber);
    searchForm.reset();
  } catch {
    console.log(Error);
  }
}

loadMore.addEventListener('click', addImgOnEvt);

async function addImgOnEvt() {
  try {
    const data = await getUser(requestText, pageNumber);
    createMarkup(data);
    lightbox = new SimpleLightbox('.gallery a', {
      captionDelay: 250,
      captionsData: 'alt',
    }).refresh();
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2.3,
      behavior: 'smooth',
    });
    pageNumber = notLastPage(data, pageNumber);
    console.log(pageNumber);
  } catch (error) {
    console.log(Error);
  }
}

document.addEventListener(
  'scroll',
  throttle(async evt => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      (pageNumber - 1) * perPage < totalCard
    ) {
      await addImgOnEvt();
    }
  }),
  1000
);
// 345;
// debounce(
//   (window.onscroll = async function (ev) {
//     if (
//       window.innerHeight + window.scrollY >= document.body.offsetHeight &&
//       pageNumber * perPage < data.totalHits
//     ) {
//       await addImgOnEvt();
//     }
//   }),
//   250
// );
