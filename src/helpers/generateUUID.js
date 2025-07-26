const md5 = require('md5');

const generateUUID = (oven, date) => {
  // Obtener el ID del usuario desde el localStorage
  const user = localStorage.getItem('userMC');

  // Si no hay un usuario almacenado, retorna un valor falso o un UUID por defecto
  if (!user) {
    console.error('User not found in localStorage');
    return null;
  }

  // Aseguramos que 'date' esté en formato de fecha
  const dateTime = new Date(date);

  // Extraemos los componentes de la fecha
  const year = dateTime.getFullYear();
  const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Mes (1-12)
  const day = dateTime.getDate().toString().padStart(2, '0'); // Día (1-31)

  // Si 'oven' no está presente, usamos un valor vacío (puedes modificarlo si es necesario)
  oven = oven || '';
  // Concatenamos la cadena con el formato: user / fecha (m-d-Y) / oven
  const baseString = `${user}/${month}-${day}-${year}/${oven}`;

  // Generamos el hash MD5
  const value = md5(baseString);

  return value;
};

export { generateUUID };
