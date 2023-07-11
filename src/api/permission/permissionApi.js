import { http } from '../../helpers/http';

export default {
  list: (data) => http({
    url: `${process.env.URL_API}/api/permission/list`,
    method: 'GET',
    data,
  }),
};
