import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/third/list/${data.displayAll}/${data.type}/${data.third}/${data.origin}/${data.startDate}/${data.finalDate}`,
    method: 'GET',
  }),
  get: (id) => http({
    url: `${process.env.URL_API}/api/third/get/${id}`,
    method: 'GET',
  }),
  save: (data) => http({
    url: `${process.env.URL_API}/api/third/create`,
    method: 'POST',
    data,
  }),
  saveInBatch: (data) => http({
    url: `${process.env.URL_API}/api/third/createInBatch`,
    method: 'POST',
    data,
  }),
  update: (data) => http({
    url: `${process.env.URL_API}/api/third/update/${data.id}`,
    method: 'PUT',
    data,
  }),
  delete: (id) => http({
    url: `${process.env.URL_API}/api/third/delete/${id}`,
    method: 'DELETE',
  }),
};
