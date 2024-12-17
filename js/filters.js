/* js/filters.js */

import { showNotification } from './notifications.js';
import { addAction } from './undoRedo.js';

// Función para aplicar filtros a la media
export function applyFilter(event) {
  const filter = event.target.value;
  const media = document.querySelector('#backgroundContainer img, #backgroundContainer video');

  if (media) {
    switch (filter) {
      case 'grayscale':
        media.style.filter = 'grayscale(100%)';
        break;
      case 'sepia':
        media.style.filter = 'sepia(100%)';
        break;
      case 'blur':
        media.style.filter = 'blur(5px)';
        break;
      case 'brightness':
        media.style.filter = 'brightness(150%)';
        break;
      default:
        media.style.filter = 'none';
    }
    addAction({ type: 'applyFilter', payload: { filter } });
    showNotification('Filtro aplicado.', 'success');
  } else {
    showNotification('No hay media para aplicar el filtro.', 'warning');
  }
}

// Función para remover filtros
export function removeFilters() {
  const media = document.querySelector('#backgroundContainer img, #backgroundContainer video');
  if (media) {
    media.style.filter = 'none';
  }
}
