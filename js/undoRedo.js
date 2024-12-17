/* js/undoRedo.js */

import { showNotification } from './notifications.js';
import { addOverlayTextFromAction } from './overlay.js';
import { changeBackgroundColor } from './background.js';
import { applyFilterByValue } from './filters.js';
import { loadConfiguration } from './configuration.js';

// Pilas para historial de acciones y rehacer
const actionHistory = [];
const redoStack = [];

// Función para agregar acciones al historial
export function addAction(action) {
  actionHistory.push(action);
  // Limpiar la pila de rehacer cuando se realiza una nueva acción
  redoStack.length = 0;
}

// Función para deshacer la última acción
export function undoAction() {
  const lastAction = actionHistory.pop();
  if (lastAction) {
    redoStack.push(lastAction);
    performUndo(lastAction);
  } else {
    showNotification('No hay acciones para deshacer.', 'warning');
  }
}

// Función para rehacer la última acción deshecha
export function redoAction() {
  const action = redoStack.pop();
  if (action) {
    actionHistory.push(action);
    performRedo(action);
  } else {
    showNotification('No hay acciones para rehacer.', 'warning');
  }
}

// Función para realizar el deshacer según el tipo de acción
function performUndo(action) {
  switch (action.type) {
    case 'addText':
      const overlays = document.querySelectorAll('#backgroundContainer .overlay');
      if (overlays.length > 0) {
        const lastOverlay = overlays[overlays.length - 1];
        lastOverlay.remove();
        showNotification('Texto superpuesto deshecho.', 'info');
      }
      break;
    case 'changeBackgroundColor':
      // Implementar lógica para revertir el cambio de color
      // Esto requiere almacenar el historial de colores
      showNotification('Deshacer cambio de color no implementado.', 'warning');
      break;
    case 'applyFilter':
      const media = document.querySelector('#backgroundContainer img, #backgroundContainer video');
      if (media) {
        media.style.filter = 'none';
        showNotification('Filtro deshecho.', 'info');
      }
      break;
    case 'adjustVolume':
      const video = document.querySelector('#backgroundContainer video');
      if (video) {
        video.volume = 1; // Valor por defecto
        document.getElementById('volumeControl').value = 1;
        showNotification('Volumen deshecho.', 'info');
      }
      break;
    case 'saveConfiguration':
      // No se implementa en este ejemplo
      break;
    case 'loadConfiguration':
      // No se implementa en este ejemplo
      break;
    default:
      break;
  }
}

// Función para realizar la rehacer según el tipo de acción
function performRedo(action) {
  switch (action.type) {
    case 'addText':
      addOverlayTextFromAction(action.payload);
      break;
    case 'changeBackgroundColor':
      if (action.payload.colorClass.startsWith('#')) {
        document.getElementById('backgroundContainer').style.backgroundColor = action.payload.colorClass;
      } else {
        document.getElementById('backgroundContainer').classList.add(action.payload.colorClass);
      }
      showNotification('Cambio de color rehecho.', 'info');
      break;
    case 'applyFilter':
      applyFilterByValue(action.payload.filter);
      break;
    case 'adjustVolume':
      const video = document.querySelector('#backgroundContainer video');
      if (video) {
        video.volume = action.payload.volume;
        document.getElementById('volumeControl').value = action.payload.volume;
        showNotification('Volumen rehecho.', 'info');
      }
      break;
    case 'saveConfiguration':
      // No se implementa en este ejemplo
      break;
    case 'loadConfiguration':
      loadConfiguration();
      break;
    default:
      break;
  }
}
