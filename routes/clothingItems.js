const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

//CREATE
router.post("/", createItem);

//READ
router.get("/", getItems);

//UPDATE

router.put("/:id", updateItem);

//DELETE
router.delete("/:id", deleteItem);

module.exports = router;
