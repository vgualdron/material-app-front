import { http } from '../../helpers/http';

export default {
  synchronize: (data) => http({
    url: `${process.env.URL_API}/api/synchronization/synchronize`,
    method: 'POST',
    data,
  }),
};
