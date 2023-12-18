import { http } from '../../helpers/http';
import { printMaterialSettlement } from '../../helpers/printSettlements';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/materialSettlement/list`,
    method: 'GET',
    data,
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/materialSettlement/get/${id}`,
    method: 'GET',
  }),
  getTickets: (data) => http({
    url: `${process.env.URL_API}/api/materialSettlement/getTickets/${data.type}/${data.startDate}/${data.finalDate}/${data.third}/${data.material}/${data.materialType}`,
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
  }),
  validateMovements: (id) => http({
    url: `${process.env.URL_API}/api/materialSettlement/validateMovements/${id}`,
    method: 'GET',
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/materialSettlement/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  print: (id) => http({
    url: `${process.env.URL_API}/api/materialSettlement/print/${id}`,
    method: 'GET',
  }),
  getSettledTickets: (id) => http({
    url: `${process.env.URL_API}/api/materialSettlement/getSettledTickets/${id}`,
    method: 'GET',
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/materialSettlement/delete/${id}`,
    method: 'DELETE',
  }),
  generatePrintDocument(data) {
    printMaterialSettlement(data);
  },
};
