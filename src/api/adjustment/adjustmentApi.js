import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/adjustment/list`,
    method: 'GET',
    data,
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/adjustment/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/adjustment/create`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/adjustment/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/adjustment/delete/${id}`,
    method: 'DELETE',
  }),
};
