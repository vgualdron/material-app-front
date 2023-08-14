import { http } from '../../helpers/http';
import { printMovements } from '../../helpers/printMovements';

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
  /* get: (id) => http({
    url: `${process.env.URL_API}/api/materialSettlement/get/${id}`,
    method: 'GET',
  }),
  settleTickets: (data) => http({
    url: `${process.env.URL_API}/api/materialSettlement/settle`,
    method: 'POST',
    data,
  }),
  addInformation: (data) => http({
    url: `${process.env.URL_API}/api/materialSettlement/addInformation/${data.id}`,
    method: 'PUT',
    data,
  }), */
  generatePrintDocument(data, fileName) {
    printMovements(data, fileName);
  },
};
