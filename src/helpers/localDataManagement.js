import websql from 'websql-promisified';

const setData = async (data) => new Promise((resolve, reject) => {
  if (!data || Object.keys(data).length === 0) {
    const response = {
      response: {
        data: {
          message: [
            {
              text: 'Error al guardar datos locales',
              detail: 'No se ha proporsionado data',
            },
          ],
        },
      },
    };
    reject(response);
  } else {
    const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
    if (!dataBase) {
      const response = {
        response: {
          data: {
            message: [
              {
                text: 'Error al guardar datos locales',
                detail: 'No se ha logrado establecer conexión con la base de datos lcoal',
              },
            ],
          },
        },
      };
      reject(response);
    } else {
      const websqlPromise = websql(dataBase);
      websqlPromise.transaction((tx) => {
        tx.executeSql('DROP TABLE IF EXISTS materials;');
        tx.executeSql('DROP TABLE IF EXISTS thirds;');
        tx.executeSql('DROP TABLE IF EXISTS tickets;');
        tx.executeSql('DROP TABLE IF EXISTS yards;');

        tx.executeSql(`
          CREATE TABLE materials (
            id integer PRIMARY KEY,
            code varchar(10) NOT NULL,
            name varchar(70) NOT NULL,
            active integer NOT NULL
          );
        `);

        data.materials.forEach((element) => {
          tx.executeSql(
            'INSERT INTO materials VALUES (?, ?, ?, ?)',
            [
              element.id,
              element.code,
              element.name,
              element.active,
            ],
          );
        });

        tx.executeSql(`
          CREATE TABLE yards (
            id integer PRIMARY KEY,
            code varchar(10) NOT NULL,
            name varchar(30) NOT NULL,
            active integer NOT NULL
          );
        `);

        data.yards.forEach((element) => {
          tx.executeSql(
            'INSERT INTO yards VALUES (?, ?, ?, ?)',
            [
              element.id,
              element.code,
              element.name,
              element.active,
            ],
          );
        });

        tx.executeSql(`
          CREATE TABLE thirds (
            id integer PRIMARY KEY,
            nit varchar(50) NOT NULL,
            name varchar(200) NOT NULL,
            customer integer NOT NULL,
            associated integer NOT NULL,
            contractor integer NOT NULL,
            active integer NOT NULL
          );
        `);

        data.thirds.forEach((element) => {
          tx.executeSql(
            'INSERT INTO thirds VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
              element.id,
              element.nit,
              element.name,
              element.customer,
              element.associated,
              element.contractor,
              element.active,
            ],
          );
        });

        tx.executeSql(`
          CREATE TABLE tickets (
            id integer PRIMARY KEY,
            type varchar(1),
            user varchar(20),
            originYard integer,
            destinyYard integer,
            supplier integer,
            customer integer,
            material integer,
            ashPercentage decimal(4,2),
            referralNumber varchar(30),
            receiptNumber varchar(30),
            date date,
            time time,
            licensePlate varchar(30),
            trailerNumber varchar(30),
            driverDocument varchar(20),
            driverName varchar(100),
            grossWeight decimal(10,2),
            tareWeight decimal(10,2),
            netWeight decimal(10,2),
            conveyorCompany integer,
            observation text,
            seals varchar(200),
            roundTrip integer,
            localCreatedAt date,
            consecutive varchar(50),
            modified integer DEFAULT 1,
            deleted integer DEFAULT 0,
            synchronized integer DEFAULT 0
          );
        `);

        data.tickets.forEach((element) => {
          tx.executeSql(
            'INSERT INTO tickets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              element.id,
              element.type,
              element.user,
              element.originYard,
              element.destinyYard,
              element.supplier,
              element.customer,
              element.material,
              element.ashPercentage,
              element.referralNumber,
              element.receiptNumber,
              element.date,
              element.time,
              element.licensePlate,
              element.trailerNumber,
              element.driverDocument,
              element.driverName,
              element.grossWeight,
              element.tareWeight,
              element.netWeight,
              element.conveyorCompany,
              element.observation,
              element.seals,
              element.roundTrip,
              element.localCreatedAt,
              element.consecutive,
              0,
              0,
              1,
            ],
          );
        });
      }).then(() => {
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
      }).catch(() => {
        const response = {
          response: {
            data: {
              message: [
                {
                  text: 'Error al guardar datos locales',
                  detail: 'Se ha presentado un problema en la transacción con la base de datos local',
                },
              ],
            },
          },
        };
        reject(response);
      });
    }
  }
});

