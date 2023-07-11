import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/zone/list`,
    method: 'GET',
    data,
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/zone/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/zone/create`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/zone/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/zone/delete/${id}`,
    method: 'DELETE',
  }),
};
