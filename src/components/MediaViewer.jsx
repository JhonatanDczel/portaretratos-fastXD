// src/components/MediaViewer.jsx
import React from 'react';
import { useAppContext } from '../context/AppContext';
import SlideshowIndicators from './SlideshowIndicators';

const MediaViewer = () => {
  const { currentMedia, overlayText, textColor, textPosition, filter, backgroundColor } = useAppContext();

  return (
    <div
      id="backgroundContainer"
      className="flex-grow h-screen bg-gray-300 rounded-lg overflow-hidden flex justify-center items-center transition-colors duration-500 relative"
      style={{ backgroundColor: backgroundColor || '' }}
      aria-label="Contenedor de Fondo"
    >
      {/* Mostrar Media */}
      {currentMedia && currentMedia.type.startsWith('image/') && (
        <img src={currentMedia.url} alt="Imagen cargada" className="max-w-full max-h-full object-contain" />
      )}
      {currentMedia && currentMedia.type.startsWith('video/') && (
        <video src={currentMedia.url} controls className="max-w-full max-h-full object-contain" />
      )}

      {/* Texto Superpuesto */}
      {overlayText && (
        <div
          className="absolute text-xl font-bold"
          style={{
            color: textColor,
            ...getPositionStyles(textPosition),
            filter: filter !== 'none' ? filterMap(filter) : 'none',
          }}
        >
          {overlayText}
        </div>
      )}

      {/* Indicadores de Slideshow */}
      <SlideshowIndicators />
    </div>
  );
};

// Funciones auxiliares para posicionar y mapear filtros
const getPositionStyles = (position) => {
  switch (position) {
    case 'top-left':
      return { top: '10px', left: '10px' };
    case 'top-center':
      return { top: '10px', left: '50%', transform: 'translateX(-50%)' };
    case 'top-right':
      return { top: '10px', right: '10px' };
    case 'center-left':
      return { top: '50%', left: '10px', transform: 'translateY(-50%)' };
    case 'center':
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    case 'center-right':
      return { top: '50%', right: '10px', transform: 'translateY(-50%)' };
    case 'bottom-left':
      return { bottom: '10px', left: '10px' };
    case 'bottom-center':
      return { bottom: '10px', left: '50%', transform: 'translateX(-50%)' };
    case 'bottom-right':
      return { bottom: '10px', right: '10px' };
    default:
      return { top: '10px', left: '10px' };
  }
};

const filterMap = (filter) => {
  switch (filter) {
    case 'grayscale':
      return 'grayscale(100%)';
    case 'sepia':
      return 'sepia(100%)';
    case 'blur':
      return 'blur(5px)';
    case 'brightness':
      return 'brightness(150%)';
    default:
      return 'none';
  }
};

export default MediaViewer;
