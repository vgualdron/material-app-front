import { http } from '../../helpers/http';

export default {
  list: () => http({
    url: `${process.env.URL_API}/api/stock/list`,
    method: 'GET',
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/stock/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/stock/create`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/stock/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/stock/delete/${id}`,
    method: 'DELETE',
  }),
};
