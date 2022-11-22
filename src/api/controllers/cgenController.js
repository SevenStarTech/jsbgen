//var util = require('util');

exports.get_columns = function(req, res) {
  if (req.query.table && req.query.connect) {
    //console.log("FOUND TABLE: " + req.query.table + "\n\n");

    const { Pool, Client } = require('pg');

    let connect = req.query.connect; //postgres:postpost@localhost:5432/convergeplanningdb
    let a1 = connect.split('@');
    let a1a = a1[0].split(':');
    let a1b = a1[1].split('/');
    let a1b1 = a1b[0].split(':');
    let user = a1a[0];
    let pword = a1a[1];
    let host = a1b1[0];
    let port = a1b1[1];
    let db = a1b[1];
    // console.log(connect) + '\n';
    // console.log(user) + '\n';
    // console.log(pword) + '\n';
    // console.log(host) + '\n';
    // console.log(port) + '\n';
    // console.log(db) + '\n';

    const pool = new Pool({
      user: user,
      password: pword,
      host: host,
      port: port,
      database: db,
      //curentSchema: 'offerboard',
      //schema: 'offerboard',
    });

    //const client = new Client();
    //client.connect();
    //client.query("SELECT $1::text as message", ["Hello world!"], (err, res) => {
    // let sql =
    //   "SELECT c.table_catalog, c.table_name, c.column_name, c.ordinal_position, c.is_nullable, c.column_default, c.udt_name, c.character_maximum_length, c.is_identity, (SELECT (case when count(*) = 1 then 'YES' else 'NO' end) as primary " +
    //   "FROM information_schema.table_constraints t, information_schema.key_column_usage k " +
    //   "WHERE t.table_name = '" +
    //   req.query.table +
    //   "' and t.constraint_type='PRIMARY KEY' " +
    //   "  and k.table_name = '" +
    //   req.query.table +
    //   "' and k.constraint_name=t.constraint_name " +
    //   "  and k.column_name = c.column_name) as primary " +
    //   "FROM information_schema.columns c WHERE table_schema = 'public' AND table_name = '" +
    //   req.query.table +
    //   "'";

    //"SELECT name from plan_job"

    let sql =
      "SELECT c.table_catalog, c.table_name, c.column_name, c.ordinal_position, c.is_nullable, c.column_default, c.udt_name, c.character_maximum_length, c.is_identity, (SELECT (case when count(*) = 1 then 'YES' else 'NO' end) as primary " +
      'FROM information_schema.table_constraints t, information_schema.key_column_usage k ' +
      "WHERE t.table_name = $1 and t.constraint_type='PRIMARY KEY' " +
      '  and k.table_name = $1 and k.constraint_name=t.constraint_name ' +
      '  and k.column_name = c.column_name) as primary ' +
      'FROM information_schema.columns c WHERE table_name = $1 '; //AND table_schema = 'offerboard'

    // let sql =
    //   "SELECT c.table_catalog, c.table_name, c.column_name, c.ordinal_position, c.is_nullable, c.column_default, c.udt_name, c.character_maximum_length, c.is_identity, (SELECT (case when count(*) = 1 then 'YES' else 'NO' end) as primary " +
    //   'FROM information_schema.table_constraints t, information_schema.key_column_usage k ' +
    //   "WHERE t.table_name = $1 and t.constraint_type='PRIMARY KEY' " +
    //   '  and k.table_name = $1 and k.constraint_name=t.constraint_name ' +
    //   '  and k.column_name = c.column_name) as primary ' +
    //   'FROM information_schema.columns c '; // WHERE table_name = $1'; // AND table_schema = 'offerboard'

    pool.query(sql, [req.query.table], (err, data) => {
      if (err) {
        res.send(err);
      } else {
        //console.log("GOT DATA: " + data.rows[0].column_name + "\n\n");
        let responseData = data.rows;
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Content-Type, Accept, X-Requested-With, remember-me',
        );
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        //res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        res.setHeader('Referrer-Policy', 'unsafe-url'); // "strict-origin-when-cross-origin""
        res.json(responseData);
      }
      pool.end();
    });
  }
  //console.log("GOT HERE!" + util.inspect(req));

  // Task.find({}, function(err, task) {
  //   if (err)
  //     res.send(err);
  //   res.json(task);
  // });
};