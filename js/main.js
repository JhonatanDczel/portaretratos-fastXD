/* js/main.js */

import { changeImage, changeVideo, handleFileChange } from './background.js';
import { startSlideshow, pauseSlideshow } from './slideshow.js';
import { changeBackgroundColor, changeCustomBackgroundColor } from './background.js';
import { addOverlayText, changeTextColor, changeTextPosition } from './overlay.js';
import { applyFilter, removeFilters } from './filters.js';
import { adjustVolume } from './volumeControl.js';
import { toggleFullScreen } from './fullscreen.js';
import { saveConfiguration, loadConfiguration } from './configuration.js';
import { undoAction, redoAction } from './undoRedo.js';
import { setupDragAndDrop } from './dragDrop.js';
import { showNotification } from './notifications.js';

// Vincular funciones a eventos globales (ya están en el HTML)
window.changeImage = changeImage;
window.changeVideo = changeVideo;
window.handleFileChange = handleFileChange;
window.startSlideshow = startSlideshow;
window.pauseSlideshow = pauseSlideshow;
window.changeBackgroundColor = changeBackgroundColor;
window.changeCustomBackgroundColor = changeCustomBackgroundColor;
window.addOverlayText = addOverlayText;
window.changeTextColor = changeTextColor;
window.changeTextPosition = changeTextPosition;
window.applyFilter = applyFilter;
window.removeFilters = removeFilters;
window.adjustVolume = adjustVolume;
window.toggleFullScreen = toggleFullScreen;
window.saveConfiguration = saveConfiguration;
window.loadConfiguration = loadConfiguration;
window.undoAction = undoAction;
window.redoAction = redoAction;

// Inicializar funcionalidades adicionales
window.onload = () => {
  setupDragAndDrop();
};
