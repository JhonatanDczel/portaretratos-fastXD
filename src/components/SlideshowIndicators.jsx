// src/components/SlideshowIndicators.jsx
import React from 'react';
import { useAppContext } from '../context/AppContext';

const SlideshowIndicators = () => {
  const { mediaList, currentMediaIndex, setCurrentMedia } = useAppContext();

  if (mediaList.length === 0) return null;

  return (
    <div className="flex justify-center mt-4">
      {mediaList.map((media, index) => (
        <div
          key={index}
          className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${
            index === currentMediaIndex ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onClick={() => setCurrentMedia(index)}
          aria-label={`Indicador para media ${index + 1}`}
        ></div>
      ))}
    </div>
  );
};

export default SlideshowIndicators;
