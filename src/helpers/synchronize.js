import websql from 'websql-promisified';

async function setDataToLocale (data) {
  return await new Promise((resolve, reject) => {
    console.log('setDataToLocalehelpers1');
    if (!data || Object.keys(data).length === 0) {
      const response = { status: 500, data: { message: 'Error al cargar datos locales', errors: { sql: ['No se ha traido información desde el servidor'] } } };
      reject(response);
    } else {
      const dataBase = openDatabase('dbNovum', '1.0', 'Novum Database', 3 * 1024 * 1024);
      if (!dataBase) {
        const response = { status: 500, data: { message: 'Error al cargar datos locales', errors: { sql: ['Se ha presentado un error al conectar con la base de datos local'] } } };
        reject(response);
      } else {
        const websqlPromise = websql(dataBase);
        websqlPromise.transaction((tx) => {
          tx.executeSql('DROP TABLE IF EXISTS material;');
          tx.executeSql('DROP TABLE IF EXISTS model_has_roles;');
          tx.executeSql('DROP TABLE IF EXISTS permissions;');
          tx.executeSql('DROP TABLE IF EXISTS roles;');
          tx.executeSql('DROP TABLE IF EXISTS role_has_permissions;');
          tx.executeSql('DROP TABLE IF EXISTS third;');
          tx.executeSql('DROP TABLE IF EXISTS tiquet;');
          tx.executeSql('DROP TABLE IF EXISTS user;');
          tx.executeSql('DROP TABLE IF EXISTS yard;');
          tx.executeSql('DROP TABLE IF EXISTS zone;');
          tx.executeSql('CREATE TABLE zone (' +
            'id integer PRIMARY KEY,' +
            'code varchar(10) NOT NULL,' +
            'name varchar(30) NOT NULL' +
            ');'
          );
          tx.executeSql('CREATE TABLE yard (' +
            'id integer PRIMARY KEY,' +
            'code varchar(30) NOT NULL,' +
            'name varchar(100) NOT NULL,' +
            'zone int(20) DEFAULT NULL' +
            ');'
          );
          tx.executeSql('CREATE TABLE material (' +
            'id integer NOT NULL PRIMARY KEY,' +
            'code varchar(10) NOT NULL,' +
            'name varchar(150) NOT NULL,' +
            'unit varchar(2) NOT NULL' +
            ');'
          );
          tx.executeSql('CREATE TABLE model_has_roles (' +
            'role_id integer NOT NULL,' +
            'model_type varchar(125) NOT NULL,' +
            'model_id int(20) NOT NULL' +
            ');'
          );
          tx.executeSql('CREATE TABLE permissions (' +
            'id integer NOT NULL PRIMARY KEY,' +
            'name varchar(125) NOT NULL,' +
            'guard_name varchar(125) NOT NULL,' +
            'is_function int(10) NOT NULL,' +
            'display_name varchar(125) NOT NULL,' +
            'offline int(10) NOT NULL,' +
            'general int(10) NOT NULL' +
            ');'
          );
          tx.executeSql('CREATE TABLE roles (' +
            'id integer NOT NULL PRIMARY KEY,' +
            'name varchar(125) NOT NULL,' +
            'guard_name varchar(125) NOT NULL' +
            ');'
          );
          tx.executeSql('CREATE TABLE role_has_permissions (' +
            'permission_id int(20) NOT NULL,' +
            'role_id int(20) NOT NULL' +
            ');'
          );
          tx.executeSql('CREATE TABLE third (' +
            'id integer PRIMARY KEY,' +
            'nit varchar(30) NOT NULL,' +
            'name varchar(255) NOT NULL,' +
            'customer id(1) NOT NULL,' +
            'associated id(1) NOT NULL,' +
            'contractor id(1) NOT NULL' +
            ');'
          );
          tx.executeSql('CREATE TABLE tiquet (' +
            'id integer PRIMARY KEY,' +
            'type varchar(2) DEFAULT NULL,' +
            'operation varchar(1) DEFAULT NULL,' +
            'user int(20) DEFAULT NULL,' +
            'origin_yard int(20) DEFAULT NULL,' +
            'destiny_yard int(20) DEFAULT NULL,' +
            'supplier int(20) DEFAULT NULL,' +
            'customer int(20) DEFAULT NULL,' +
            'material int(20) DEFAULT NULL,' +
            'ash_percentage decimal(8,2) DEFAULT 0,' +
            'receipt_number varchar(50) DEFAULT NULL,' +
            'referral_number varchar(50) DEFAULT NULL,' +
            'date date DEFAULT NULL,' +
            'time time DEFAULT NULL,' +
            'license_plate varchar(50) DEFAULT NULL,' +
            'trailer_number varchar(50) DEFAULT NULL,' +
            'driver_name varchar(100) DEFAULT NULL,' +
            'driver_document varchar(100) DEFAULT NULL,' +
            'gross_weight decimal(8,2) DEFAULT NULL,' +
            'tare_weight decimal(8,2) DEFAULT NULL,' +
            'net_weight decimal(8,2) DEFAULT NULL,' +
            'conveyor_company int(20) DEFAULT NULL,' +
            'observation varchar(200) DEFAULT NULL,' +
            'seals varchar(50) DEFAULT NULL,' +
            'round_trip int(1) DEFAULT 0,' +
            'local_created_at date,' +
            'synchronize int(1) DEFAULT 1,' +
            'synchronized int(1) DEFAULT 0,' +
            'deleted int(1) DEFAULT 0' +
            ');'
          );
          tx.executeSql('CREATE TABLE user (' +
            'id integer NOT NULL PRIMARY KEY,' +
            'name varchar(255) NOT NULL,' +
            'document_number varchar(50) NOT NULL,' +
            'phone varchar(50) NOT NULL,' +
            'password varchar(255) NOT NULL,' +
            'yard int(20) DEFAULT NULL' +
            ');'
          );
          /* synchronize zones */
          const objectZone = data.zone;
          for (let i = 0; i < objectZone.length; i++) {
            tx.executeSql('INSERT INTO zone VALUES (?, ?, ?)',
              [
                objectZone[i].id,
                objectZone[i].code,
                objectZone[i].name
              ]
            );
          };
          /* synchronize materials */
          const objectMaterial = data.material;
          for (let i = 0; i < objectMaterial.length; i++) {
            tx.executeSql('INSERT INTO material VALUES (?, ?, ?, ?)',
              [
                objectMaterial[i].id,
                objectMaterial[i].code,
                objectMaterial[i].name,
                objectMaterial[i].unit
              ]
            );
          };
          /* synchronize users */
          const objectUser = data.user;
          for (let i = 0; i < objectUser.length; i++) {
            tx.executeSql('INSERT INTO user VALUES (?, ?, ?, ?, ?, ?)',
              [
                objectUser[i].id,
                objectUser[i].name,
                objectUser[i].documentNumber,
                objectUser[i].phoneNumber,
                objectUser[i].password,
                objectUser[i].yard
              ]
            );
          };
          /* synchronize model_has_roles */
          const objectModelHasRoles = data.model_has_roles;
          for (let i = 0; i < objectModelHasRoles.length; i++) {
            tx.executeSql('INSERT INTO model_has_roles VALUES (?, ?, ?)',
              [
                objectModelHasRoles[i].role,
                objectModelHasRoles[i].type,
                objectModelHasRoles[i].user
              ]
            );
          };
          /* synchronize permissions */
          const objectPermission = data.permission;
          for (let i = 0; i < objectPermission.length; i++) {
            tx.executeSql('INSERT INTO permissions VALUES (?, ?, ?, ?, ?, ?, ?)',
              [
                objectPermission[i].id,
                objectPermission[i].name,
                objectPermission[i].guardName,
                objectPermission[i].isFunction,
                objectPermission[i].displayName,
                objectPermission[i].offline,
                objectPermission[i].general
              ]
            );
          };
          /* synchronize role */
          const objectRole = data.roles;
          for (let i = 0; i < objectRole.length; i++) {
            tx.executeSql('INSERT INTO roles VALUES (?, ?, ?)',
              [
                objectRole[i].id,
                objectRole[i].name,
                objectRole[i].guardName
              ]
            );
          };
          /* synchronize third */
          const objectThird = data.third;
          for (let i = 0; i < objectThird.length; i++) {
            tx.executeSql('INSERT INTO third VALUES (?, ?, ?, ?, ?, ?)',
              [
                objectThird[i].id,
                objectThird[i].nit,
                objectThird[i].name,
                objectThird[i].customer,
                objectThird[i].associated,
                objectThird[i].contractor
              ]
            );
          };
          /* synchronize yard */
          const objectYard = data.yard;
          for (let i = 0; i < objectYard.length; i++) {
            tx.executeSql('INSERT INTO yard VALUES (?, ?, ?, ?)',
              [
                objectYard[i].id,
                objectYard[i].code,
                objectYard[i].name,
                objectYard[i].zone
              ]
            );
          };
          /* synchronize rolePermission */
          const objectRolePermission = data.role_has_permissions;
          for (let i = 0; i < objectRolePermission.length; i++) {
            tx.executeSql('INSERT INTO role_has_permissions VALUES (?, ?)',
              [
                objectRolePermission[i].permission,
                objectRolePermission[i].role
              ]
            );
          };
          /* synchronize tiquet */
          const objectTiquet = data.tiquet;
          for (let i = 0; i < objectTiquet.length; i++) {
            tx.executeSql('INSERT INTO tiquet VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [
                objectTiquet[i].id,
                objectTiquet[i].type,
                objectTiquet[i].operation,
                objectTiquet[i].user,
                objectTiquet[i].origin_yard,
                objectTiquet[i].destiny_yard,
                objectTiquet[i].supplier,
                objectTiquet[i].customer,
                objectTiquet[i].material,
                objectTiquet[i].ash_percentage,
                objectTiquet[i].receipt_number,
                objectTiquet[i].referral_number,
                objectTiquet[i].date,
                objectTiquet[i].time,
                objectTiquet[i].license_plate,
                objectTiquet[i].trailer_number,
                objectTiquet[i].driver_name,
                objectTiquet[i].driver_document,
                objectTiquet[i].gross_weight,
                objectTiquet[i].tare_weight,
                objectTiquet[i].net_weight,
                objectTiquet[i].conveyor_company,
                objectTiquet[i].observation,
                objectTiquet[i].seals,
                objectTiquet[i].round_trip,
                objectTiquet[i].local_created_at,
                0,
                1,
                0
              ]
            );
          };
        }).then(() => {
          const response = { status: 200, data: { message: 'La sincronización ha finalizado exitosamente' } };
          resolve(response);
        }).catch(() => {
          console.log('setDataToLocalehelper4');
          const response = { status: 500, data: { message: 'Error al cargar datos locales', errors: { sql: ['Se ha presentado un error de sql'] } } };
          reject(response);
        });
      }
    }
  });
}

