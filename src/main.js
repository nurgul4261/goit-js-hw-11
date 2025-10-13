import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './js/fetchImages.js';
import SimpleLightbox from 'simplelightbox';
import iziToast from 'izitoast';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadingMessage = document.querySelector('.loading-message');
const lightbox = new SimpleLightbox('.gallery a');

function showLoadingMessage() {
  loadingMessage.classList.remove('hidden');
}

function hideLoadingMessage() {
  setTimeout(() => {
    loadingMessage.classList.add('hidden');
  }, 1000);
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = e.target.searchQuery.value.trim();
  if (!query) return;

  e.target.searchQuery.value = '';

  gallery.innerHTML = '';
  showLoader();
  showLoadingMessage();
  try {
    const data = await fetchImages(query);
    console.log(data.hits);
    hideLoader();
    hideLoadingMessage();

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        backgroundColor: '#EF4040',
      });
      return;
    }

    e.target.searchQuery.value = '';

    const markup = data.hits
      .map(
        img => `
        <a href="${img.largeImageURL}" class="gallery-item">
          <img src="${img.webformatURL}" alt="${img.tags}" />
          <div class="info">
            <div class="info-block"><span class="info-title">Likes</span><span class="info-value">${img.likes}</span></div>
            <div class="info-block"><span class="info-title">Views</span><span class="info-value">${img.views}</span></div>
            <div class="info-block"><span class="info-title">Comments</span><span class="info-value">${img.comments}</span></div>
            <div class="info-block"><span class="info-title">Downloads</span><span class="info-value">${img.downloads}</span></div>
          </div>
        </a>`
      )
      .join('');

    gallery.innerHTML = markup;
    lightbox.refresh();
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    console.error(error);
  }
});

function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}