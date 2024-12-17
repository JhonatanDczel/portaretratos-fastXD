/* js/fullscreen.js */

import { showNotification } from './notifications.js';

// Función para alternar pantalla completa
export function toggleFullScreen() {
  const backgroundContainer = document.getElementById('backgroundContainer');

  if (!document.fullscreenElement) {
    backgroundContainer.requestFullscreen().catch(err => {
      showNotification(`Error al entrar en pantalla completa: ${err.message}`, 'error');
    });
  } else {
    document.exitFullscreen();
  }
}