async function getNotSynchronizedTiquets () {
  return await new Promise((resolve, reject) => {
    console.log('getNotSynchronizedTiquets1');
    // const response = { status: '200', data: { message: 'Tiquet creado con éxito' } };
    const dataBase = openDatabase('dbNovum', '1.0', 'Novum Database', 3 * 1024 * 1024);
    const websqlPromise = websql(dataBase);
    if (!dataBase) {
      const response = { status: 500, data: { message: 'Error al conectarse a la base de datos', errors: { sql: ['Se ha presentado un error de SQL'] } } };
      reject(response);
    } else {
      websqlPromise.transaction((tx) => {
        tx.executeSql('SELECT name FROM sqlite_master WHERE type="table" AND name="user"');
      }).then((results) => {
        console.log('getNotSynchronizedTiquets4');
        const exists = results[0].rows.length > 0 ? results[0].rows[0].name : null;
        websqlPromise.transaction((tx) => {
          if (exists === null) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS zone (' +
              'id integer PRIMARY KEY,' +
              'code varchar(10) NOT NULL,' +
              'name varchar(30) NOT NULL' +
              ');'
            );
            tx.executeSql('CREATE TABLE IF NOT EXISTS yard (' +
              'id integer PRIMARY KEY,' +
              'code varchar(30) NOT NULL,' +
              'name varchar(100) NOT NULL,' +
              'zone int(20) DEFAULT NULL' +
              ');'
            );
            tx.executeSql('CREATE TABLE IF NOT EXISTS material (' +
              'id integer NOT NULL PRIMARY KEY,' +
              'code varchar(10) NOT NULL,' +
              'name varchar(150) NOT NULL,' +
              'unit varchar(2) NOT NULL' +
              ');'
            );
            tx.executeSql('CREATE TABLE IF NOT EXISTS model_has_roles (' +
              'role_id integer NOT NULL,' +
              'model_type varchar(125) NOT NULL,' +
              'model_id int(20) NOT NULL' +
              ');'
            );
            tx.executeSql('CREATE TABLE IF NOT EXISTS permissions (' +
              'id integer NOT NULL PRIMARY KEY,' +
              'name varchar(125) NOT NULL,' +
              'guard_name varchar(125) NOT NULL,' +
              'is_function int(10) NOT NULL,' +
              'display_name varchar(125) NOT NULL,' +
              'offline int(10) NOT NULL,' +
              'general int(10) NOT NULL' +
              ');'
            );
            tx.executeSql('CREATE TABLE IF NOT EXISTS roles (' +
              'id integer NOT NULL PRIMARY KEY,' +
              'name varchar(125) NOT NULL,' +
              'guard_name varchar(125) NOT NULL' +
              ');'
            );
            tx.executeSql('CREATE TABLE IF NOT EXISTS role_has_permissions (' +
              'permission_id int(20) NOT NULL,' +
              'role_id int(20) NOT NULL' +
              ');'
            );
            tx.executeSql('CREATE TABLE IF NOT EXISTS third (' +
              'id integer PRIMARY KEY,' +
              'nit varchar(30) NOT NULL,' +
              'name varchar(255) NOT NULL,' +
              'customer id(1) NOT NULL,' +
              'associated id(1) NOT NULL,' +
              'contractor id(1) NOT NULL' +
              ');'
            );
            tx.executeSql('CREATE TABLE IF NOT EXISTS tiquet (' +
              'id integer PRIMARY KEY,' +
              'type varchar(2) DEFAULT NULL,' +
              'operation varchar(1) DEFAULT NULL,' +
              'user int(20) DEFAULT NULL,' +
              'origin_yard int(20) DEFAULT NULL,' +
              'destiny_yard int(20) DEFAULT NULL,' +
              'supplier int(20) DEFAULT NULL,' +
              'customer int(20) DEFAULT NULL,' +
              'material int(20) DEFAULT NULL,' +
              'ash_percentage decimal(8,2) DEFAULT 0,' +
              'receipt_number varchar(50) DEFAULT NULL,' +
              'referral_number varchar(50) DEFAULT NULL,' +
              'date date DEFAULT NULL,' +
              'time time DEFAULT NULL,' +
              'license_plate varchar(50) DEFAULT NULL,' +
              'trailer_number varchar(50) DEFAULT NULL,' +
              'driver_name varchar(100) DEFAULT NULL,' +
              'driver_document varchar(100) DEFAULT NULL,' +
              'gross_weight decimal(8,2) DEFAULT NULL,' +
              'tare_weight decimal(8,2) DEFAULT NULL,' +
              'net_weight decimal(8,2) DEFAULT NULL,' +
              'conveyor_company int(20) DEFAULT NULL,' +
              'observation varchar(200) DEFAULT NULL,' +
              'seals varchar(50) DEFAULT NULL,' +
              'round_trip int(1) DEFAULT 0,' +
              'local_created_at date,' +
              'synchronize int(1) DEFAULT 1,' +
              'synchronized int(1) DEFAULT 0,' +
              'deleted int(1) DEFAULT 0' +
              ');'
            );
            tx.executeSql('CREATE TABLE IF NOT EXISTS user (' +
              'id integer NOT NULL PRIMARY KEY,' +
              'name varchar(255) NOT NULL,' +
              'document_number varchar(50) NOT NULL,' +
              'phone varchar(50) NOT NULL,' +
              'password varchar(255) NOT NULL,' +
              'yard int(20) DEFAULT NULL' +
              ');'
            );
          }
          tx.executeSql('SELECT t.id id, t.type type, t.material material, t.ash_percentage ash_percentage, ' +
                        't.date date, t.time time, t.license_plate  license_plate, t.user user, t.driver_name driver_name, ' +
                        't.driver_document driver_document, t.local_created_at local_created_at, t.gross_weight ' +
                        'gross_weight, t.tare_weight tare_weight, t.net_weight net_weight, t.conveyor_company conveyor_company, ' +
                        't.observation observation, t.round_trip round_trip, t.deleted deleted, t.synchronized synchronized, ' +
                        't.synchronize synchronize, ' +
                        '(CASE t.operation WHEN "" THEN NULL ELSE t.operation END) operation, t.user user, ' +
                        '(CASE t.origin_yard WHEN "" THEN NULL ELSE t.origin_yard END) origin_yard, ' +
                        '(CASE t.destiny_yard WHEN "" THEN NULL ELSE t.destiny_yard END) destiny_yard, ' +
                        '(CASE t.supplier WHEN "" THEN NULL ELSE t.supplier END) supplier, ' +
                        '(CASE t.customer WHEN "" THEN NULL ELSE t.customer END) customer, ' +
                        '(CASE t.receipt_number WHEN "" THEN NULL ELSE t.receipt_number END) receipt_number, ' +
                        '(CASE t.referral_number WHEN "" THEN NULL ELSE t.referral_number END) referral_number, ' +
                        '(CASE t.trailer_number WHEN "" THEN NULL ELSE t.trailer_number END) trailer_number, ' +
                        '(CASE t.seals WHEN "" THEN NULL ELSE t.seals END) seals, ' +
                        '(tc.nit || "/" || tc.name) customer_name, ' +
                        '(ts.nit || "/" || ts.name) supplier_name, ' +
                        '(tcc.nit || "/" || tcc.name) conveyor_company_name ' +
                      'FROM tiquet t ' +
                      'LEFT JOIN third tc ON t.customer = tc.id ' +
                      'LEFT JOIN third ts ON t.supplier = ts.id ' +
                      'LEFT JOIN third tcc ON t.conveyor_company = tcc.id ' +
                      'WHERE t.synchronize = ? ' +
                      'ORDER BY t.deleted DESC', [1]);
        }).then((results) => {
          const result = [];
          for (let i = 0; i < results[0].rows.length; i++) {
            result.push(results[0].rows[i]);
          }
          resolve(result);
        }).catch(() => {
          const response = { status: 500, data: { message: 'Error al obtener tiquets locales', errors: { sql: ['Se ha presentado un error de SQL al tratar de obtener los datos locales'] } } };
          reject(response);
        });
      }).catch(() => {
        console.log('getNotSynchronizedTiquets5');
        const response = { status: 500, data: { message: 'Error al obtener tiquets locales', errors: { sql: ['Se ha presentado un error de SQL al verificar la existencia de la base de datos'] } } };
        reject(response);
      });
    }
  });
}

