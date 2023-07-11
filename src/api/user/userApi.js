import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/user/list/${data.displayAll}`,
    method: 'GET',
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/user/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/user/create`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/user/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/user/delete/${id}`,
    method: 'DELETE',
  }),
  updateProfile: (data) => http({
    url: `${process.env.URL_API}/api/user/updateProfile/${data.id}`,
    method: 'PUT',
    data,
  }),
};
