import websql from 'websql-promisified';

const listTickets = async () => new Promise((resolve, reject) => {
  const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
  if (!dataBase) {
    const response = {
      response: {
        data: {
          message: [
            {
              text: 'Error al obtener tiquetes',
              detail: 'No se ha logrado establecer conexión con la base de datos',
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
          t.id as id,
          CASE type
            WHEN "D" THEN "DESPACHO"
            WHEN "R" THEN "RECEPCIÓN"
            WHEN "C" THEN "COMPRA"
          ELSE "VENTA"
        END AS type,
        t.referralNumber AS referralNumber,
        t.receiptNumber AS receiptNumber,
        (substr(t.date, 9, 2) || "/" || substr(t.date, 6, 2) || "/" || substr(t.date, 1, 4)) date,
        CASE t.type
          WHEN "C" THEN ts.name
          ELSE oy.name
        END AS originYard,
        CASE t.type
          WHEN "V" THEN tc.name
          ELSE dy.name
        END as destinyYard,
        m.name AS material
        FROM tickets AS t
        LEFT JOIN yards AS oy ON t.originYard = oy.id
        LEFT JOIN yards AS dy ON t.destinyYard = dy.id
        LEFT JOIN thirds AS ts ON t.supplier = ts.id
        LEFT JOIN thirds AS tc ON t.customer = tc.id
        LEFT JOIN materials AS m ON t.material = m.id
        WHERE t.deleted = ?
      `, [0]);
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
                  text: 'No hay tiquetes para mostrar',
                  detail: 'Aún no ha registrado ningún tiquete',
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
                text: 'Error al cargar datos locales',
                detail: 'Se ha presentado un problema en la transacción con la base de datos',
              },
            ],
          },
        },
      };
      reject(response);
    });
  }
});

const getTicket = async (id) => new Promise((resolve, reject) => {
  const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
  if (!dataBase) {
    const response = {
      response: {
        data: {
          message: [
            {
              text: 'Error al obtener tiquete',
              detail: 'No se ha logrado establecer conexión con la base de datos',
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
        SELECT
          t.id AS id,
          t.type AS type,
          t.originYard AS originYard,
          t.destinyYard AS destinyYard,
          t.supplier AS supplier,
          t.customer AS customer,
          t.material AS material,
          t.ashPercentage AS ashPercentage,
          t.referralNumber AS referralNumber,
          t.receiptNumber AS receiptNumber,
          (substr(t.date, 9, 2) || "/" || substr(t.date, 6, 2) || "/" || substr(t.date, 1, 4) || " " || t.time) AS dateTime,
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
          t.roundTrip AS roundTrip
        FROM tickets AS t
        WHERE t.id = ?
      `, [id]);
    }).then((results) => {
      let response = null;
      const position = 0;
      if (results[position].rows.length > 0) {
        const data = results[position].rows[0];
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
                  text: 'El tiquete no existe',
                  detail: 'Por favor recargue la página',
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
                text: 'Error al obtener el tiquete local',
                detail: 'Se ha presentado un problema en la transacción con la base de datos',
              },
            ],
          },
        },
      };
      reject(response);
    });
  }
});

