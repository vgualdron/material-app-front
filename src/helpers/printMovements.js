import exportFromJSON from 'export-from-json';

/* const printMovements = (data, fileName) => exportFromJSON({
  data: [{ foo: 'foo1', bar: 'bar1' }, { foo: 'foo2', bar: 'bar2' }],
  fileName,
  extension: exportFromJSON.types.xls,
}); */
const printMovements = (data, fileName) => {
  // const data = [{ foo: 'foo1', bar: 'bar1' }, { foo: 'foo2', bar: 'bar2' }];
  // const fileName = 'download';
  const exportType = exportFromJSON.types.xls;
  exportFromJSON({ data, fileName, exportType });
};

export {
  printMovements,
};
