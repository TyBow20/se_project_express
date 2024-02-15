const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("connected to mongo");
  },
  (e) => {
    console.log("error connecting to mongo", e);
  },
);

app.use(cors());
const routes = require("./routes");

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log("hello");
});