const getData = async () => new Promise((resolve, reject) => {
  const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
  if (!dataBase) {
    const response = {
      response: {
        data: {
          message: [
            {
              text: 'Error al obtener datos locales',
              detail: 'No se ha logrado establecer conexión con la base de datos lcoal',
            },
          ],
        },
      },
    };
    reject(response);
  } else {
    const websqlPromise = websql(dataBase);
    websqlPromise.transaction((tx) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS tickets (
          id integer PRIMARY KEY,
          type varchar(1),
          user varchar(20),
          originYard integer,
          destinyYard integer,
          supplier integer,
          customer integer,
          material integer,
          ashPercentage decimal(4,2),
          referralNumber varchar(30),
          receiptNumber varchar(30),
          date date,
          time time,
          licensePlate varchar(30),
          trailerNumber varchar(30),
          driverDocument varchar(20),
          driverName varchar(100),
          grossWeight decimal(10,2),
          tareWeight decimal(10,2),
          netWeight decimal(10,2),
          conveyorCompany integer,
          observation text,
          seals varchar(200),
          roundTrip integer,
          localCreatedAt date,
          consecutive varchar(50),
          modified integer DEFAULT 1,
          deleted integer DEFAULT 0,
          synchronized integer DEFAULT 0
        );
      `);

      tx.executeSql(`
        SELECT
          (CASE t.synchronized = 1
            WHEN ? THEN t.id
            ELSE null
          END) AS id,
          t.type AS type,
          t.user AS user,
          t.originYard AS originYard,
          t.destinyYard AS destinyYard,
          t.supplier AS supplier,
          t.customer AS customer,
          t.material AS material,
          t.ashPercentage AS ashPercentage,
          t.referralNumber AS referralNumber,
          t.receiptNumber AS receiptNumber,
          t.date AS date,
          t.time AS time,
          t.licensePlate AS licensePlate,
          t.trailerNumber AS trailerNumber,
          t.driverDocument AS driverDocument,
          t.driverName AS driverName,
          t.grossWeight AS grossWeight,
          t.tareWeight AS tareWeight,
          t.netWeight AS netWeight,
          t.conveyorCompany AS conveyorCompany,
          t.observation AS observation,
          t.seals AS seals,
          t.roundTrip AS roundTrip,
          t.localCreatedAt AS localCreatedAt,
          t.consecutive AS consecutive,
          t.modified AS modified,
          t.deleted AS deleted,
          t.synchronized AS synchronized
        FROM tickets AS t
        WHERE t.modified = ? AND 
          CASE t.deleted
            WHEN ? THEN t.synchronized = ?
            ELSE ?
          END
      `, [1, 1, 1, 1, 1]);
    }).then((results) => {
      let response = null;
      const position = 1;
      const arrayResult = Object.values(results[position].rows);
      const data = arrayResult.map((element) => element);
      response = {
        data: {
          data,
        },
      };
      resolve(response);
    }).catch(() => {
      const response = {
        response: {
          data: {
            message: [
              {
                text: 'Error al obtener datos locales',
                detail: 'Se ha presentado un problema en la transacción con la base de datos local',
              },
            ],
          },
        },
      };
      reject(response);
    });
  }
});

const listLocalThirds = async (thirds) => new Promise((resolve, reject) => {
  const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
  if (!dataBase) {
    const response = {
      response: {
        data: {
          message: [
            {
              text: 'Error al obtener terceros locales',
              detail: 'No se ha logrado establecer conexión con la base de datos lcoal',
            },
          ],
        },
      },
    };
    reject(response);
  } else {
    const websqlPromise = websql(dataBase);
    websqlPromise.transaction((tx) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS thirds (
          id integer PRIMARY KEY,
          nit varchar(50) NOT NULL,
          name varchar(200) NOT NULL,
          customer integer NOT NULL,
          associated integer NOT NULL,
          contractor integer NOT NULL,
          active integer NOT NULL
        );
      `);
      const parameterData = [1];
      const arr = (thirds && thirds.trim().length > 0) ? thirds.split(',') : [];
      let sqlOrStructure = '';
      if (arr.length > 0) {
        sqlOrStructure += 'OR (';
        arr.forEach((element) => {
          sqlOrStructure += 't.id = ? OR ';
          parameterData.push(element);
        });
        sqlOrStructure = `${sqlOrStructure.substring(0, sqlOrStructure.length - 4)})`;
      }
      tx.executeSql(`
        SELECT
          t.id AS id,
          t.nit as nit,
          t.name as name,
          t.customer as customer,
          t.associated as associated,
          t.contractor as contractor,
          t.active as active
        FROM thirds AS t
        WHERE t.active = ? ${sqlOrStructure}
        ORDER BY name
      `, parameterData);
    }).then((results) => {
      let response = null;
      const position = 1;
      if (results[position].rows.length > 0) {
        const arrayResult = Object.values(results[position].rows);
        const data = arrayResult.map((element) => element);
        response = {
          data: {
            data,
          },
        };
        resolve(response);
      } else {
        response = {
          response: {
            data: {
              message: [
                {
                  text: 'No hay terceros para mostrar',
                  detail: 'Aún no ha registrado ningún tercero',
                },
              ],
            },
          },
        };
        reject(response);
      }
    }).catch(() => {
      const response = {
        response: {
          data: {
            message: [
              {
                text: 'Error al obtener terceros locales',
                detail: 'Se ha presentado un problema en la transacción con la base de datos local',
              },
            ],
          },
        },
      };
      reject(response);
    });
  }
});