async function getTiquets (data) {
  return await new Promise((resolve, reject) => {
    console.log('getTiquets1');
    const dataBase = openDatabase('dbNovum', '1.0', 'Novum Database', 3 * 1024 * 1024);
    const websqlPromise = websql(dataBase);
    if (!dataBase) {
      alert('Lo sentimos, algo fue mal en la conexion de la base de datos local');
    } else {
      console.log('getTiquets2');
      const text = '%' + (data?.text ? data.text : '') + '%';
      websqlPromise.transaction((tx) => {
        tx.executeSql('SELECT t.id id, CASE t.type ' +
                        'WHEN "D" THEN "DESPACHO " ' +
                        'WHEN "R" THEN "RECEPCIÓN"  ' +
                        'WHEN "C" THEN "COMPRA" ' +
                        'WHEN "V" THEN "VENTA" ' +
                        'WHEN "OC" THEN "OPERACIÓN CON CLIENTE" ' +
                        'WHEN "OP" THEN "OPERACIÓN CON PROVEEDOR" ' +
                        'END AS type, t.receipt_number, t.referral_number, ' +
                        'm.name material_name, t.license_plate license_plate, ' +
                        '(substr(t.date, 9, 2) || "/" || substr(t.date, 6, 2) || "/" || substr(t.date, 1, 4)) date ' +
                      'FROM tiquet t ' +
                      'LEFT JOIN material m ON t.material = m.id ' +
                      'WHERE (t.receipt_number LIKE ? OR t.referral_number LIKE ? OR m.name LIKE ?) AND t.deleted <> 1', [text, text, text]);
      }).then((results) => {
        console.log('getTiquets3');
        const result = [];
        for (let i = 0; i < results[0].rows.length; i++) {
          result.push(results[0].rows[i]);
        }
        const response = { status: 200, data: result };
        resolve(response);
      }).catch(() => {
        const response = { status: 500, data: { message: 'Error al registrar tiquet', errors: { sql: ['Se ha presentado un error de SQL'] } } };
        reject(response);
      });
    }
  });
}

