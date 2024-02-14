import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/batterie/list`,
    method: 'GET',
    data,
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/batterie/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/batterie/create`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/batterie/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/batterie/delete/${id}`,
    method: 'DELETE',
  }),
};