/* js/slideshow.js */

import { displayMedia, updateSlideshowIndicators } from './background.js';
import { showNotification } from './notifications.js';
import { addAction } from './undoRedo.js';

let slideshowInterval;
let currentMediaIndex = 0;
let mediaList = []; // Se debería sincronizar con background.js

// Función para iniciar el slideshow
export function startSlideshow() {
  if (mediaList.length === 0) {
    showNotification('No hay archivos para el slideshow.', 'warning');
    return;
  }

  if (slideshowInterval) return; // Evitar múltiples intervalos

  slideshowInterval = setInterval(() => {
    currentMediaIndex = (currentMediaIndex + 1) % mediaList.length;
    displayMedia(mediaList[currentMediaIndex]);
  }, 5000); // Cambia cada 5 segundos

  showNotification('Slideshow iniciado.', 'success');
  addAction({ type: 'startSlideshow' });
}

// Función para pausar el slideshow
export function pauseSlideshow() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    showNotification('Slideshow pausado.', 'info');
    addAction({ type: 'pauseSlideshow' });
  }
}
