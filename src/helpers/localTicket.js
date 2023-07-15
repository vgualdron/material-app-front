import websql from 'websql-promisified';

const setData = async (data) => new Promise((resolve, reject) => {
  if (!data || Object.keys(data).length === 0) {
    const response = { status: 500, message: [{ text: 'Error al cargar datos locales', detail: 'No se ha proporsionado data' }] };
    reject(response);
  } else {
    const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
    if (!dataBase) {
      const response = { status: 500, message: [{ text: 'Error al cargar datos locales', detail: 'No se ha logrado establecer conexión con la base de datos' }] };
      reject(response);
    } else {
      const websqlPromise = websql(dataBase);
      websqlPromise.transaction((tx) => {
        tx.executeSql('DROP TABLE IF EXISTS materials;');
        tx.executeSql('DROP TABLE IF EXISTS thirds;');
        tx.executeSql('DROP TABLE IF EXISTS tickets;');
        tx.executeSql('DROP TABLE IF EXISTS yards;');

        tx.executeSql(`CREATE TABLE materials (
          id integer PRIMARY KEY,
          code varchar(10) NOT NULL,
          name varchar(70) NOT NULL,
          active integer NOT NULL
        );`);

        tx.executeSql(`
        CREATE TABLE yards (
          id integer PRIMARY KEY,
          code varchar(10) NOT NULL,
          name varchar(30) NOT NULL,
          active integer NOT NULL
        );`);

        tx.executeSql(`
        CREATE TABLE thirds (
          id integer PRIMARY KEY,
          nit varchar(50) NOT NULL,
          name varchar(200) NOT NULL,
          customer integer NOT NULL,
          associated integer NOT NULL,
          contractor integer NOT NULL,
          active integer NOT NULL
        );`);

        setTimeout(() => console.log('Hello'), 3000);

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
          deleted integer DEFAULT 0
        );`);
      }).then(() => {
        const response = { status: 200, message: [{ text: 'Sincronización finalizada con éxito', detail: null }] };
        resolve(response);
      }).catch(() => {
        const response = { status: 500, message: [{ text: 'Error al cargar datos locales', detail: 'Se ha presentado un problema en la transacción con la base de datos' }] };
        reject(response);
      });
    }
  }
});

const getData = async () => new Promise((resolve, reject) => {
  const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
  if (!dataBase) {
    const response = { status: 500, message: [{ text: 'Error al obtener datos locales', detail: 'No se ha logrado establecer conexión con la base de datos' }] };
    reject(response);
  } else {
    const websqlPromise = websql(dataBase);
    websqlPromise.transaction((tx) => {
      tx.executeSql(`
        DROP table tickets
      `);

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
        INSERT INTO tickets (referralNumber) values ("111111111");
      `);

      tx.executeSql(`
        SELECT
          t.id AS id,
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
          t.deleted AS deleted
        FROM tickets AS t
        WHERE t.modified = ?
      `, [0]);
    }).then((results) => {
      let response = null;
      const position = 3;
      if (results[position].rows.length > 0) {
        const arrayResult = Object.values(results[position].rows);
        const data = arrayResult.flatMap((element) => element);
        response = {
          data: {
            data,
          },
        };
        resolve(response);
      } else {
        response = {
          message: [
            {
              text: 'No hay tiquetes para mostrar',
              detail: 'Aun no ha registrado ningún tiquete',
            },
          ],
        };
        reject(response);
      }
    }).catch(() => {
      const response = {
        message: [
          {
            text: 'Error al cargar datos locales',
            detail: 'Se ha presentado un problema en la transacción con la base de datos',
          },
        ],
      };
      reject(response);
    });
  }
});

export {
  setData,
  getData,
};
