/* script.js */

// Variables globales
let slideshowInterval;
let currentMediaIndex = 0;
let mediaList = [];
const actionHistory = [];
const redoStack = [];

// Función para cambiar la imagen
function changeImage() {
  document.getElementById('fileInput').click();
}

// Función para cambiar el video
function changeVideo() {
  document.getElementById('fileInput').click();
}

// Maneja el cambio de archivo (imagen, video, GIF)
function handleFileChange(event) {
  const files = event.target.files;
  if (!files.length) return;

  mediaList = Array.from(files);
  currentMediaIndex = 0;
  displayMedia(mediaList[currentMediaIndex]);
  generateSlideshowIndicators();
  showNotification('Archivos cargados correctamente.', 'success');
}

// Función para mostrar la media actual
function displayMedia(file) {
  const backgroundContainer = document.getElementById('backgroundContainer');

  // Añadir clase de transición
  backgroundContainer.classList.add('transition-fade', 'hidden-opacity');

  setTimeout(() => {
    backgroundContainer.innerHTML = ''; // Limpiar contenido previo
    removeFilters();

    // Remover cualquier clase de color de fondo personalizada
    backgroundContainer.style.backgroundColor = '';

    // Obtener clases de Tailwind para el color de fondo
    const tailwindColors = [
      'bg-pink-100',
      'bg-blue-100',
      'bg-green-100',
      'bg-yellow-100',
      'bg-purple-100',
      'bg-teal-100',
      'bg-orange-100',
      'bg-indigo-100',
      'bg-gray-300',
    ];
    tailwindColors.forEach(cls => backgroundContainer.classList.remove(cls));

    const fileURL = URL.createObjectURL(file);

    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = fileURL;
      img.className = 'max-w-full max-h-full object-contain';
      img.alt = 'Imagen cargada';
      backgroundContainer.appendChild(img);
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = fileURL;
      video.controls = true;
      video.className = 'max-w-full max-h-full object-contain';
      video.alt = 'Video cargado';
      backgroundContainer.appendChild(video);
    }

    // Remover clase 'hidden-opacity' y añadir 'visible-opacity' para mostrar con transición
    backgroundContainer.classList.remove('hidden-opacity');
    backgroundContainer.classList.add('visible-opacity');

    updateSlideshowIndicators();
  }, 500); // Duración de la transición
}

// Función para iniciar el slideshow
function startSlideshow() {
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
}

// Función para pausar el slideshow
function pauseSlideshow() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    showNotification('Slideshow pausado.', 'info');
  }
}

// Función para cambiar el color de fondo seleccionado
function changeBackgroundColor(event) {
  const colorClass = event.target.value;
  const backgroundContainer = document.getElementById('backgroundContainer');

  // Limpiar contenido previo (imagen o video)
  backgroundContainer.innerHTML = '';
  removeFilters();

  // Remover cualquier clase de color de fondo existente
  const colorClasses = [
    'bg-pink-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-teal-100',
    'bg-orange-100',
    'bg-indigo-100',
    'bg-gray-300',
  ];

  colorClasses.forEach(cls => backgroundContainer.classList.remove(cls));
  backgroundContainer.style.backgroundColor = ''; // Remover color personalizado si existe

  // Si se selecciona un color, agregar la nueva clase
  if (colorClass) {
    backgroundContainer.classList.add(colorClass);
    showNotification('Color de fondo cambiado.', 'success');
    addAction({ type: 'changeBackgroundColor', payload: { colorClass } });
  } else {
    // Si no se selecciona ningún color, restablecer al color por defecto
    backgroundContainer.classList.add('bg-gray-300');
    showNotification('Color de fondo restablecido.', 'info');
    addAction({ type: 'changeBackgroundColor', payload: { colorClass: 'bg-gray-300' } });
  }
}

