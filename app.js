// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const { PORT = 3001 } = process.env;
// const app = express();

// mongoose.connect(
//   "mongodb://127.0.0.1:27017/wtwr_db",
//   () => {
//     console.log("connected to mongo");
//   },
//   (e) => {
//     console.log("error connecting to mongo", e);
//   },
// );

// app.use(cors());
// const routes = require("./routes");

// app.use(express.json());
// app.use(routes);

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
//   console.log("hello");
// });

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const { PORT = 3001 } = process.env;
// const app = express();

// mongoose.connect(
//   "mongodb://127.0.0.1:27017/wtwr_db",
//   () => {
//     console.log("connected to mongo");
//   },
//   (e) => {
//     console.log("error connecting to mongo", e);
//   },
// );

// app.use(cors());
// const routes = require("./routes");

// app.use(express.json());
// app.use(routes);

// // updated
// const errorHandler = require("./middlewares/errorHandler.js");
// app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
//   console.log("hello");
// });

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const { errors } = require("celebrate");
// const errorHandler = require("./middlewares/error-handler");

// const { PORT = 3001 } = process.env;
// const app = express();

// mongoose.connect(
//   "mongodb://127.0.0.1:27017/wtwr_db",
//   () => {
//     console.log("connected to mongo");
//   },
//   (e) => {
//     console.log("error connecting to mongo", e);
//   },
// );

// app.use(cors());
// const routes = require("./routes");

// app.use(express.json());
// app.use(routes);

// // Celebrate error handler
// app.use(errors());

// // Custom error handler
// app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
//   console.log("hello");
// });

// winston new code
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

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

// Enable the request logger before all route handlers
app.use(requestLogger);

app.use(routes);

// Enable the error logger after the route handlers and before the error handlers
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log("hello");
});
