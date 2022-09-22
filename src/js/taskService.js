import axios from 'axios';

import { gallery, loadMore } from '../js/element';
import Notiflix from 'notiflix';

const baseURL = 'https://pixabay.com/api/';
const myPixabayKey = '9501682-9e07b04398919d00ada26c10b';
export const perPage = 40;
// Want to use async/await? Add the `async` keyword to your outer function/method.
export async function getUser(serchResult, pageNumber = 1) {
  const response = await axios.get(baseURL, {
    params: {
      key: myPixabayKey, //унікальний ключ доступу до API.
      q: serchResult, //- термін для пошуку. Те, що буде вводити користувач.
      image_type: 'photo', // - тип зображення.
      orientation: 'horizontal', // - орієнтація фотографії.
      safesearch: true,
      per_page: perPage,
      page: pageNumber, //: - фільтр за віком.
    },
  });

  return response.data;
}

export function createMarkup(data) {
  console.log(data);
  const markup = data.hits
    .map(
      ({
        id,
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a class = "gallary--link" href="${largeImageURL}">
        <div class="photo-card" id=${id}>
            <img class = "gallary--item" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
        </div>
      </a>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

export function onVisible(elem = loadMore) {
  elem.classList.toggle('on-visible');
}

export function notLastPage(data, pageNumber) {
  if (pageNumber * perPage > data.totalHits) {
    onVisible();
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
  return (pageNumber += 1);
}
