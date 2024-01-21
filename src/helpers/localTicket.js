import {
  createTables,
  getType,
  getMaterialName,
  getYardName,
  getThirdName,
} from './commonQueries';

const dbName = 'material_control';
const dbVersion = 1;

const listTickets = async () => new Promise((resolve, reject) => {
  createTables(dbName, dbVersion).then((connection) => {
    try {
      const tx = connection.transaction(['tickets', 'materials', 'yards', 'thirds'], 'readonly');
      const ticketStore = tx.objectStore('tickets');
      const materialStore = tx.objectStore('materials');
      const yardStore = tx.objectStore('yards');
      const thirdStore = tx.objectStore('thirds');
      Promise.all([
        materialStore.getAll(),
        yardStore.getAll(),
        thirdStore.getAll(),
        ticketStore.getAll(),
      ]).then((responses) => {
        const materials = responses[0];
        const yards = responses[1];
        const thirds = responses[2];
        const tickets = responses[3].filter((element) => element.deleted === 0);
        if (tickets.length === 0) {
          const response = {
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
        } else {
          const data = tickets.map((ticket) => ({
            ...ticket,
            type: getType(ticket.type),
            date: ticket.date.split('-').reverse().join('/'),
            material: getMaterialName(materials, ticket.material),
            originYard: ticket.type === 'C' ? getThirdName(thirds, ticket.supplier) : getYardName(yards, ticket.originYard),
            destinyYard: ticket.type === 'V' ? getThirdName(thirds, ticket.customer) : getYardName(yards, ticket.destinyYard),
          }));
          const response = {
            data: {
              data,
            },
          };
          resolve(response);
        }
      }).catch(() => {
        const response = {
          response: {
            data: {
              message: [
                {
                  text: 'Se ha presentado un error al cargar los tiquetes locales',
                  detail: 'Se ha presentado un problema en la transacción con la base de datos',
                },
              ],
            },
          },
        };
        reject(response);
      });
    } catch (e) {
      const response = {
        response: {
          data: {
            message: [
              {
                text: 'Se ha presentado un error al cargar los tiquetes locales',
                detail: 'No se ha podido completar la operación',
              },
            ],
          },
        },
      };
      reject(response);
    }
  }).catch((e) => {
    reject(e);
  });
});

const getTicket = async (id) => new Promise((resolve, reject) => {
  createTables(dbName, dbVersion).then((connection) => {
    try {
      const tx = connection.transaction(['tickets'], 'readonly');
      const ticketStore = tx.objectStore('tickets');
      ticketStore.get(id).then((data) => {
        if (data && data.deleted !== 1) {
          data.dateTime = `${data.date.split('-').reverse().join('/')} ${data.time}`;
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
                  text: 'Se ha presentado un inconveniente al obtener tiquete local',
                  detail: 'Se ha presentado un error en la transacción con la base de datos',
                },
              ],
            },
          },
        };
        reject(response);
      });
    } catch (e) {
      const response = {
        response: {
          data: {
            message: [
              {
                text: 'Se ha presentado un inconveniente al obtener tiquete local',
                detail: 'No se ha podido completar la operación',
              },
            ],
          },
        },
      };
      reject(response);
    }
  }).catch((e) => {
    reject(e);
  });
});

const saveTicket = async (ticket) => new Promise((resolve, reject) => {
  createTables(dbName, dbVersion).then((connection) => {
    const tx = connection.transaction(['tickets'], 'readwrite');
    const ticketStore = tx.objectStore('tickets');
    ticketStore.getAll().then((results) => {
      const exists = results.filter((result) => ((ticket.type === 'D' || ticket.type === 'V' ? ticket.referralNumber : ticket.receiptNumber) === (ticket.type === 'D' || ticket.type === 'V' ? result.referralNumber : result.receiptNumber)));
      if (exists.length === 0) {
        try {
          delete ticket.id;
          ticketStore.add({
            ...ticket,
            deleted: 0,
            synchronized: 0,
            modified: 1,
          });
          const response = {
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
        } catch (e) {
          const response = {
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
        }
      } else {
        const response = {
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
                text: 'Error al registrar validar tiquetes para registro',
                detail: 'Se ha presentado un error en la transacción con la base de datos',
              },
            ],
          },
        },
      };
      reject(response);
    });
  }).catch((e) => {
    reject(e);
  });
});

