import { openDB } from 'idb';

const createTables = async (dbName, dbVersion) => new Promise((resolve, reject) => {
  if (!('indexedDB' in window)) {
    const response = {
      response: {
        data: {
          message: [
            {
              text: 'Error en conexión con bases de datos local',
              detail: 'Este navegador no soporta la generación de bases de datos locales',
            },
          ],
        },
      },
    };
    reject(response);
  } else {
    openDB(dbName, dbVersion, {
      upgrade(db) {
        const thirdsStore = db.createObjectStore('thirds', { keyPath: 'id', autoIncrement: true });
        thirdsStore.createIndex('nit', 'nit', { unique: true });
        thirdsStore.createIndex('name', 'name', { unique: false });
        thirdsStore.createIndex('customer', 'customer', { unique: false });
        thirdsStore.createIndex('associated', 'associated', { unique: false });
        thirdsStore.createIndex('contractor', 'contractor', { unique: false });
        thirdsStore.createIndex('active', 'active', { unique: false });

        const materialsStore = db.createObjectStore('materials', { keyPath: 'id', autoIncrement: true });
        materialsStore.createIndex('code', 'code', { unique: true });
        materialsStore.createIndex('name', 'name', { unique: true });
        materialsStore.createIndex('active', 'active', { unique: false });

        const yardsStore = db.createObjectStore('yards', { keyPath: 'id', autoIncrement: true });
        yardsStore.createIndex('code', 'code', { unique: true });
        yardsStore.createIndex('name', 'name', { unique: true });
        yardsStore.createIndex('active', 'active', { unique: false });

        const ticketsStore = db.createObjectStore('tickets', { keyPath: 'id', autoIncrement: true });
        ticketsStore.createIndex('type', 'type', { unique: false });
        ticketsStore.createIndex('user', 'user', { unique: false });
        ticketsStore.createIndex('originYard', 'originYard', { unique: false });
        ticketsStore.createIndex('destinyYard', 'destinyYard', { unique: false });
        ticketsStore.createIndex('supplier', 'supplier', { unique: false });
        ticketsStore.createIndex('customer', 'customer', { unique: false });
        ticketsStore.createIndex('material', 'material', { unique: false });
        ticketsStore.createIndex('ashPercentage', 'ashPercentage', { unique: false });
        ticketsStore.createIndex('referralNumber', 'referralNumber', { unique: false });
        ticketsStore.createIndex('receiptNumber', 'receiptNumber', { unique: false });
        ticketsStore.createIndex('date', 'date', { unique: false });
        ticketsStore.createIndex('time', 'time', { unique: false });
        ticketsStore.createIndex('licensePlate', 'licensePlate', { unique: false });
        ticketsStore.createIndex('trailerNumber', 'trailerNumber', { unique: false });
        ticketsStore.createIndex('driverDocument', 'driverDocument', { unique: false });
        ticketsStore.createIndex('driverName', 'driverName', { unique: false });
        ticketsStore.createIndex('grossWeight', 'grossWeight', { unique: false });
        ticketsStore.createIndex('tareWeight', 'tareWeight', { unique: false });
        ticketsStore.createIndex('netWeight', 'netWeight', { unique: false });
        ticketsStore.createIndex('conveyorCompany', 'conveyorCompany', { unique: false });
        ticketsStore.createIndex('observation', 'observation', { unique: false });
        ticketsStore.createIndex('seals', 'seals', { unique: false });
        ticketsStore.createIndex('roundTrip', 'roundTrip', { unique: false });
        ticketsStore.createIndex('localCreatedAt', 'localCreatedAt', { unique: false });
        ticketsStore.createIndex('consecutive', 'consecutive', { unique: false });
        ticketsStore.createIndex('modified', 'modified', { unique: false });
        ticketsStore.createIndex('deleted', 'deleted', { unique: false });
        ticketsStore.createIndex('synchronized', 'synchronized', { unique: false });
      },
    }).then((connection) => {
      resolve(connection);
    }).catch(() => {
      const response = {
        response: {
          data: {
            message: [
              {
                text: 'Error en conexión con bases de datos local',
                detail: 'No se han podido generar las tablas',
              },
            ],
          },
        },
      };
      reject(response);
    });
  }
});

const getType = (code) => {
  let type = '';
  switch (code) {
    case 'D':
      type = 'DESPACHO';
      break;
    case 'R':
      type = 'RECEPCIÓN';
      break;
    case 'C':
      type = 'COMPRA';
      break;
    case 'V':
      type = 'VENTA';
      break;
    default:
      type = '';
  }
  return type;
};

const getMaterialName = (materials, id) => {
  const index = materials.findIndex((item) => item.id === id);
  let name = '';
  if (index !== -1) {
    name = materials[index].name;
  }
  return name;
};

const getYardName = (yards, id) => {
  const index = yards.findIndex((item) => item.id === id);
  let name = '';
  if (index !== -1) {
    name = yards[index].name;
  }
  return name;
};

const getThirdName = (thirds, id) => {
  const index = thirds.findIndex((item) => item.id === id);
  let name = '';
  if (index !== -1) {
    name = thirds[index].name;
  }
  return name;
};

export {
  createTables,
  getType,
  getMaterialName,
  getYardName,
  getThirdName,
};
