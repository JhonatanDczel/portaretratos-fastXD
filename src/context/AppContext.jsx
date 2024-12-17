// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Estados
  const [mediaList, setMediaList] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [slideshowInterval, setSlideshowInterval] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [customBackgroundColor, setCustomBackgroundColor] = useState('');
  const [overlayText, setOverlayText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [textPosition, setTextPosition] = useState('top-left');
  const [filter, setFilter] = useState('none');
  const [volume, setVolume] = useState(1);
  const [notification, setNotification] = useState({ isVisible: false, message: '', type: 'success' });

  // Undo/Redo Stacks
  const [actionHistory, setActionHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Derived current media
  const currentMedia = mediaList[currentMediaIndex]
    ? { ...mediaList[currentMediaIndex], url: URL.createObjectURL(mediaList[currentMediaIndex]) }
    : null;

  // Funciones
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const newMediaList = Array.from(files);
    setMediaList(newMediaList);
    setCurrentMediaIndex(0);
    showNotification('Archivos cargados correctamente.', 'success');
    addAction({ type: 'loadMedia', payload: newMediaList });
  };

  const startSlideshow = () => {
    if (mediaList.length === 0) {
      showNotification('No hay archivos para el slideshow.', 'warning');
      return;
    }

    if (slideshowInterval) return; // Evitar múltiples intervalos

    const interval = setInterval(() => {
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % mediaList.length);
    }, 5000); // Cambia cada 5 segundos

    setSlideshowInterval(interval);
    showNotification('Slideshow iniciado.', 'success');
    addAction({ type: 'startSlideshow' });
  };

  const pauseSlideshow = () => {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      setSlideshowInterval(null);
      showNotification('Slideshow pausado.', 'info');
      addAction({ type: 'pauseSlideshow' });
    }
  };

  const changeBackgroundColor = (event) => {
    const colorClass = event.target.value;
    setBackgroundColor(colorClass);
    showNotification('Color de fondo cambiado.', 'success');
    addAction({ type: 'changeBackgroundColor', payload: { colorClass } });
  };

  const changeCustomBackgroundColor = (event) => {
    const color = event.target.value;
    setCustomBackgroundColor(color);
    showNotification('Color de fondo personalizado cambiado.', 'success');
    addAction({ type: 'changeCustomBackgroundColor', payload: { color } });
  };

  const addOverlayText = () => {
    if (!overlayText) {
      showNotification('No se ingresó texto para superponer.', 'warning');
      return;
    }
    addAction({ type: 'addText', payload: { text: overlayText, color: textColor, position: textPosition } });
    showNotification('Texto superpuesto añadido.', 'success');
  };

  const changeTextColor = (event) => {
    const color = event.target.value;
    setTextColor(color);
    showNotification('Color de texto cambiado.', 'success');
    addAction({ type: 'changeTextColor', payload: { color } });
  };

  const changeTextPosition = (event) => {
    const position = event.target.value;
    setTextPosition(position);
    showNotification('Posición del texto cambiada.', 'success');
    addAction({ type: 'changeTextPosition', payload: { position } });
  };

  const applyFilter = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    showNotification('Filtro aplicado.', 'success');
    addAction({ type: 'applyFilter', payload: { filter: selectedFilter } });
  };

  const adjustVolume = (event) => {
    const vol = parseFloat(event.target.value);
    setVolume(vol);
    showNotification('Volumen ajustado.', 'success');
    addAction({ type: 'adjustVolume', payload: { volume: vol } });
  };

  const toggleFullScreen = () => {
    const backgroundContainer = document.getElementById('backgroundContainer');

    if (!document.fullscreenElement) {
      backgroundContainer.requestFullscreen().catch((err) => {
        showNotification(`Error al entrar en pantalla completa: ${err.message}`, 'error');
      });
    } else {
      document.exitFullscreen();
    }
  };

  const saveConfiguration = () => {
    const config = {
      backgroundColor,
      customBackgroundColor,
      mediaSrc: currentMedia ? currentMedia.url : '',
      overlayText,
      textColor,
      textPosition,
      filter,
      volume,
    };
    localStorage.setItem('photoFrameConfig', JSON.stringify(config));
    showNotification('Configuración guardada correctamente.', 'success');
    addAction({ type: 'saveConfiguration', payload: config });
  };

  const loadConfiguration = () => {
    const config = JSON.parse(localStorage.getItem('photoFrameConfig'));
    if (!config) {
      showNotification('No hay configuraciones guardadas.', 'error');
      return;
    }

    setBackgroundColor(config.backgroundColor);
    setCustomBackgroundColor(config.customBackgroundColor);
    setFilter(config.filter);
    setVolume(config.volume);
    setOverlayText(config.overlayText);
    setTextColor(config.textColor);
    setTextPosition(config.textPosition);

    // Nota: Cargar media desde URL.createObjectURL no es directo. Se recomienda que el usuario vuelva a cargar el archivo.

    showNotification('Configuración cargada correctamente.', 'success');
    addAction({ type: 'loadConfiguration', payload: config });
  };

  const undoActionFunc = () => {
    if (actionHistory.length === 0) {
      showNotification('No hay acciones para deshacer.', 'warning');
      return;
    }
    const lastAction = actionHistory[actionHistory.length - 1];
    setActionHistory((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, lastAction]);

    // Realizar la acción de deshacer según el tipo de acción
    switch (lastAction.type) {
      case 'addText':
        setOverlayText('');
        showNotification('Texto superpuesto deshecho.', 'info');
        break;
      case 'changeBackgroundColor':
        setBackgroundColor('');
        showNotification('Color de fondo deshecho.', 'info');
        break;
      case 'changeCustomBackgroundColor':
        setCustomBackgroundColor('');
        showNotification('Color de fondo personalizado deshecho.', 'info');
        break;
      case 'applyFilter':
        setFilter('none');
        showNotification('Filtro deshecho.', 'info');
        break;
      case 'adjustVolume':
        setVolume(1);
        showNotification('Volumen deshecho.', 'info');
        break;
      case 'startSlideshow':
        pauseSlideshow();
        break;
      case 'pauseSlideshow':
        startSlideshow();
        break;
      case 'saveConfiguration':
        // No se implementa deshacer para guardar configuraciones
        break;
      case 'loadConfiguration':
        // Implementar deshacer para cargar configuraciones si es necesario
        break;
      default:
        break;
    }
  };

  const redoActionFunc = () => {
    if (redoStack.length === 0) {
      showNotification('No hay acciones para rehacer.', 'warning');
      return;
    }
    const action = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setActionHistory((prev) => [...prev, action]);

    // Realizar la acción de rehacer según el tipo de acción
    switch (action.type) {
      case 'addText':
        setOverlayText(action.payload.text);
        setTextColor(action.payload.color);
        setTextPosition(action.payload.position);
        showNotification('Texto superpuesto rehecho.', 'info');
        break;
      case 'changeBackgroundColor':
        setBackgroundColor(action.payload.colorClass);
        showNotification('Color de fondo rehecho.', 'info');
        break;
      case 'changeCustomBackgroundColor':
        setCustomBackgroundColor(action.payload.colorClass);
        showNotification('Color de fondo personalizado rehecho.', 'info');
        break;
      case 'applyFilter':
        setFilter(action.payload.filter);
        showNotification('Filtro rehecho.', 'info');
        break;
      case 'adjustVolume':
        setVolume(action.payload.volume);
        showNotification('Volumen rehecho.', 'info');
        break;
      case 'startSlideshow':
        startSlideshow();
        break;
      case 'pauseSlideshow':
        pauseSlideshow();
        break;
      case 'saveConfiguration':
        // No se implementa rehacer para guardar configuraciones
        break;
      case 'loadConfiguration':
        loadConfiguration();
        break;
      default:
        break;
    }
  };

  const addAction = (action) => {
    setActionHistory((prev) => [...prev, action]);
    setRedoStack([]); // Limpiar la pila de rehacer cuando se realiza una nueva acción
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ isVisible: true, message, type });

    // Ocultar después de 3 segundos
    setTimeout(() => {
      setNotification({ isVisible: false, message: '', type: 'success' });
    }, 3000);
  };

  const hideNotification = () => {
    setNotification({ isVisible: false, message: '', type: 'success' });
  };

  const setCurrentMedia = (index) => {
    setCurrentMediaIndex(index);
  };

  const setupDragAndDrop = useCallback(() => {
    const dragDropArea = document.getElementById('dragDropArea');

    const handleDragOver = (event) => {
      event.preventDefault();
      dragDropArea.classList.add('drag-over');
    };

    const handleDragLeave = () => {
      dragDropArea.classList.remove('drag-over');
    };

    const handleDrop = (event) => {
      event.preventDefault();
      dragDropArea.classList.remove('drag-over');

      const files = event.dataTransfer.files;
      if (files.length) {
        const newMediaList = Array.from(files);
        setMediaList(newMediaList);
        setCurrentMediaIndex(0);
        showNotification('Archivos cargados mediante arrastrar y soltar.', 'success');
        addAction({ type: 'loadMedia', payload: newMediaList });
      }
    };

    dragDropArea.addEventListener('dragover', handleDragOver);
    dragDropArea.addEventListener('dragleave', handleDragLeave);
    dragDropArea.addEventListener('drop', handleDrop);

    // Cleanup
    return () => {
      dragDropArea.removeEventListener('dragover', handleDragOver);
      dragDropArea.removeEventListener('dragleave', handleDragLeave);
      dragDropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  useEffect(() => {
    setupDragAndDrop();
  }, [setupDragAndDrop]);

  return (
    <AppContext.Provider
      value={{
        mediaList,
        currentMedia,
        currentMediaIndex,
        setCurrentMedia,
        handleFileChange,
        startSlideshow,
        pauseSlideshow,
        changeBackgroundColor,
        changeCustomBackgroundColor,
        overlayText,
        setOverlayText,
        addOverlayText,
        changeTextColor,
        changeTextPosition,
        textColor,
        textPosition,
        filter,
        applyFilter,
        volume,
        adjustVolume,
        toggleFullScreen,
        saveConfiguration,
        loadConfiguration,
        notification,
        hideNotification,
        showNotification,
        undoAction: undoActionFunc,
        redoAction: redoActionFunc,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
