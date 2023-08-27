import exportFromJSON from 'export-from-json';

const printReport = (data, fileName) => {
  const exportType = exportFromJSON.types.xls;
  exportFromJSON({ data, fileName, exportType });
};

export {
  printReport,
};
