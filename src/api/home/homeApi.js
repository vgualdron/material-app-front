import { http } from '../../helpers/http';

export default {
  synchronize: () => http({
    url: `${process.env.URL_API}/configuration`,
    method: 'GET',
  }),
};