const saveTicket = async (ticket) => new Promise((resolve, reject) => {
  const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
  if (!dataBase) {
    const response = {
      response: {
        data: {
          message: [
            {
              text: 'Error al guardar tiquete',
              detail: 'No se ha logrado establecer conexión con la base de datos',
            },
          ],
        },
      },
    };
    reject(response);
  } else {
    const websqlPromise = websql(dataBase);
    websqlPromise.transaction((tx) => {
      const parameterData = [0, ticket.type];
      parameterData.push(ticket.type === 'D' || ticket.type === 'V' ? ticket.referralNumber : ticket.receiptNumber);
      const sqlWhere = ` t.deleted = ? AND t.type = ? AND ${ticket.type === 'D' || ticket.type === 'V' ? 't.referralNumber = ?' : 't.receiptNumber = ?'}`;
      tx.executeSql(`
        SELECT t.id
        FROM tickets AS t
        WHERE ${sqlWhere}
      `, parameterData);
    }).then((results) => {
      let response = null;
      const position = 0;
      if (results[position].rows.length === 0) {
        websqlPromise.transaction((tx) => {
          tx.executeSql(`
            INSERT INTO tickets (
              type,
              user,
              originYard,
              destinyYard,
              supplier,
              customer,
              material,
              ashPercentage,
              referralNumber,
              receiptNumber,
              date,
              time,
              licensePlate,
              trailerNumber,
              driverDocument,
              driverName,
              grossWeight,
              tareWeight,
              netWeight,
              conveyorCompany,
              observation,
              seals,
              roundTrip,
              localCreatedAt,
              modified,
              deleted,
              synchronized
            )
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
            ticket.type,
            ticket.user,
            ticket.originYard,
            ticket.destinyYard,
            ticket.supplier,
            ticket.customer,
            ticket.material,
            ticket.ashPercentage,
            ticket.referralNumber,
            ticket.receiptNumber,
            ticket.date,
            ticket.time,
            ticket.licensePlate,
            ticket.trailerNumber,
            ticket.driverDocument,
            ticket.driverName,
            ticket.grossWeight,
            ticket.tareWeight,
            ticket.netWeight,
            ticket.conveyorCompany,
            ticket.observation,
            ticket.seals,
            ticket.roundTrip,
            ticket.localCreatedAt,
            1,
            0,
            0,
          ]);
        }).then(() => {
          response = {
            data: {
              message: [
                {
                  text: 'Tiquete registrado con éxito',
                  detail: null,
                },
              ],
            },
          };
          resolve(response);
        }).catch(() => {
          response = {
            response: {
              data: {
                message: [
                  {
                    text: 'Error al registrar el tiquete1',
                    detail: 'Se ha presentado un error en la transacción con la base de datos',
                  },
                ],
              },
            },
          };
          reject(response);
        });
      } else {
        response = {
          response: {
            data: {
              message: [
                {
                  text: 'Error al registrar el tiquete',
                  detail: `Ya existe un tiquete de ${ticket.type === 'D'
                    ? 'despacho' : (ticket.type === 'R'
                      ? 'recepción' : (ticket.type === 'C'
                        ? 'compra' : 'venta'
                      )
                    )
                  } con el número de ${ticket.type === 'D' || ticket.type === 'V' ? 'remisión' : 'recibo'} "${ticket.type === 'D' || ticket.type === 'V' ? ticket.referralNumber : ticket.receiptNumber}"`,
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
                text: 'Error al cargar datos locales',
                detail: 'Se ha presentado un problema en la transacción con la base de datos',
              },
            ],
          },
        },
      };
      reject(response);
    });
  }
});

const updateTicket = async (ticket) => new Promise((resolve, reject) => {
  const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
  if (!dataBase) {
    const response = {
      response: {
        data: {
          message: [
            {
              text: 'Error al actualizar tiquete',
              detail: 'No se ha logrado establecer conexión con la base de datos',
            },
          ],
        },
      },
    };
    reject(response);
  } else {
    const websqlPromise = websql(dataBase);
    websqlPromise.transaction((tx) => {
      const parameterData = [0, ticket.id, ticket.type];
      parameterData.push(ticket.type === 'D' || ticket.type === 'V' ? ticket.referralNumber : ticket.receiptNumber);
      const sqlWhere = ` t.deleted = ? AND t.id <> ? AND t.type = ? AND ${ticket.type === 'D' || ticket.type === 'V' ? 't.referralNumber = ?' : 't.receiptNumber = ?'}`;
      tx.executeSql(`
        SELECT t.id
        FROM tickets AS t
        WHERE ${sqlWhere}
      `, parameterData);
    }).then((results) => {
      let response = null;
      const position = 0;
      if (results[position].rows.length === 0) {
        websqlPromise.transaction((tx) => {
          tx.executeSql(`
            UPDATE tickets SET
              type = ?,
              originYard = ?,
              destinyYard = ?,
              supplier = ?,
              customer = ?,
              material = ?,
              ashPercentage = ?,
              referralNumber = ?,
              receiptNumber = ?,
              date = ?,
              time = ?,
              licensePlate = ?,
              trailerNumber = ?,
              driverDocument = ?,
              driverName = ?,
              grossWeight = ?,
              tareWeight = ?,
              netWeight = ?,
              conveyorCompany = ?,
              observation = ?,
              seals = ?,
              roundTrip = ?,
              modified = ?
            WHERE id = ?
            `, [
            ticket.type,
            ticket.originYard,
            ticket.destinyYard,
            ticket.supplier,
            ticket.customer,
            ticket.material,
            ticket.ashPercentage,
            ticket.referralNumber,
            ticket.receiptNumber,
            ticket.date,
            ticket.time,
            ticket.licensePlate,
            ticket.trailerNumber,
            ticket.driverDocument,
            ticket.driverName,
            ticket.grossWeight,
            ticket.tareWeight,
            ticket.netWeight,
            ticket.conveyorCompany,
            ticket.observation,
            ticket.seals,
            ticket.roundTrip,
            1,
            ticket.id,
          ]);
        }).then(() => {
          response = {
            data: {
              message: [
                {
                  text: 'Tiquete actualizado con éxito',
                  detail: null,
                },
              ],
            },
          };
          resolve(response);
        }).catch(() => {
          response = {
            response: {
              data: {
                message: [
                  {
                    text: 'Error al registrar el tiquete',
                    detail: 'Se ha presentado un error en la transacción con la base de datos',
                  },
                ],
              },
            },
          };
          reject(response);
        });
      } else {
        response = {
          response: {
            data: {
              message: [
                {
                  text: 'Error al registrar el tiquete',
                  detail: `Ya existe un tiquete de ${ticket.type === 'D'
                    ? 'despacho' : (ticket.type === 'R'
                      ? 'recepción' : (ticket.type === 'C'
                        ? 'compra' : 'venta'
                      )
                    )
                  } con el número de ${ticket.type === 'D' || ticket.type === 'V' ? 'remisión' : 'recibo'} "${ticket.type === 'D' || ticket.type === 'V' ? ticket.referralNumber : ticket.receiptNumber}"`,
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
                text: 'Error al cargar datos locales',
                detail: 'Se ha presentado un problema en la transacción con la base de datos',
              },
            ],
          },
        },
      };
      reject(response);
    });
  }
});

const deleteTicket = async (id) => new Promise((resolve, reject) => {
  const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
  if (!dataBase) {
    const response = {
      response: {
        data: {
          message: [
            {
              text: 'Error al eliminar tiquete',
              detail: 'No se ha logrado establecer conexión con la base de datos',
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
        UPDATE tickets
        SET deleted = ?,
          modified = ?
        WHERE id = ?
      `, [1, 1, id]);
    }).then(() => {
      const response = {
        data: {
          message: [
            {
              text: 'Tiquete eliminado con éxito',
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
                text: 'Error al eliminar tiquete',
                detail: 'Se ha presentado un problema en la transacción con la base de datos',
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
  listTickets,
  saveTicket,
  getTicket,
  updateTicket,
  deleteTicket,
};