async function getTiquet (id) {
  const dataBase = openDatabase('dbNovum', '1.0', 'Novum Database', 3 * 1024 * 1024);
  const websqlPromise = websql(dataBase);
  if (!dataBase) {
    alert('Lo sentimos, algo fue mal en la conexion de la base de datos local');
  } else {
    return await new Promise((resolve, reject) => {
      websqlPromise.transaction((tx) => {
        tx.executeSql('SELECT * FROM tiquet WHERE id = ?', [id]);
      }).then((results) => {
        const response = { data: results[0].rows[0], status: 200, statusText: 'OK' };
        resolve(response);
      }).catch(() => {
        const response = { status: 500, data: { message: 'Error al registrar tiquet', errors: { sql: ['Se ha presentado un error de SQL'] } } };
        reject(response);
      });
    });
  }
}

async function insertTiquet (data) {
  const dataBase = openDatabase('dbNovum', '1.0', 'Novum Database', 3 * 1024 * 1024);
  const websqlPromise = websql(dataBase);
  if (!dataBase) {
    alert('Lo sentimos, algo fue mal en la conexion de la base de datos local');
  } else {
    return await new Promise((resolve, reject) => {
      websqlPromise.transaction((tx) => {
        tx.executeSql(('SELECT * FROM tiquet ' +
                        'WHERE CASE ' +
                          'WHEN "' + data.type + '" = "D" THEN referral_number = "' + data.referral_number + '" AND type <> "R" ' +
                          'WHEN "' + data.type + '" = "V" OR (("' + data.type + '" = "OC" OR "' + data.type + '" = "OP") AND "' + data.operation + '" = "P") THEN referral_number = "' + data.referral_number + '" ' +
                          'WHEN "' + data.type + '" = "C" OR "' + data.type + '" = "R" OR (("' + data.type + '" = "OC" OR "' + data.type + '" = "OP") AND "' + data.operation + '" = "D") THEN receipt_number = "' + data.receipt_number + '" ' +
                        'END'), []);
      }).then((results) => {
        if (results[0].rows.length > 0) {
          const response = { status: 500, data: { message: 'Error al eliminar tiquet', errors: { sql: ['Ya existe un tiquet con el número de ' + (data.type === 'D' || data.type === 'V' || ((data.type === 'OC' || data.type === 'OP') && data.operation === 'P') ? 'remisión' : 'recibo') + ' ingresado'] } } };
          reject(response);
        } else {
          websqlPromise.transaction((tx) => {
            const stringFullDate = (new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', hour12: false }).format(new Date())).replace(',', '');
            const arrayFullDate = stringFullDate.split(' ');
            let arrayDate = arrayFullDate[0].split('/');
            arrayDate = arrayDate.map(function (x) { return x.padStart(2, '0'); });
            const currentDate = arrayDate[2] + '-' + arrayDate[1] + '-' + arrayDate[0];
            tx.executeSql('INSERT INTO tiquet (type, operation, user, origin_yard, destiny_yard, supplier, customer, ' +
                            'material, ash_percentage, receipt_number, referral_number, date, time, license_plate, trailer_number, ' +
                            'driver_name, driver_document, gross_weight, tare_weight, net_weight, conveyor_company, observation, seals, ' +
                            'round_trip, local_created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
              data.type, data.operation, data.user, data.origin_yard, data.destiny_yard, data.supplier, data.customer,
              data.material, data.ash_percentage, data.receipt_number, data.referral_number, data.date, data.time,
              data.license_plate, data.trailer_number, data.driver_name, data.driver_document, data.gross_weight,
              data.tare_weight, data.net_weight, data.conveyor_company, data.observation, data.seals, data.round_trip,
              currentDate
            ]);
          }).then(() => {
            const response = { status: 200, data: { message: 'Tiquet creado con éxito' } };
            resolve(response);
          }).catch(() => {
            const response = { status: 500, data: { message: 'Error al crear tiquet', errors: { sql: ['Se ha presentado un error de SQL'] } } };
            reject(response);
          });
        }
      }).catch(() => {
        const response = { status: 500, data: { message: 'Error al crear tiquet', errors: { sql: ['Se ha presentado un error de SQL'] } } };
        reject(response);
      });
    });
  }
}

