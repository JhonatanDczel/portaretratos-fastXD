// src/components/ControlPanel.jsx
import React, { useRef } from 'react';
import {
  PhotographIcon,
  VideoCameraIcon,
  PlayIcon,
  PauseIcon,
  PlusIcon,
  SaveIcon,
  DownloadIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XCircleIcon,
} from '@heroicons/react/outline';
import { useAppContext } from '../context/AppContext';

const ControlPanel = () => {
  const fileInputRef = useRef(null);
  const {
    handleFileChange,
    startSlideshow,
    pauseSlideshow,
    changeBackgroundColor,
    changeCustomBackgroundColor,
    addOverlayText,
    changeTextColor,
    changeTextPosition,
    applyFilter,
    adjustVolume,
    toggleFullScreen,
    saveConfiguration,
    loadConfiguration,
    undoAction,
    redoAction,
  } = useAppContext();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80 mr-4">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <PlusIcon className="h-6 w-6 mr-2 text-indigo-500" />
        Controlador de Portaretratos
      </h3>

      {/* Botones de Carga de Archivos */}
      <button
        onClick={() => fileInputRef.current.click()}
        className="w-full py-2 mb-3 bg-[#0B1A33] text-white rounded-md hover:bg-[#1f2a44] transition-colors flex items-center justify-center"
        aria-label="Cargar Imagen o Video"
      >
        <PhotographIcon className="h-5 w-5 mr-2" />
        Cargar Imagen o Video
      </button>

      {/* Controles de Slideshow */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Slideshow</h4>
        <button
          onClick={startSlideshow}
          className="w-full py-2 mb-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
          aria-label="Iniciar Slideshow"
        >
          <PlayIcon className="h-5 w-5 mr-2" />
          Iniciar Slideshow
        </button>
        <button
          onClick={pauseSlideshow}
          className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
          aria-label="Pausar Slideshow"
        >
          <PauseIcon className="h-5 w-5 mr-2" />
          Pausar Slideshow
        </button>
      </div>

      {/* Selector de Color de Fondo */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Fondo de Color</h4>
        <select
          onChange={changeBackgroundColor}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          aria-label="Seleccionar Color de Fondo"
        >
          <option value="">Selecciona un color</option>
          <option value="bg-pink-100">Rosa Pastel</option>
          <option value="bg-blue-100">Azul Pastel</option>
          <option value="bg-green-100">Verde Pastel</option>
          <option value="bg-yellow-100">Amarillo Pastel</option>
          <option value="bg-purple-100">Púrpura Pastel</option>
          <option value="bg-teal-100">Verde Azulado Pastel</option>
          <option value="bg-orange-100">Naranja Pastel</option>
          <option value="bg-indigo-100">Índigo Pastel</option>
        </select>

        <h4 className="text-lg font-semibold mb-2">Fondo de Color Personalizado</h4>
        <input
          type="color"
          onChange={changeCustomBackgroundColor}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          aria-label="Seleccionar Color Personalizado"
        />
      </div>

      {/* Agregar Texto Superpuesto */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Texto Superpuesto</h4>
        <input
          type="text"
          placeholder="Ingrese el texto"
          value={overlayText}
          onChange={(e) => setOverlayText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          aria-label="Ingresar Texto Superpuesto"
        />
        <input
          type="color"
          onChange={changeTextColor}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          aria-label="Seleccionar Color de Texto"
        />
        <button
          onClick={addOverlayText}
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
          aria-label="Añadir Texto Superpuesto"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Añadir Texto
        </button>

        {/* Selector de Posición del Texto */}
        <h4 className="text-lg font-semibold mt-4 mb-2">Posición del Texto</h4>
        <select
          onChange={changeTextPosition}
          className="w-full p-2 border border-gray-300 rounded-md"
          aria-label="Seleccionar Posición del Texto"
        >
          <option value="top-left">Arriba Izquierda</option>
          <option value="top-center">Arriba Centro</option>
          <option value="top-right">Arriba Derecha</option>
          <option value="center-left">Centro Izquierda</option>
          <option value="center">Centro</option>
          <option value="center-right">Centro Derecha</option>
          <option value="bottom-left">Abajo Izquierda</option>
          <option value="bottom-center">Abajo Centro</option>
          <option value="bottom-right">Abajo Derecha</option>
        </select>
      </div>

      {/* Filtros de Imagen/Video */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Filtros de Imagen/Video</h4>
        <select
          onChange={applyFilter}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          aria-label="Seleccionar Filtro"
        >
          <option value="none">Ninguno</option>
          <option value="grayscale">Blanco y Negro</option>
          <option value="sepia">Sepia</option>
          <option value="blur">Desenfoque</option>
          <option value="brightness">Brillo</option>
        </select>
      </div>

      {/* Control de Volumen */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Control de Volumen</h4>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          onChange={adjustVolume}
          value={volume}
          className="w-full"
          aria-label="Control de Volumen"
        />
      </div>

      {/* Modo Pantalla Completa */}
      <div className="mb-4">
        <button
          onClick={toggleFullScreen}
          className="w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center justify-center"
          aria-label="Activar Pantalla Completa"
        >
          <PhotographIcon className="h-5 w-5 mr-2" />
          Pantalla Completa
        </button>
      </div>

      {/* Guardar y Cargar Configuración */}
      <div className="mb-4">
        <button
          onClick={saveConfiguration}
          className="w-full py-2 mb-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center"
          aria-label="Guardar Configuración"
        >
          <SaveIcon className="h-5 w-5 mr-2" />
          Guardar Configuración
        </button>
        <button
          onClick={loadConfiguration}
          className="w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center"
          aria-label="Cargar Configuración"
        >
          <DownloadIcon className="h-5 w-5 mr-2" />
          Cargar Configuración
        </button>
      </div>

      {/* Controles de Deshacer/Rehacer */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Historial de Cambios</h4>
        <button
          onClick={undoAction}
          className="w-full py-2 mb-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center justify-center"
          aria-label="Deshacer Acción"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Deshacer
        </button>
        <button
          onClick={redoAction}
          className="w-full py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center justify-center"
          aria-label="Rehacer Acción"
        >
          <ArrowRightIcon className="h-5 w-5 mr-2" />
          Rehacer
        </button>
      </div>

      {/* Área de Arrastrar y Soltar Archivos */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Arrastrar y Soltar Archivos</h4>
        <div
          id="dragDropArea"
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-500 hover:border-blue-500 transition-colors"
          aria-label="Área de Arrastrar y Soltar Archivos"
        >
          Arrastra y suelta tus archivos aquí
        </div>
      </div>

      {/* Indicadores de Slideshow */}
      <SlideshowIndicators />

      {/* Input de Archivo (oculto) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*"
        multiple
        aria-label="Seleccionar Archivos"
      />
    </div>
  );
};

export default ControlPanel;
