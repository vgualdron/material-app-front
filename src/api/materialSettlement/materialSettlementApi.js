import { http } from '../../helpers/http';

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
  getTickets: (id) => http({
    url: `${process.env.URL_API}/api/materialSettlement/getTickets/${id}/${id}/${id}`,
    method: 'GET',
  }),
  settleTickets: (data) => http({
    url: `${process.env.URL_API}/api/materialSettlement/settleTickets`,
    method: 'POST',
    data,
  }),
  addInformation: (data) => http({
    url: `${process.env.URL_API}/api/materialSettlement/addInformation/${data.id}`,
    method: 'PUT',
    data,
  }),
};
