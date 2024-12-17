/* js/background.js */

// Variables globales compartidas
let slideshowInterval;
let currentMediaIndex = 0;
let mediaList = [];

// Función para cambiar la imagen
export function changeImage() {
  document.getElementById('fileInput').click();
}

// Función para cambiar el video
export function changeVideo() {
  document.getElementById('fileInput').click();
}

// Maneja el cambio de archivo (imagen, video, GIF)
export function handleFileChange(event) {
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

// Funciones para cambiar el color de fondo
export function changeBackgroundColor(event) {
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

export function changeCustomBackgroundColor(event) {
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