const updateTicket = async (ticket) => new Promise((resolve, reject) => {
  createTables(dbName, dbVersion).then((connection) => {
    try {
      const tx = connection.transaction(['tickets'], 'readwrite');
      const ticketStore = tx.objectStore('tickets');
      ticketStore.get(ticket.id).then((data) => {
        if (data && data.deleted !== 1) {
          ticketStore.getAll().then((results) => {
            const exists = results.filter((result) => (((ticket.type === 'D' || ticket.type === 'V' ? ticket.referralNumber : ticket.receiptNumber) === (ticket.type === 'D' || ticket.type === 'V' ? result.referralNumber : result.receiptNumber)) && result.id !== ticket.id && result.deleted !== 1));
            if (exists.length === 0) {
              try {
                data.type = ticket.type;
                data.originYard = ticket.originYard;
                data.destinyYard = ticket.destinyYard;
                data.supplier = ticket.supplier;
                data.customer = ticket.customer;
                data.material = ticket.material;
                data.ashPercentage = ticket.ashPercentage;
                data.receiptNumber = ticket.receiptNumber;
                data.referralNumber = ticket.referralNumber;
                data.date = ticket.date;
                data.time = ticket.time;
                data.licensePlate = ticket.licensePlate;
                data.trailerNumber = ticket.trailerNumber;
                data.driverName = ticket.driverName;
                data.driverDocument = ticket.driverDocument;
                data.grossWeight = ticket.grossWeight;
                data.tareWeight = ticket.tareWeight;
                data.netWeight = ticket.netWeight;
                data.conveyorCompany = ticket.conveyorCompany;
                data.observation = ticket.observation;
                data.seals = ticket.seals;
                data.roundTrip = ticket.roundTrip;
                data.modified = 1;
                ticketStore.put(data);
                const response = {
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
              } catch (e) {
                const response = {
                  response: {
                    data: {
                      message: [
                        {
                          text: 'Error al actualizar el tiquete',
                          detail: 'Se ha presentado un error en la transacción con la base de datos',
                        },
                      ],
                    },
                  },
                };
                reject(response);
              }
            } else {
              const response = {
                response: {
                  data: {
                    message: [
                      {
                        text: 'Error al actualizar el tiquete',
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
                      text: 'Error al registrar validar tiquetes para registro',
                      detail: 'Se ha presentado un error en la transacción con la base de datos',
                    },
                  ],
                },
              },
            };
            reject(response);
          });
        } else {
          const response = {
            response: {
              data: {
                message: [
                  {
                    text: 'Advertencia al actualizar el tiquete',
                    detail: 'El tiquete no existe',
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
                  text: 'Se ha presentado un inconveniente al obtener tiquete local',
                  detail: 'Se ha presentado un error en la transacción con la base de datos',
                },
              ],
            },
          },
        };
        reject(response);
      });
    } catch (e) {
      const response = {
        response: {
          data: {
            message: [
              {
                text: 'Se ha presentado un inconveniente al obtener tiquete local',
                detail: 'No se ha podido completar la operación',
              },
            ],
          },
        },
      };
      reject(response);
    }
  }).catch((e) => {
    reject(e);
  });
});

const deleteTicket = async (id) => new Promise((resolve, reject) => {
  createTables(dbName, dbVersion).then((connection) => {
    try {
      const tx = connection.transaction(['tickets'], 'readwrite');
      const ticketStore = tx.objectStore('tickets');
      ticketStore.get(id).then((data) => {
        if (data) {
          data.deleted = 1;
          data.modified = 1;
          ticketStore.put(data);
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
        } else {
          const response = {
            response: {
              data: {
                message: [
                  {
                    text: 'Advertencia al eliminar el tiquete',
                    detail: 'El tiquete no existe',
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
                  text: 'Se ha presentado un inconveniente al obtener tiquete local',
                  detail: 'Se ha presentado un error en la transacción con la base de datos',
                },
              ],
            },
          },
        };
        reject(response);
      });
    } catch (e) {
      const response = {
        response: {
          data: {
            message: [
              {
                text: 'Se ha presentado un inconveniente al obtener tiquete local',
                detail: 'No se ha podido completar la operación',
              },
            ],
          },
        },
      };
      reject(response);
    }
  }).catch((e) => {
    reject(e);
  });
});

export {
  listTickets,
  saveTicket,
  getTicket,
  updateTicket,
  deleteTicket,
};
