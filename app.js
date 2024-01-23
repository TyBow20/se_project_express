const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to mongo");
  },
  (e) => {
    console.log("error connecting to mongo", e);
  },
);

const routes = require("./routes");
app.use(routes);
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log("hello");
});
