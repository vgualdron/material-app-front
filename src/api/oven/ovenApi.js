import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/oven/list`,
    method: 'GET',
    data,
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/oven/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/oven/create`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/oven/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/oven/delete/${id}`,
    method: 'DELETE',
  }),
};
