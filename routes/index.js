const { Router } = require("express");
const router = Router();

// rethinkdb
const r = require("rethinkdb");
const { databaseName, tableName } = require("../lib/rethinkdb.js");

/* create database and table */
router.get("/", (req, res) => {
  if (databaseName) {
    // create db
    r.dbCreate(databaseName).run(req._rdbConn).then(() =>
      console.log(`DataBase ${databaseName} was created`)
    ).error((res) => {
      return (error) => {
        res.send(500, { error: error.message });
      };
    });
  }
  if (tableName) {
    // create table
    r.db(databaseName).tableCreate(tableName).run(req._rdbConn).then(() =>
      console.log(`table ${tableName} was created`)
    ).error((res) => {
      return (error) => {
        res.send(500, { error: error.message });
      };
    });
  } else {
    console.log(
      `database ${databaseName} and table ${tableName} already exist`,
    );
  }
});

module.exports = router;
