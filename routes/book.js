const { Router } = require("express");
const router = Router();

// rethinkdb
const r = require("rethinkdb");
const { databaseName, tableName } = require("../lib/rethinkdb.js");

/* get all books */
router.get("/", async (req, res) => {
  await r.db(databaseName).table(tableName)
    .orderBy(r.desc("id"))
    .run(req._rdbConn)
    .then((result) => {
      // logic if you want to set
      res.json(result);
    })
    .catch((error) => console.log(error));
});

/* get single book */
router.get("/:book_id", async (req, res) => {
  let book_id = req.params.book_id;

  await r.db(databaseName).table(tableName)
    .get(book_id)
    .run(req._rdbConn)
    .then((result) => {
      // logic if you want to set
      res.json(result);
    })
    .catch((error) => console.log(error));
});

/* add book */
router.post("/", async (req, res) => {
  let book = req.body;

  await r.db(databaseName).table(tableName)
    .insert(book)
    .run(req._rdbConn)
    .then((result) => {
      if (result.inserted !== 1) {
        console.log("Document was not inserted.");
      } else {
        res.send(result);
      }
    })
    .catch((error) => console.log(error));

  // res
  let data = {
    "success": true,
    "message": "Book successfully added",
  };
  res.json(data);
});

// update book
router.put("/:book_id", async (req, res) => {
  let book_id = req.params.book_id;

  await r.db(databaseName).table(tableName)
    .get(book_id)
    .update({
      "book": req.body.libro,
      "author": req.body.author,
    })
    .run(req._rdbConn)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => console.log(error));

  // res
  let data = {
    "success": true,
    "message": "Book successfully updated",
  };
  res.json(data);
});

// delete book
router.delete("/:book_id", async (req, res) => {
  let book_id = req.params.book_id;

  await r.db(databaseName).table(tableName)
    .get(book_id)
    .delete()
    .run(req._rdbConn)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => console.log(error));

  // res
  let data = {
    "success": true,
    "message": "Book successfully deleted",
  };
  res.json(data);
});

module.exports = router;
