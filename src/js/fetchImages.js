import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '52711277-f6548e7cff1e8c2b9d8773286';

export function fetchImages(query) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  return axios.get(BASE_URL, { params }).then(response => response.data);
}