const listLocalMaterials = async (material) => new Promise((resolve, reject) => {
  const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
  if (!dataBase) {
    const response = {
      response: {
        data: {
          message: [
            {
              text: 'Error al obtener materiales locales',
              detail: 'No se ha logrado establecer conexión con la base de datos local',
            },
          ],
        },
      },
    };
    reject(response);
  } else {
    const websqlPromise = websql(dataBase);
    websqlPromise.transaction((tx) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS materials (
          id integer PRIMARY KEY,
          code varchar(10) NOT NULL,
          name varchar(70) NOT NULL,
          active integer NOT NULL
        );
      `);

      tx.executeSql(`
        SELECT
          m.id AS id,
          m.code AS code,
          m.name AS name,
          m.active AS active
        FROM materials AS m
        WHERE m.active = ? OR m.id = ?
      `, [1, material]);
    }).then((results) => {
      let response = null;
      const position = 1;
      if (results[position].rows.length > 0) {
        const arrayResult = Object.values(results[position].rows);
        const data = arrayResult.map((element) => element);
        response = {
          data: {
            data,
          },
        };
        resolve(response);
      } else {
        response = {
          response: {
            data: {
              message: [
                {
                  text: 'No hay materiales para mostrar',
                  detail: 'Aún no ha registrado ningún material',
                },
              ],
            },
          },
        };
        reject(response);
      }
    }).catch(() => {
      const response = {
        response: {
          data: {
            message: [
              {
                text: 'Error al obtener materiales locales',
                detail: 'Se ha presentado un problema en la transacción con la base de datos local',
              },
            ],
          },
        },
      };
      reject(response);
    });
  }
});

const listLocalYards = async (yards) => new Promise((resolve, reject) => {
  const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
  if (!dataBase) {
    const response = {
      response: {
        data: {
          message: [
            {
              text: 'Error al obtener patios locales',
              detail: 'No se ha logrado establecer conexión con la base de datos lcoal',
            },
          ],
        },
      },
    };
    reject(response);
  } else {
    const websqlPromise = websql(dataBase);
    websqlPromise.transaction((tx) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS yards (
          id integer PRIMARY KEY,
          code varchar(10) NOT NULL,
          name varchar(30) NOT NULL,
          active integer NOT NULL
        );
      `);
      const parameterData = [1];
      const arr = (yards && yards.trim().length > 0) ? yards.split(',') : [];
      let sqlOrStructure = '';
      if (arr.length > 0) {
        sqlOrStructure += 'OR (';
        arr.forEach((element) => {
          sqlOrStructure += 'y.id = ? OR ';
          parameterData.push(element);
        });
        sqlOrStructure = `${sqlOrStructure.substring(0, sqlOrStructure.length - 4)})`;
      }
      tx.executeSql(`
        SELECT
          y.id AS id,
          y.code as code,
          y.name as name,
          y.active as active
        FROM yards AS y
        WHERE y.active = ? ${sqlOrStructure}
      `, parameterData);
    }).then((results) => {
      let response = null;
      const position = 1;
      if (results[position].rows.length > 0) {
        const arrayResult = Object.values(results[position].rows);
        const data = arrayResult.map((element) => element);
        response = {
          data: {
            data,
          },
        };
        resolve(response);
      } else {
        response = {
          response: {
            data: {
              message: [
                {
                  text: 'No hay patios para mostrar',
                  detail: 'Aún no ha registrado ningún patio',
                },
              ],
            },
          },
        };
        reject(response);
      }
    }).catch(() => {
      const response = {
        response: {
          data: {
            message: [
              {
                text: 'Error al obtener patios locales',
                detail: 'Se ha presentado un problema en la transacción con la base de datos local',
              },
            ],
          },
        },
      };
      reject(response);
    });
  }
});

export {
  setData,
  getData,
  listLocalThirds,
  listLocalMaterials,
  listLocalYards,
};
