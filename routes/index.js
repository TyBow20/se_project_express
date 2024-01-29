// const router = require("express").Router();
// const users = require("./users");

// const clothingItem = require("./clothingItems");

// router.use("/items", clothingItem);

// router.use((req, res) => {
//   res.status(500).send({ message: "Route not found!" });
// });

// module.exports = router;

// old code

const router = require("express").Router();

const clothingItem = require("./clothingItems");
const users = require("./users");

const ERROR_CODES = {
  INVALID_DATA: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

router.use("/items", clothingItem);
router.use("/users", users);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: "Route not found!" });
});

module.exports = router;