async function updateTiquet (data) {
  const dataBase = openDatabase('dbNovum', '1.0', 'Novum Database', 3 * 1024 * 1024);
  const websqlPromise = websql(dataBase);
  if (!dataBase) {
    alert('Lo sentimos, algo fue mal en la conexion de la base de datos local');
  } else {
    return await new Promise((resolve, reject) => {
      websqlPromise.transaction((tx) => {
        tx.executeSql(('SELECT * FROM tiquet ' +
                        'WHERE CASE ' +
                          'WHEN "' + data.type + '" = "D" THEN referral_number = "' + data.referral_number + '" AND type <> "R" ' +
                          'WHEN "' + data.type + '" = "V" OR (("' + data.type + '" = "OC" OR "' + data.type + '" = "OP") AND "' + data.operation + '" = "P") THEN referral_number = "' + data.referral_number + '" ' +
                          'WHEN "' + data.type + '" = "C" OR "' + data.type + '" = "R" OR (("' + data.type + '" = "OC" OR "' + data.type + '" = "OP") AND "' + data.operation + '" = "D") THEN receipt_number = "' + data.receipt_number + '" ' +
                        'END ' +
                        'AND id <> ?'), [data.id]);
      }).then((results) => {
        if (results[0].rows.length > 0) {
          const response = { status: 500, data: { message: 'Error al eliminar tiquet', errors: { sql: ['Ya existe un tiquet con el número de ' + (data.type === 'D' || data.type === 'V' || ((data.type === 'OC' || data.type === 'OP') && data.operation === 'P') ? 'remisión' : 'recibo') + ' ingresado'] } } };
          reject(response);
        } else {
          websqlPromise.transaction((tx) => {
            tx.executeSql('UPDATE tiquet SET type = ?, ' +
                                  'operation = ?, ' +
                                  'user = ?, ' +
                                  'origin_yard = ?, ' +
                                  'destiny_yard = ?, ' +
                                  'supplier = ?, ' +
                                  'customer = ?, ' +
                                  'material = ?, ' +
                                  'ash_percentage = ?, ' +
                                  'receipt_number = ?, ' +
                                  'referral_number = ?, ' +
                                  'date = ?, ' +
                                  'time = ?, ' +
                                  'license_plate = ?, ' +
                                  'trailer_number = ?, ' +
                                  'driver_document = ?, ' +
                                  'driver_name = ?, ' +
                                  'gross_weight = ?, ' +
                                  'tare_weight = ?, ' +
                                  'net_weight = ?, ' +
                                  'conveyor_company = ?, ' +
                                  'observation = ?, ' +
                                  'seals = ?, ' +
                                  'round_trip = ?, ' +
                                  'synchronize = ? ' +
                          'WHERE id = ?', [
              data.type, data.operation, data.user, data.origin_yard, data.destiny_yard, data.supplier, data.customer,
              data.material, data.ash_percentage, data.receipt_number, data.referral_number, data.date, data.time, data.license_plate,
              data.trailer_number, data.driver_document, data.driver_name, data.gross_weight, data.tare_weight, data.net_weight, data.conveyor_company,
              data.observation, data.seals, data.round_trip, 1, data.id
            ]);
          }).then(() => {
            const response = { status: 200, data: { message: 'Tiquet actualizado con éxito' } };
            resolve(response);
          }).catch(() => {
            const response = { status: 500, data: { message: 'Error al actualizar tiquet', errors: { sql: ['Se ha presentado un error de SQL'] } } };
            reject(response);
          });
        }
      }).catch(() => {
        const response = { status: 500, data: { message: 'Error al actualizar tiquet', errors: { sql: ['Se ha presentado un error de SQL'] } } };
        reject(response);
      });
    });
  }
}

