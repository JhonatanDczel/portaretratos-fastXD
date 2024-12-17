/* js/overlay.js */

import { setOverlayPosition } from './utils.js';
import { showNotification } from './notifications.js';
import { addAction } from './undoRedo.js';

// Función para agregar texto superpuesto
export function addOverlayText(actionPayload = null) {
  const text = actionPayload ? actionPayload.text : document.getElementById('overlayText').value;
  const color = actionPayload ? actionPayload.color : document.getElementById('textColorPicker').value;
  const backgroundContainer = document.getElementById('backgroundContainer');

  if (!text) {
    showNotification('No se ingresó texto para superponer.', 'warning');
    return;
  }

  // Crear elemento de texto
  const overlay = document.createElement('div');
  overlay.innerText = text;
  overlay.style.color = color;
  overlay.className = 'overlay text-xl font-bold';

  // Establecer posición inicial
  setOverlayPosition(overlay, 'top-left');

  // Asegurarse de que el contenedor tenga posición relativa
  backgroundContainer.classList.add('relative');

  // Añadir el texto al contenedor
  backgroundContainer.appendChild(overlay);

  // Añadir la acción al historial
  if (!actionPayload) {
    addAction({ type: 'addText', payload: { text, color, position: 'top-left' } });
    showNotification('Texto superpuesto añadido.', 'success');
  }
}

// Función para cambiar el color del texto superpuesto
export function changeTextColor(event) {
  const color = event.target.value;
  const overlay = document.querySelector('#backgroundContainer .overlay');

  if (overlay) {
    overlay.style.color = color;
    addAction({ type: 'changeTextColor', payload: { color } });
    showNotification('Color de texto cambiado.', 'success');
  } else {
    showNotification('No hay texto superpuesto para cambiar el color.', 'warning');
  }
}

// Función para cambiar la posición del texto superpuesto
export function changeTextPosition(event) {
  const position = event.target.value;
  const overlay = document.querySelector('#backgroundContainer .overlay');

  if (overlay) {
    setOverlayPosition(overlay, position);
    addAction({ type: 'changeTextPosition', payload: { position } });
    showNotification('Posición del texto cambiada.', 'success');
  } else {
    showNotification('No hay texto superpuesto para cambiar la posición.', 'warning');
  }
}
