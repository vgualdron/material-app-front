import { http } from '../../helpers/http';
import { printFreightSettlement } from '../../helpers/printSettlements';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/freightSettlement/list`,
    method: 'GET',
    data,
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/freightSettlement/get/${id}`,
    method: 'GET',
  }),
  getTickets: (data) => http({
    url: `${process.env.URL_API}/api/freightSettlement/getTickets/${data.startDate}/${data.finalDate}/${data.third}`,
    method: 'GET',
  }),
  settleTickets: (data) => http({
    url: `${process.env.URL_API}/api/freightSettlement/settle`,
    method: 'POST',
    data,
  }),
  addInformation: (data) => http({
    url: `${process.env.URL_API}/api/freightSettlement/addInformation/${data.id}`,
    method: 'PUT',
    data,
  }),
  validateMovements: (id) => http({
    url: `${process.env.URL_API}/api/freightSettlement/validateMovements/${id}`,
    method: 'GET',
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/freightSettlement/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  print: (id) => http({
    url: `${process.env.URL_API}/api/freightSettlement/print/${id}`,
    method: 'GET',
  }),
  getSettledTickets: (id) => http({
    url: `${process.env.URL_API}/api/freightSettlement/getSettledTickets/${id}`,
    method: 'GET',
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/freightSettlement/delete/${id}`,
    method: 'DELETE',
  }),
  generatePrintDocument(data) {
    printFreightSettlement(data);
  },
};
