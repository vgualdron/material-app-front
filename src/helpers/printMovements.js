const printMovements = (data, fileName) => {
  let stringToPrint = '';
  data.forEach((element) => {
    const arrayValues = Object.values(element);
    const stringValues = `${arrayValues.join(';')}\n`;
    stringToPrint += stringValues;
  });
  const element = document.createElement('a');
  element.setAttribute('href', `data:application/json;charset=utf-8, ${encodeURIComponent(stringToPrint)}`);
  element.setAttribute('download', `${fileName}.txt`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export {
  printMovements,
};