async function deleteTiquet (id) {
  const dataBase = openDatabase('dbNovum', '1.0', 'Novum Database', 3 * 1024 * 1024);
  const websqlPromise = websql(dataBase);
  if (!dataBase) {
    alert('Lo sentimos, algo fue mal en la conexion de la base de datos local');
  } else {
    return await new Promise((resolve, reject) => {
      websqlPromise.transaction((tx) => {
        tx.executeSql(('SELECT id, synchronized FROM tiquet WHERE id = ?'), [id]);
      }).then((results) => {
        let sql = '';
        if (results[0].rows.length > 0 && results[0].rows[0].synchronized === 1) {
          sql = 'UPDATE tiquet SET deleted = 1, synchronize = 1 WHERE id = ?';
        } else {
          sql = 'DELETE FROM tiquet WHERE id = ?';
        }
        websqlPromise.transaction((tx) => {
          tx.executeSql((sql), [id]);
        }).then(() => {
          const response = { status: 200, data: { message: 'Tiquet eliminado con éxito' } };
          resolve(response);
        }).catch(() => {
          const response = { status: 500, data: { message: 'Error al eliminar tiquet', errors: { sql: ['Se ha presentado un error de SQL'] } } };
          reject(response);
        });
      }).catch(() => {
        const response = { status: 500, data: { message: 'Error al eliminar tiquet', errors: { sql: ['Se ha presentado un error de SQL'] } } };
        reject(response);
      });
    });
  }
}

