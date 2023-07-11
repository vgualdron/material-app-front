const md5 = require('md5');

const generateUUID = () => {
  const stringFullDate = (new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    fractionalSecondDigits: 3,
    hour12: false,
  }).format(new Date())).toString();
  const dateTime = stringFullDate.split(',');
  const date = dateTime[0].split('/');
  const time = dateTime[1].trim().split(':');
  const year = date[2];
  const month = date[1].padStart(2, '0');
  const day = date[0].padStart(2, '0');
  const hour = time[0].padStart(2, '0');
  const minute = time[1].padStart(2, '0');
  const second = time[2].padStart(2, '0');
  const millisecond = (dateTime[2]).padStart(3, '0');
  const user = localStorage.getItem('userMC');
  let value = false;
  if (user) {
    value = md5(`${user}/${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`);
  }
  return value;
};

export { generateUUID };
