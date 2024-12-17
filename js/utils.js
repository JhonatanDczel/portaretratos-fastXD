/* js/utils.js */

// Función para establecer la posición del overlay
export function setOverlayPosition(overlay, position) {
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
