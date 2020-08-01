const { Router } = require("express");
const router = Router();

// rethinkdb
const r = require("rethinkdb");
let databaseName = process.env.DB_NAME;
let tableName = "books"; // set table name

//search database and table
const searchDatabase = r.db(databaseName);
const searchTable = searchDatabase.table(tableName);

/* get all books */
router.get("/", async (req, res) => {
  if (!searchDatabase) {
    // create db
    await r.dbCreate(databaseName).run(req._rdbConn).then(() => {
      console.log(`table ${tableName} was created`);
    }).error((res) => {
      return (error) => {
        res.send(500, { error: error.message });
      };
    });
  }

  if (!searchTable) {
    // create table
    await searchDatabase.tableCreate(tableName).run(req._rdbConn).then(() => {
      console.log(`table ${tableName} was created`);
    }).error((res) => {
      return (error) => {
        res.send(500, { error: error.message });
      };
    });
  }

  try {
    const libros = await searchTable.orderBy("id").run(req._rdbConn);

    if (!libros) {
      throw new Error("There are not books");
    }
    res.status(200).json(libros);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* get single book */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const book = await searchTable.get(id).run(
      req._rdbConn,
    );
    if (!book) {
      throw new Error("There is not book");
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* add book */
router.post("/", async (req, res) => {
  let book = req.body;

  try {
    const libro = await searchTable.insert(book)
      .run(req._rdbConn);
    if (!libro) {
      throw new Error("There was an error saving the book");
    }
    res.status(200).json({
      "success": true,
      "message": "Book successfully added",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update book
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const libro = await searchTable.get(id);
    if (!libro) {
      throw new Error("No found the book");
    }

    const updateBook = await libro.update(req.body).run(req._rdbConn);
    if (!updateBook) {
      throw new Error("There was a prolem updating the book");
    }
    res.status(200).json({
      "success": true,
      "message": "Book successfully updated",
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// delete book
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const libro = await searchTable.get(id);
    if (!libro) {
      throw new Error("No found the book");
    }
    const removed = await libro.delete()
      .run(req._rdbConn);
    if (!removed) {
      throw new Error("There was a problem deleting the book");
    }
    res.status(200).json({
      "success": true,
      "message": "Book successfully deleted",
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
