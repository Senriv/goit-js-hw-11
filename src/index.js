import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetch-pixabay.js';
import { renderGallery } from './render-gallery.js';

const refs = {
  search: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let query = '';
let page = 1;
const perPage = 40;
let simpleLightBox;

refs.search.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);
refs.loadMoreBtn.classList.add('is-hidden');

async function onSearch(evt) {
  evt.preventDefault();
  page = 1;
  query = evt.currentTarget.searchQuery.value.trim();
  refs.gallery.innerHTML = '';

  if (query === '') {
    alertEmptyLine();
    return;
  }

  try {
    const { data } = await fetchImages(query, page, perPage);

    if (data.totalHits === 0) {
        alertNoResultat();
    } else {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
      }).refresh();
      alertTotalImagesFound(data);

      if (data.totalHits > perPage) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    refs.search.reset();
  }
}

async function onLoadMoreBtn() {
  page += 1;
  simpleLightBox.destroy();

  try {
    const { data } = await fetchImages(query, page, perPage);

    renderGallery(data.hits);
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();

    const totalPages = Math.ceil(data.totalHits / perPage);

    if (page >= totalPages) {
      refs.loadMoreBtn.classList.add('is-hidden');
      await delay(500);
      alertEndResultat();
    }
  } catch (error) {
    console.log(error);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function alertTotalImagesFound(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertEmptyLine() {
  Notiflix.Notify.failure(
    'The search bar cannot be empty. Please type any criteria in the search bar.'
  );
}

function alertNoResultat() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndResultat() {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}
