const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CREATE
router.post("/", auth, createItem);

// READ
router.get("/", getItems);

// UPDATE

// router.put("/:id", updateItem);

// DELETE
router.delete("/:id", auth, deleteItem);

// LIKE an item
router.put("/:id/likes", auth, likeItem);

// UNLIKE an item
router.delete("/:id/likes", auth, dislikeItem);

module.exports = router;
