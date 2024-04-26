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
  saveMixOrRiddle: (data) => http({
    url: `${process.env.URL_API}/api/adjustment/createFromProccess`,
    method: 'POST',
    data,
  }),
  listMixOrRiddle: (data) => http({
    url: `${process.env.URL_API}/api/adjustment/listProccess/${data.startDate}/${data.endDate}/${data.origin}/${data.yard}`,
    method: 'GET',
    data,
  }),
  deleteMixOrRiddle: (uuid) => http({
    url: `${process.env.URL_API}/api/adjustment/deleteProccess/${uuid}`,
    method: 'DELETE',
  }),
};
