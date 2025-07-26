import { http } from '../../helpers/http';
import { printReport } from '../../helpers/printReport';

export default {
  movements: (data) => http({
    url: `${process.env.URL_API}/api/report/movements/${data.movement}/${data.startDate}/${data.finalDate}/${data.originYard}/${data.destinyYard}/${data.material}`,
    method: 'GET',
  }),
  productions: (data) => http({
    url: `${process.env.URL_API}/api/report/productions/${data.startDate}/${data.finalDate}/${data.material}`,
    method: 'GET',
  }),
  yardStock: (data) => http({
    url: `${process.env.URL_API}/api/report/yardStock/${data.date}`,
    method: 'GET',
  }),
  completeTransfers: (data) => http({
    url: `${process.env.URL_API}/api/report/completeTransfers/${data.startDate}/${data.finalDate}/${data.originYard}/${data.destinyYard}`,
    method: 'GET',
  }),
  uncompleteTransfers: (data) => http({
    url: `${process.env.URL_API}/api/report/uncompleteTransfers/${data.startDate}/${data.finalDate}/${data.originYard}/${data.destinyYard}`,
    method: 'GET',
  }),
  unbilledPurchases: (data) => http({
    url: `${process.env.URL_API}/api/report/unbilledPurchases/${data.startDate}/${data.finalDate}/${data.supplier}/${data.material}`,
    method: 'GET',
  }),
  unbilledSales: (data) => http({
    url: `${process.env.URL_API}/api/report/unbilledSales/${data.startDate}/${data.finalDate}/${data.customer}/${data.material}`,
    method: 'GET',
  }),
  unbilledFreights: (data) => http({
    url: `${process.env.URL_API}/api/report/unbilledFreights/${data.startDate}/${data.finalDate}/${data.conveyorCompany}/${data.material}`,
    method: 'GET',
  }),
  generatePrintDocument(data, fileName) {
    printReport(data, fileName);
  },
};
