import { http } from '../../helpers/http';

export default {
  list: () => http({
    url: `${process.env.URL_API}/api/production/list`,
    method: 'GET',
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/production/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/production/create`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/production/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/production/delete/${id}`,
    method: 'DELETE',
  }),
};
