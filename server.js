const express = require("express"),
  path = require("path"),
  bodyParse = require("body-parser"),
  morgan = require("morgan"),
  cors = require("cors"),
  app = express();

require("dotenv").config();

// rethinkdb
const connect = require("./lib/rethinkdb.js");
const book = require("./routes/book.js");

app.use(morgan("tiny"));
app.use(bodyParse.json());
app.use(cors());

// open rdb conn
app.use(connect.connection);

app.use("/api/books", book);

// Close rdb conn
app.use(connect.closeConnection);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

const port = 3000;

app.listen(port, () => console.log(`express is running at port ${port}`));
