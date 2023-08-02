export function smoothScrolling(rateOfScroll) {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * rateOfScroll,
    behavior: 'smooth',
  });
}