// Función para cambiar el color de fondo personalizado
function changeCustomBackgroundColor(event) {
  const color = event.target.value;
  const backgroundContainer = document.getElementById('backgroundContainer');

  // Limpiar contenido previo (imagen o video)
  backgroundContainer.innerHTML = '';
  removeFilters();

  // Remover cualquier clase de color de fondo existente
  const colorClasses = [
    'bg-pink-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-teal-100',
    'bg-orange-100',
    'bg-indigo-100',
    'bg-gray-300',
  ];

  colorClasses.forEach(cls => backgroundContainer.classList.remove(cls));
  backgroundContainer.style.backgroundColor = color; // Aplicar color personalizado

  showNotification('Color de fondo personalizado cambiado.', 'success');
  addAction({ type: 'changeBackgroundColor', payload: { colorClass: color } });
}

// Función para agregar texto superpuesto
function addOverlayText(actionPayload = null) {
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
function changeTextColor(event) {
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
function changeTextPosition(event) {
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

// Helper para establecer la posición del overlay
function setOverlayPosition(overlay, position) {
  // Reset estilos de posición
  overlay.style.top = '';
  overlay.style.left = '';
  overlay.style.right = '';
  overlay.style.bottom = '';
  overlay.style.transform = '';

  switch (position) {
    case 'top-left':
      overlay.style.top = '10px';
      overlay.style.left = '10px';
      break;
    case 'top-center':
      overlay.style.top = '10px';
      overlay.style.left = '50%';
      overlay.style.transform = 'translateX(-50%)';
      break;
    case 'top-right':
      overlay.style.top = '10px';
      overlay.style.right = '10px';
      break;
    case 'center-left':
      overlay.style.top = '50%';
      overlay.style.left = '10px';
      overlay.style.transform = 'translateY(-50%)';
      break;
    case 'center':
      overlay.style.top = '50%';
      overlay.style.left = '50%';
      overlay.style.transform = 'translate(-50%, -50%)';
      break;
    case 'center-right':
      overlay.style.top = '50%';
      overlay.style.right = '10px';
      overlay.style.transform = 'translateY(-50%)';
      break;
    case 'bottom-left':
      overlay.style.bottom = '10px';
      overlay.style.left = '10px';
      break;
    case 'bottom-center':
      overlay.style.bottom = '10px';
      overlay.style.left = '50%';
      overlay.style.transform = 'translateX(-50%)';
      break;
    case 'bottom-right':
      overlay.style.bottom = '10px';
      overlay.style.right = '10px';
      break;
    default:
      // Posición por defecto (top-left)
      overlay.style.top = '10px';
      overlay.style.left = '10px';
      break;
  }
}

// Función para aplicar filtros a la media
function applyFilter(event) {
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
function removeFilters() {
  const media = document.querySelector('#backgroundContainer img, #backgroundContainer video');
  if (media) {
    media.style.filter = 'none';
  }
}

// Función para ajustar el volumen de videos
function adjustVolume(event) {
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

// Función para alternar pantalla completa
function toggleFullScreen() {
  const backgroundContainer = document.getElementById('backgroundContainer');

  if (!document.fullscreenElement) {
    backgroundContainer.requestFullscreen().catch(err => {
      showNotification(`Error al entrar en pantalla completa: ${err.message}`, 'error');
    });
  } else {
    document.exitFullscreen();
  }
}

// Función para guardar configuración en localStorage
function saveConfiguration() {
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
function loadConfiguration() {
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
function applyFilterByValue(filter) {
  const media = document.querySelector('#backgroundContainer img, #backgroundContainer video');

  if (media) {
    switch (filter) {
      case 'grayscale(100%)':
        media.style.filter = 'grayscale(100%)';
        break;
      case 'sepia(100%)':
        media.style.filter = 'sepia(100%)';
        break;
      case 'blur(5px)':
        media.style.filter = 'blur(5px)';
        break;
      case 'brightness(150%)':
        media.style.filter = 'brightness(150%)';
        break;
      default:
        media.style.filter = 'none';
    }
  }
}

// Función para agregar texto superpuesto desde acción
function addOverlayTextFromAction(payload) {
  const { text, color, position } = payload;
  const backgroundContainer = document.getElementById('backgroundContainer');

  if (!text) return;

  // Crear elemento de texto
  const overlay = document.createElement('div');
  overlay.innerText = text;
  overlay.style.color = color;
  overlay.className = 'overlay text-xl font-bold';

  // Establecer posición
  setOverlayPosition(overlay, position);

  // Asegurarse de que el contenedor tenga posición relativa
  backgroundContainer.classList.add('relative');

  // Añadir el texto al contenedor
  backgroundContainer.appendChild(overlay);
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

// Función para generar indicadores de slideshow
function generateSlideshowIndicators() {
  const indicatorsContainer = document.getElementById('slideshowIndicators');
  indicatorsContainer.innerHTML = '';

  mediaList.forEach((media, index) => {
    const indicator = document.createElement('div');
    indicator.className = `w-3 h-3 mx-1 rounded-full cursor-pointer ${
      index === currentMediaIndex ? 'bg-blue-500' : 'bg-gray-300'
    }`;
    indicator.onclick = () => {
      currentMediaIndex = index;
      displayMedia(media);
      pauseSlideshow();
    };
    indicatorsContainer.appendChild(indicator);
  });
}

// Función para actualizar indicadores de slideshow
function updateSlideshowIndicators() {
  const indicators = document.querySelectorAll('#slideshowIndicators div');
  indicators.forEach((indicator, index) => {
    if (index === currentMediaIndex) {
      indicator.classList.remove('bg-gray-300');
      indicator.classList.add('bg-blue-500');
    } else {
      indicator.classList.remove('bg-blue-500');
      indicator.classList.add('bg-gray-300');
    }
  });
}

// Función para iniciar drag and drop
function setupDragAndDrop() {
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
      mediaList = Array.from(files);
      currentMediaIndex = 0;
      displayMedia(mediaList[currentMediaIndex]);
      generateSlideshowIndicators();
      showNotification('Archivos cargados mediante arrastrar y soltar.', 'success');
    }
  });
}

// Función para resaltar la media activa
// Ya está implementado en updateSlideshowIndicators()

// Función para guardar acciones en el historial
function addAction(action) {
  actionHistory.push(action);
  // Limpiar la pila de rehacer cuando se realiza una nueva acción
  redoStack.length = 0;
}

// Función para deshacer la última acción
function undoAction() {
  const lastAction = actionHistory.pop();
  if (lastAction) {
    redoStack.push(lastAction);
    performUndo(lastAction);
  } else {
    showNotification('No hay acciones para deshacer.', 'warning');
  }
}

// Función para rehacer la última acción deshecha
function redoAction() {
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
      // No se implementa en este ejemplo para simplificar
      // Podrías almacenar el historial de colores y revertir al anterior
      break;
    case 'applyFilter':
      const media = document.querySelector('#backgroundContainer img, #backgroundContainer video');
      if (media) {
        media.style.filter = 'none';
      }
      showNotification('Filtro deshecho.', 'info');
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
      addOverlayText(action.payload);
      break;
    case 'changeBackgroundColor':
      if (action.payload.colorClass.startsWith('#')) {
        document.getElementById('backgroundContainer').style.backgroundColor = action.payload.colorClass;
      } else {
        document.getElementById('backgroundContainer').classList.add(action.payload.colorClass);
      }
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

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.innerText = message;

  // Cambiar el color según el tipo
  switch (type) {
    case 'success':
      notification.classList.remove('bg-red-500', 'bg-yellow-500', 'bg-blue-500');
      notification.classList.add('bg-green-500');
      break;
    case 'error':
      notification.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-blue-500');
      notification.classList.add('bg-red-500');
      break;
    case 'warning':
      notification.classList.remove('bg-green-500', 'bg-red-500', 'bg-blue-500');
      notification.classList.add('bg-yellow-500');
      break;
    case 'info':
      notification.classList.remove('bg-green-500', 'bg-red-500', 'bg-yellow-500');
      notification.classList.add('bg-blue-500');
      break;
    default:
      notification.classList.remove('bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500');
      notification.classList.add('bg-gray-500');
      break;
  }

  notification.classList.remove('hidden');
  
  // Ocultar la notificación después de 3 segundos
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

// Función para guardar y cargar configuraciones
// Ya implementadas anteriormente

// Inicializar drag and drop
window.onload = () => {
  setupDragAndDrop();
};
