const formatDecimal = (value, blur) => {
  if (value === '' || value === null) {
    value = '0';
  } else {
    value = value.toString().replaceAll(',', '');
    value = value.replace(/\.+/g, '.');
    const arrayValue = value.split('.');
    const rightValue = arrayValue[1] ? `.${arrayValue[1]}` : '';
    value = `${parseFloat(arrayValue[0])}${rightValue}`;
  }
  let returnValue = '';
  if (value === '.' || value === '0.') {
    returnValue = '0.';
  } else {
    value = value === null || value.toString().trim() === '' || value.toString().trim() === '-' ? 0 : value;
    value = value.toString().replace(/[^0-9.-]/g, '');
    value = value.toString();
    if (value === null || value === '' || parseFloat(value) === 0) {
      returnValue = 0;
    } else {
      value = value.substring(0, 2) === '0.' ? value : value.replace(/^0+/, '');
      value = value.replace(/[^0-9.-]/g, '');
      value = parseFloat(value) < 0 ? (parseFloat(value) * -1) : value;
      const [val] = value.toString().match(/^-?\d+(?:\.\d{0,2})?/);
      value = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      returnValue = value;
    }
  }
  if (
    blur === true
    && returnValue !== ''
    && returnValue !== null
    && returnValue !== 0
    && returnValue.slice(-1) === '.'
  ) {
    returnValue += '00';
  }
  return returnValue;
};

export { formatDecimal };
