import { http } from '../../helpers/http';

export default {
  signin: (data) => http({
    url: `${process.env.URL_API}/api/auth/login`,
    method: 'POST',
    data,
  }),
  signout: (data) => http({
    url: `${process.env.URL_API}/api/auth/logout`,
    method: 'POST',
    data,
  }),
};
