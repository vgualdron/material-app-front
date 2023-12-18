import { http } from '../../helpers/http';
import { printMovements, printSQLDelete } from '../../helpers/printMovements';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/movement/list`,
    method: 'GET',
    data,
  }),
  print: (id) => http({
    url: `${process.env.URL_API}/api/movement/print/${id}`,
    method: 'GET',
  }),
  getTickets: (data) => http({
    url: `${process.env.URL_API}/api/movement/getTickets/${data.startDate}/${data.finalDate}`,
    method: 'GET',
  }),
  generate: (data) => http({
    url: `${process.env.URL_API}/api/movement/create/${data.startDate}/${data.finalDate}/${data.tickets}`,
    method: 'GET',
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/movement/delete/${id}`,
    method: 'DELETE',
  }),
  generatePrintDocument(data, fileName) {
    printMovements(data, fileName);
  },
  generatePrintSQLDelete(data, fileName) {
    printSQLDelete(data, fileName);
  },
};
