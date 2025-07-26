import { http } from '../../helpers/http';

// Función para normalizar valores individuales
const normalizeParam = (value) => {
  if (value === null || value === undefined || value === '%20' || value === ' ') return '0';
  return value;
};

// Función para normalizar parámetros con comas
const normalizeCommaParam = (value) => {
  if (!value) return '0,0,0';
  return value.toString()
    .split(',')
    .map((v) => normalizeParam(v.trim()))
    .join(',');
};

export default {
  list: (data) => {
    // Normalizamos todos los parámetros de la URL
    const normalizedParams = {
      displayAll: data.displayAll || 0,
      type: normalizeParam(data.type),
      third: normalizeCommaParam(data.third),
      origin: normalizeParam(data.origin),
      startDate: normalizeParam(data.startDate),
      finalDate: normalizeParam(data.finalDate),
    };

    return http({
      url: `${process.env.URL_API}/api/third/list/${
        normalizedParams.displayAll
      }/${
        normalizedParams.type
      }/${
        normalizedParams.third
      }/${
        normalizedParams.origin
      }/${
        normalizedParams.startDate
      }/${
        normalizedParams.finalDate
      }`,
      method: 'GET',
    });
  },

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