async function getYards (data) {
  // const response = { status: '200', data: { message: 'Tiquet creado con éxito' } };
  const dataBase = openDatabase('dbNovum', '1.0', 'Novum Database', 3 * 1024 * 1024);
  const websqlPromise = websql(dataBase);
  if (!dataBase) {
    alert('Lo sentimos, algo fue mal en la conexion de la base de datos local');
  } else {
    return await new Promise((resolve, reject) => {
      const text = '%' + (data?.text ? data.text : '') + '%';
      const yard = (data?.yard ? data.yard : 0);
      const excludedYard = (data?.excluded_yard ? data.excluded_yard : 0);
      websqlPromise.transaction((tx) => {
        tx.executeSql(('SELECT id, code, name FROM yard WHERE (code LIKE ? OR name LIKE ?) AND id <> ? AND id <> ? ' +
                      'UNION ' +
                      'SELECT id, code, name FROM yard WHERE id = ?'), [text, text, yard, excludedYard, yard]);
      }).then((results) => {
        const result = [];
        for (let i = 0; i < results[0].rows.length; i++) {
          result.push(results[0].rows[i]);
        }
        const response = { status: 200, data: result };
        resolve(response);
      }).catch(() => {
        const response = { status: 500, data: { message: 'Error al obtener patios', errors: { sql: ['Se ha presentado un error de SQL'] } } };
        reject(response);
      });
    });
  }
}

