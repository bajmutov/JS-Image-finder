import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabayAPI } from './js/api';
import { smoothScrolling } from './js/smoothScroll';
import LoadMoreBtn from './js/load-more-btn';

const searchForm = document.querySelector('.search-form');
const listCardsEl = document.querySelector('.gallery');

const newsApiService = new PixabayAPI();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});
const searchFormButton = new LoadMoreBtn({
  selector: '[data-action="search"]',
  hidden: false,
});

searchForm.addEventListener('submit', handleSearchArticles);
loadMoreBtn.refs.button.addEventListener('click', searchMoreArticles);

function handleSearchArticles(event) {
  event.preventDefault();
  newsApiService.query = event.currentTarget.elements.searchQuery.value;
  loadMoreBtn.hide();
  newsApiService.resetPage();
  clearGalleryContainer();

  const searchInInputImg = newsApiService.query.trim();
  if (!searchInInputImg) {
    return Notify.failure(`❌Еnter a word to search for❌`);
  }
  searchFormButton.disable();
  // loadMoreBtn.show();
  loadMoreBtn.disable();

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
      smoothScrolling(0.3);
      loadMoreBtn.show();
      loadMoreBtn.enableLoadMore();
      searchFormButton.enableSearch();
      checkTotalImages(response);
    })
    .catch(err => {
      Notify.failure(`❌${err.message}❌`);
    });
}

function searchMoreArticles() {
  loadMoreBtn.disable();
  newsApiService.fetchPosts().then(response => {
    loadMoreBtn.enableLoadMore();

    checkTotalImages(response);
    newsApiService.incrementPage();
    createGalleryCards(response.hits);
    smoothScrolling(2.7);
  });
}

function createGalleryCards(images) {
  const markup = images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
      <a class="gallery__link" href="${largeImageURL}">
  <img  class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="360" height="240" />
   </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  listCardsEl.insertAdjacentHTML('beforeend', markup);

  createSimpleLightboxImage();
}

function clearGalleryContainer() {
  listCardsEl.innerHTML = '';
}

function checkTotalImages(obj) {
  const numb = newsApiService.multiplyPages();
  if (obj.totalHits <= numb) loadMoreBtn.refs.button.classList.add('is-hidden');
}

function createSimpleLightboxImage() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  // lightbox.refresh(); ???? навіщо цей метод???
}
