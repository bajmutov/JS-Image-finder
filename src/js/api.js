import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '38604486-c97a7af17c6668551d7e0c5c6';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPageImg = 20;
    this.typeImage = 'photo';
    this.orientationImg = 'horizontal';
    this.safeSearchAge = true;
  }

  multiplyPages() {
    return this.page * this.perPageImg;
  }

  async fetchPosts() {
    // console.log(this);
    const searchParams = new URLSearchParams({
      key: this.#API_KEY,
      q: this.searchQuery,
      image_type: this.typeImage,
      orientation: this.orientationImg,
      safesearch: this.safeSearchAge,
      page: this.page,
      per_page: this.perPageImg,
    });

    const response = await axios
      .get(`${this.#BASE_URL}?${searchParams}`)
      .then(({ data }) => {
        console.log(data);
        // this.incrementPage();
        return data;
      });

    return response;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
