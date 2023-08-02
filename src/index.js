import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabayAPI } from './js/api';

const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const listCardsEl = document.querySelector('.gallery');

const newsApiService = new PixabayAPI();

searchForm.addEventListener('submit', handleSearchArticles);
loadMoreBtn.addEventListener('click', searchMoreArticles);

loadMoreBtn.classList.add('is-hidden');

function handleSearchArticles(event) {
  event.preventDefault();

  loadMoreBtn.classList.add('is-hidden');
  newsApiService.query = event.currentTarget.elements.searchQuery.value;

  newsApiService.resetPage();
  clearGalleryContainer();

  const searchImg = newsApiService.query.trim();
  if (!searchImg) {
    return Notify.failure(`❌Еnter a word to search for❌`);
  }

  newsApiService
    .fetchPosts()
    .then(response => {
      if (!response.hits.length) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      newsApiService.incrementPage();
      createGalleryCards(response.hits);

      loadMoreBtn.classList.remove('is-hidden');
    })
    .catch(err => {
      Notify.failure(`❌${err.message}❌`);
    });
}

function searchMoreArticles() {
  newsApiService
    .fetchPosts()
    .then(response => {
      const numb = newsApiService.multiplyPages();
      if (response.totalHits <= numb) {
        loadMoreBtn.classList.add('is-hidden');
      }

      newsApiService.incrementPage();
      createGalleryCards(response.hits);
    })
    .catch(err => {
      Notify.failure(`❌${err.message}❌`);
    });

  //   loadMoreBtn.disable();
  //   newsApiService.fetchArticles().then(articles => {
  //     appendArticlesMarkup(articles);
  //     loadMoreBtn.enable();
}

function createGalleryCards(images) {
  const markup = images
    .map(hits => {
      return `<div class="photo-card">
  <img src="${hits.webformatURL}" alt="${hits.tags}" loading="lazy" width="360" height="240" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${hits.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${hits.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${hits.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${hits.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  listCardsEl.insertAdjacentHTML('beforeend', markup);
}

function clearGalleryContainer() {
  listCardsEl.innerHTML = '';
}
