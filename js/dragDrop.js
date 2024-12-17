/* js/dragDrop.js */

import { displayMedia, generateSlideshowIndicators } from './background.js';
import { showNotification } from './notifications.js';

export function setupDragAndDrop() {
  const dragDropArea = document.getElementById('dragDropArea');

  dragDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragDropArea.classList.add('drag-over');
  });

  dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.classList.remove('drag-over');
  });

  dragDropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dragDropArea.classList.remove('drag-over');

    const files = event.dataTransfer.files;
    if (files.length) {
      const mediaList = Array.from(files);
      // Asumiendo que tienes una función global para manejar la carga
      // Aquí deberías importar y usar funciones de background.js
      mediaList.forEach(file => displayMedia(file));
      generateSlideshowIndicators();
      showNotification('Archivos cargados mediante arrastrar y soltar.', 'success');
    }
  });
}
