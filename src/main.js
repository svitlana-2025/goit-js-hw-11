import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.form');
const searchInput = searchForm.elements['search-text'];

searchForm.addEventListener('submit', async event => {
  event.preventDefault(); // Запобігаємо стандартній відправці форми

  const query = searchInput.value.trim(); // Отримуємо пошуковий запит та видаляємо зайві пробіли

  // Перевірка на порожній рядок
  if (query === '') {
    iziToast.error({
      title: 'Error',
      message: 'Search field cannot be empty!',
      position: 'topRight',
    });
    return; // Припиняємо виконання, якщо поле порожнє
  }

  clearGallery(); // Очищаємо галерею перед новим пошуком
  showLoader(); // Показуємо лоадер

  try {
    const data = await getImagesByQuery(query);

    if (data.hits.length === 0) {
      // Якщо бекенд повернув порожній масив
      iziToast.info({
        // title: 'Info',
        message:
          '❌ Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        icon: false,
        close: false,
        backgroundColor: '#ef4040', // Червоний фон
        maxWidth: '432px', // Задана ширина
        minHeight: '88px', // Мінімальна висота для наближення до 88px
        html: true, // Включаємо підтримку HTML у повідомленні
      });
    } else {
      // Якщо знайдені зображення
      createGallery(data.hits);
    }
  } catch (error) {
    // Обробка помилок HTTP-запиту
    iziToast.error({
      title: 'Error',
      message:
        error.message ||
        'An error occurred while fetching images. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader(); // Приховуємо лоадер незалежно від результату
    searchForm.reset(); // Очищаємо форму після пошуку
  }
});