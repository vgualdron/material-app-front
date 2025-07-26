import { http } from '../../helpers/http';

export default {
  list: () => http({
    url: `${process.env.URL_API}/api/batterie/list`,
    method: 'GET',
  }),
  listId: (id) => http({
    url: `${process.env.URL_API}/api/batterie/list/${id}`,
    method: 'GET',
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
