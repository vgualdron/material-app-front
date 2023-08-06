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
  print: (id) => http({
    url: `${process.env.URL_API}/api/materialSettlement/print/${id}`,
    method: 'GET',
  }),
  generatePrintDocument(data) {
    printMaterialSettlement(data);
  },
};
