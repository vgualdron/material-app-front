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
  console.log('-------------------');
  const dataBase = openDatabase('material-control', '1.0', 'Base de datos local', 3 * 1024 * 1024);
  if (!dataBase) {
    const response = { status: 500, message: [{ text: 'Error al obtener datos locales', detail: 'No se ha logrado establecer conexión con la base de datos' }] };
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
        deleted integer DEFAULT 0
      );`);

      tx.executeSql(`
      SELECT
        t.id id,
        t.type type,
        t.material material,
        t.ashPercentage,
        t.date date,
        t.time time,
        t.license_plate  license_plate,
        t.user user,
        t.driver_name driver_name,
        t.driver_document driver_document,
        t.local_created_at local_created_at,
        t.gross_weight,
        gross_weight,
        t.tare_weight tare_weight,
        t.net_weight net_weight,
        t.conveyor_company conveyor_company,
        t.observation observation,
        t.round_trip round_trip,
        t.deleted deleted,
        t.synchronized synchronized,
        t.synchronize synchronize,
        (CASE t.operation WHEN "" THEN NULL ELSE t.operation END) operation,
        t.user user,
        (CASE t.origin_yard WHEN "" THEN NULL ELSE t.origin_yard END) origin_yard,
        (CASE t.destiny_yard WHEN "" THEN NULL ELSE t.destiny_yard END) destiny_yard,
        (CASE t.supplier WHEN "" THEN NULL ELSE t.supplier END) supplier,
        (CASE t.customer WHEN "" THEN NULL ELSE t.customer END) customer,
        (CASE t.receipt_number WHEN "" THEN NULL ELSE t.receipt_number END) receipt_number,
        (CASE t.referral_number WHEN "" THEN NULL ELSE t.referral_number END) referral_number,
        (CASE t.trailer_number WHEN "" THEN NULL ELSE t.trailer_number END) trailer_number,
        (CASE t.seals WHEN "" THEN NULL ELSE t.seals END) seals,
      FROM tiquet t
      WHERE t.modified = ? OR t.deleted = ?
      ORDER BY t.deleted DESC`, [1, 1]);
    }).then((result) => {
      const response = { status: 200 + result, message: [{ text: 'Sincronización finalizada con éxito', detail: null }] };
      resolve(response);
    }).catch(() => {
      const response = { status: 500, message: [{ text: 'Error al cargar datos locales', detail: 'Se ha presentado un problema en la transacción con la base de datos' }] };
      reject(response);
    });
  }
});

export {
  setData,
  getData,
};