async function getThirds (data) {
  const dataBase = openDatabase('dbNovum', '1.0', 'Novum Database', 3 * 1024 * 1024);
  const websqlPromise = websql(dataBase);
  if (!dataBase) {
    alert('Lo sentimos, algo fue mal en la conexion de la base de datos local');
  } else {
    return await new Promise((resolve, reject) => {
      const text = '%' + (data?.text ? data.text : '') + '%';
      const third = data?.third ? data.third : 0;
      const sqlText = ' AND ' + data.type + ' = ? ';
      websqlPromise.transaction((tx) => {
        tx.executeSql(('SELECT id, (nit||" / "||name) name FROM third WHERE (nit LIKE ? OR name LIKE ?) AND id <> ?' + sqlText +
                      'UNION ' +
                      'SELECT id, (nit||" / "||name) name FROM third WHERE id = ?'), [text, text, third, 1, third]);
      }).then((results) => {
        const result = [];
        for (let i = 0; i < results[0].rows.length; i++) {
          result.push(results[0].rows[i]);
        }
        const response = { status: 200, data: result };
        resolve(response);
      }).catch(() => {
        const response = { status: 500, data: { message: 'Error al obtener tercero', errors: { sql: ['Se ha presentado un error de SQL'] } } };
        reject(response);
      });
    });
  }
}

async function getMaterials (data) {
  const dataBase = openDatabase('dbNovum', '1.0', 'Novum Database', 3 * 1024 * 1024);
  const websqlPromise = websql(dataBase);
  if (!dataBase) {
    alert('Lo sentimos, algo fue mal en la conexion de la base de datos local');
  } else {
    return await new Promise((resolve, reject) => {
      const text = '%' + (data?.text ? data.text : '') + '%';
      const material = data?.material ? data.material : 0;
      websqlPromise.transaction((tx) => {
        tx.executeSql(('SELECT id, code, name FROM material WHERE (code LIKE ? OR name LIKE ?) AND id <> ? ' +
                      'UNION ' +
                      'SELECT id, code, name FROM material WHERE id = ?'), [text, text, material, material]);
      }).then((results) => {
        const result = [];
        for (let i = 0; i < results[0].rows.length; i++) {
          result.push(results[0].rows[i]);
        }
        const response = { status: 200, data: result };
        resolve(response);
      }).catch(() => {
        const response = { status: 500, data: { message: 'Error al obtener material', errors: { sql: ['Se ha presentado un error de SQL'] } } };
        reject(response);
      });
    });
  }
}

export {
  setDataToLocale,
  getNotSynchronizedTiquets,
  getTiquet,
  getTiquets,
  deleteTiquet,
  insertTiquet,
  updateTiquet,
  getYards,
  getThirds,
  getMaterials
};
