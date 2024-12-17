/* js/volumeControl.js */

import { showNotification } from './notifications.js';
import { addAction } from './undoRedo.js';

// Función para ajustar el volumen de videos
export function adjustVolume(event) {
  const volume = event.target.value;
  const video = document.querySelector('#backgroundContainer video');

  if (video) {
    video.volume = volume;
    addAction({ type: 'adjustVolume', payload: { volume } });
    showNotification('Volumen ajustado.', 'success');
  } else {
    showNotification('No hay video para ajustar el volumen.', 'warning');
  }
}
