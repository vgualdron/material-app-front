import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/material/list/${data.displayAll}/${data.id}`,
    method: 'GET',
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/material/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/material/create`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/material/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/material/delete/${id}`,
    method: 'DELETE',
  }),
  getByYard: (idYard) => http({
    url: `${process.env.URL_API}/api/material/getMaterialsByYard/${idYard}`,
    method: 'GET',
  }),
};
