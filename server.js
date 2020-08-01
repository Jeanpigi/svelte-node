const express = require("express");
const app = express();
const logger = require("morgan");
require("dotenv").config();

// rethinkdb
const connect = require("./lib/rethinkdb.js");
const index = require("./routes/index.js");
const book = require("./routes/book.js");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// open rdb conn
app.use(connect.connection);

app.use("/", index);
app.use("/api/books", book);

// Close rdb conn
app.use(connect.closeConnection);

const port = 3000;

app.listen(port, () => console.log(`express is running at port ${port}`));
