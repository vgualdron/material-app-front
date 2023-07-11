import { date } from 'quasar';

const formatDateToSave = (dateToFormat) => {
  const dateFixed = dateToFormat.split('/');
  dateFixed[0] = dateFixed[0].padStart(2, '0');
  dateFixed[1] = dateFixed[1].padStart(2, '0');
  dateFixed[2] = dateFixed[2].padStart(4, '0');
  dateToFormat = `${dateFixed[0]}/${dateFixed[1]}/${dateFixed[2]}`;
  const formated = date.extractDate(dateToFormat, 'DD/MM/YYYY');
  return formated.toISOString().split('T')[0];
};

export { formatDateToSave };
