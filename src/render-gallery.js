export { renderGallery };
function renderGallery(images) {
    const refs = {
        gallery: document.querySelector('.gallery'),
    }

  function generateMarkup({
    id,
    largeImageURL,
    webformatURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  }) {
    return `
      <a class="photo-card__link" href="${largeImageURL}">
        <div class="photo-card" id="${id}">
          <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item"><b>Likes</b> ${likes}</p>
            <p class="info-item"><b>Views</b> ${views}</p>
            <p class="info-item"><b>Comments</b> ${comments}</p>
            <p class="info-item"><b>Downloads</b> ${downloads}</p>
          </div>
        </div>
      </a>
    `;
  }

  const markup = images.reduce((acc, image) => acc + generateMarkup(image), '');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
