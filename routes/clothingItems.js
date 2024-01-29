const router = require("express").Router();

const {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CREATE
router.post("/", createItem);

// READ
router.get("/", getItems);

// UPDATE

// router.put("/:id", updateItem);

// DELETE
router.delete("/:id", deleteItem);

// LIKE an item
router.put("/:id/likes", likeItem);

// UNLIKE an item
router.delete("/:id/likes", dislikeItem);

module.exports = router;
