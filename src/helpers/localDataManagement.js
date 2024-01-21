import {
  createTables,
} from './commonQueries';

const dbName = 'material_control';
const dbVersion = 1;

const setData = async (data) => new Promise((resolve, reject) => {
  if (!data || Object.keys(data).length === 0) {
    const response = {
      response: {
        data: {
          message: [
            {
              text: 'Error al guardar datos locales',
              detail: 'No se ha proporcionado data',
            },
          ],
        },
      },
    };
    reject(response);
  } else {
    createTables(dbName, dbVersion).then((connection) => {
      const tx = connection.transaction([
        'materials',
        'yards',
        'thirds',
        'tickets',
      ], 'readwrite');
      try {
        const materialStore = tx.objectStore('materials');
        const yardStore = tx.objectStore('yards');
        const thirdStore = tx.objectStore('thirds');
        const ticketStore = tx.objectStore('tickets');
        // data.materials.map((element) => saveItem(materialStore, element, 'el material'));
        // data.yards.map((element) => saveItem(yardStore, element, 'el patio'));
        materialStore.clear();
        yardStore.clear();
        thirdStore.clear();
        ticketStore.clear();
        data.materials.map((element) => materialStore.add(element));
        data.yards.map((element) => yardStore.add(element));
        data.thirds.map((element) => thirdStore.add(element));
        data.tickets.map((element) => ticketStore.add({
          ...element,
          modified: 0,
          deleted: 0,
          synchronized: 1,
        }));
        /* eslint-disable no-unused-expressions */
        tx.done;
        /* eslint-enable no-unused-expressions */
        const response = {
          data: {
            message: [
              {
                text: 'Datos locales almacenados con éxito',
                detail: null,
              },
            ],
          },
        };
        resolve(response);
      } catch (e) {
        const response = {
          response: {
            data: {
              message: [
                {
                  text: 'No se ha logrado registrar el material localmente',
                  detail: 'No se han proporcionado datos',
                },
              ],
            },
          },
        };
        tx.abort();
        reject(response);
      }
    }).catch((e) => {
      reject(e);
    });
  }
});

const getData = async () => new Promise((resolve, reject) => {
  createTables(dbName, dbVersion).then((connection) => {
    const tx = connection.transaction(['tickets'], 'readonly');
    const thirdStore = tx.objectStore('tickets');
    thirdStore.getAll().then((results) => {
      const data = results.filter((result) => (result.modified === 1 && !(result.synchronized === 0 && result.deleted === 1)));
      data.forEach((element) => {
        element.id = element.synchronized !== 0 ? element.id : null;
      });
      const response = {
        data: {
          data,
        },
      };
      resolve(response);
    });
  }).catch((e) => {
    reject(e);
  });
});

const listLocalThirds = async (thirds) => new Promise((resolve, reject) => {
  createTables(dbName, dbVersion).then((connection) => {
    const tx = connection.transaction(['thirds'], 'readonly');
    const thirdStore = tx.objectStore('thirds');
    thirdStore.getAll().then((results) => {
      const data = results.filter((result) => (result.active === 1 || thirds.includes(result.id)));
      if (data.length > 0) {
        const response = {
          data: {
            data,
          },
        };
        resolve(response);
      } else {
        const response = {
          response: {
            data: {
              message: [
                {
                  text: 'No hay terceros locales para mostrar',
                  detail: 'Por favor sincronice la aplicación',
                },
              ],
            },
          },
        };
        reject(response);
      }
    });
  }).catch((e) => {
    reject(e);
  });
});

const listLocalMaterials = async (materials) => new Promise((resolve, reject) => {
  createTables(dbName, dbVersion).then((connection) => {
    const tx = connection.transaction(['materials'], 'readonly');
    const materialStore = tx.objectStore('materials');
    materialStore.getAll().then((results) => {
      const data = results.filter((result) => result.active === 1 || materials.includes(result.id));
      if (data.length > 0) {
        const response = {
          data: {
            data,
          },
        };
        resolve(response);
      } else {
        const response = {
          response: {
            data: {
              message: [
                {
                  text: 'No hay materiales locales para mostrar',
                  detail: 'Por favor sincronice la aplicación',
                },
              ],
            },
          },
        };
        reject(response);
      }
    });
  }).catch((e) => {
    reject(e);
  });
});

const listLocalYards = async (yards) => new Promise((resolve, reject) => {
  createTables(dbName, dbVersion).then((connection) => {
    const tx = connection.transaction(['yards'], 'readonly');
    const yardStore = tx.objectStore('yards');
    yardStore.getAll().then((results) => {
      const data = results.filter((result) => result.active === 1 || yards.includes(result.id));
      if (data.length > 0) {
        const response = {
          data: {
            data,
          },
        };
        resolve(response);
      } else {
        const response = {
          response: {
            data: {
              message: [
                {
                  text: 'No hay patios locales para mostrar',
                  detail: 'Por favor sincronice la aplicación',
                },
              ],
            },
          },
        };
        reject(response);
      }
    });
  }).catch((e) => {
    reject(e);
  });
});

export {
  setData,
  getData,
  listLocalThirds,
  listLocalMaterials,
  listLocalYards,
};
