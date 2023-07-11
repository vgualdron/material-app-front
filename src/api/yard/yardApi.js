import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/yard/list/${data.id}/${data.displayAll}`,
    method: 'GET',
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/yard/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/yard/create`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/yard/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/yard/delete/${id}`,
    method: 'DELETE',
  }),
};
