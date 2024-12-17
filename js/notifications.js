/* js/notifications.js */

// Función para mostrar notificaciones
export function showNotification(message, type = 'success') {
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
