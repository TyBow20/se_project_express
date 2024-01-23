const router = require("express").Router();
const clothingItem = require("./clothingItems");

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(500).send("Route not found!");
});

module.exports = router;
