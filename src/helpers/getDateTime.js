const getDateTime = () => {
  const stringFullDate = (new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', hour12: false }).format(new Date())).replace(',', '');
  const arrayFullDate = stringFullDate.split(' ');
  let arrayDate = arrayFullDate[0].split('/');
  let arrayTime = arrayFullDate[1].split(':');
  arrayDate = arrayDate.map((x) => x.padStart(2, '0'));
  arrayTime = arrayTime.map((x) => x.padStart(2, '0'));
  const date = `${arrayDate[0]}/${arrayDate[1]}/${arrayDate[2]}`;
  const time = `${arrayTime[0]}:${arrayTime[1]}`;
  return ({
    date,
    time,
  });
};

export { getDateTime };
