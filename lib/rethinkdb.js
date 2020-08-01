"use strict";

const r = require("rethinkdb");
const dbconfig = require("../config/database.js");

/*
 * Create a RethinkDB connection, and save it in req._rdbConn
 */
const connection = async (req, res, next) => {
  await r.connect(dbconfig).then((conn) => {
    req._rdbConn = conn;
    next();
  }).error((res) => {
    return (error) => {
      res.send(500, { error: error.message });
    };
  });
};

/*
* Close the RethinkDB connection
*/
const closeConnection = async (req, res, next) => {
  await req._rdbConn.close();
};

module.exports = {
  connection,
  closeConnection,
};
