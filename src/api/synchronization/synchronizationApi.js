import { http } from '../../helpers/http';

export default {
  fromServer: (data) => http({
    url: `${process.env.URL_API}/api/zone/list`,
    method: 'GET',
    data,
  }),
  toServer: (id) => http({
    url: `${process.env.URL_API}/api/zone/get/${id}`,
    method: 'GET',
  }),
};
