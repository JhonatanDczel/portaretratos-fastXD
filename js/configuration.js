/* js/configuration.js */

import { showNotification } from './notifications.js';
import { addAction } from './undoRedo.js';
import { displayMedia } from './background.js';
import { applyFilterByValue } from './filters.js';
import { setOverlayPosition } from './utils.js';

// Función para guardar configuración en localStorage
export function saveConfiguration() {
  const backgroundColor = getComputedStyle(document.getElementById('backgroundContainer')).backgroundColor;
  const mediaElement = document.querySelector('#backgroundContainer img, #backgroundContainer video');
  const mediaSrc = mediaElement ? mediaElement.src : '';
  const overlay = document.querySelector('#backgroundContainer .overlay');
  const overlayText = overlay ? overlay.innerText : '';
  const textColor = overlay ? overlay.style.color : '#000000';
  const textPosition = overlay ? getOverlayPosition(overlay) : 'top-left';
  const filter = mediaElement ? mediaElement.style.filter || 'none' : 'none';
  const volume = mediaElement && mediaElement.tagName.toLowerCase() === 'video' ? mediaElement.volume : 1;

  const config = {
    backgroundColor,
    mediaSrc,
    overlayText,
    textColor,
    textPosition,
    filter,
    volume
  };

  localStorage.setItem('photoFrameConfig', JSON.stringify(config));
  showNotification('Configuración guardada correctamente.', 'success');
  addAction({ type: 'saveConfiguration', payload: config });
}

// Función para cargar configuración desde localStorage
export function loadConfiguration() {
  const config = JSON.parse(localStorage.getItem('photoFrameConfig'));
  if (!config) {
    showNotification('No hay configuraciones guardadas.', 'error');
    return;
  }

  const backgroundContainer = document.getElementById('backgroundContainer');
  backgroundContainer.innerHTML = ''; // Limpiar contenido previo
  removeFilters();

  // Aplicar color de fondo
  backgroundContainer.style.backgroundColor = config.backgroundColor;

  // Cargar media si existe
  if (config.mediaSrc) {
    const fileType = config.mediaSrc.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileType)) {
      const img = document.createElement('img');
      img.src = config.mediaSrc;
      img.className = 'max-w-full max-h-full object-contain';
      img.alt = 'Imagen cargada';
      backgroundContainer.appendChild(img);
    } else if (['mp4', 'webm', 'ogg'].includes(fileType)) {
      const video = document.createElement('video');
      video.src = config.mediaSrc;
      video.controls = true;
      video.className = 'max-w-full max-h-full object-contain';
      video.volume = config.volume;
      backgroundContainer.appendChild(video);
    }
  }

  // Añadir texto superpuesto si existe
  if (config.overlayText) {
    const overlay = document.createElement('div');
    overlay.innerText = config.overlayText;
    overlay.style.color = config.textColor;
    overlay.className = 'overlay text-xl font-bold';
    setOverlayPosition(overlay, config.textPosition);
    backgroundContainer.classList.add('relative');
    backgroundContainer.appendChild(overlay);
  }

  // Aplicar filtro si existe
  if (config.filter && config.filter !== 'none') {
    applyFilterByValue(config.filter);
  }

  // Ajustar volumen si es video
  if (config.volume && config.volume !== 1) {
    const video = document.querySelector('#backgroundContainer video');
    if (video) {
      video.volume = config.volume;
      document.getElementById('volumeControl').value = config.volume;
    }
  }

  showNotification('Configuración cargada correctamente.', 'success');
  addAction({ type: 'loadConfiguration', payload: config });
}

// Función para aplicar filtro por valor (usada en cargar configuración)
export function applyFilterByValue(filter) {
  const media = document.querySelector('#backgroundContainer img, #backgroundContainer video');

  if (media) {
    media.style.filter = filter;
  }
}

// Función para obtener la posición actual del overlay
function getOverlayPosition(overlay) {
  if (overlay.style.transform.includes('translate(-50%, -50%)')) {
    if (overlay.style.top === '50%' && overlay.style.left === '50%') {
      return 'center';
    }
  }
  if (overlay.style.top === '10px' && overlay.style.left === '10px') return 'top-left';
  if (overlay.style.top === '10px' && overlay.style.left === '50%') return 'top-center';
  if (overlay.style.top === '10px' && overlay.style.right === '10px') return 'top-right';
  if (overlay.style.top === '50%' && overlay.style.left === '10px') return 'center-left';
  if (overlay.style.top === '50%' && overlay.style.left === '50%') return 'center';
  if (overlay.style.top === '50%' && overlay.style.right === '10px') return 'center-right';
  if (overlay.style.bottom === '10px' && overlay.style.left === '10px') return 'bottom-left';
  if (overlay.style.bottom === '10px' && overlay.style.left === '50%') return 'bottom-center';
  if (overlay.style.bottom === '10px' && overlay.style.right === '10px') return 'bottom-right';
  return 'top-left'; // Valor por defecto
}
