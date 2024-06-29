// const router = require("express").Router();
// const auth = require("../middlewares/auth");
// const {
//   createItem,
//   getItems,
//   deleteItem,
//   likeItem,
//   dislikeItem,
// } = require("../controllers/clothingItems");

// // CREATE
// router.post("/", auth, createItem);

// // READ
// router.get("/", getItems);

// // UPDATE

// // router.put("/:id", updateItem);

// // DELETE
// router.delete("/:id", auth, deleteItem);

// // LIKE an item
// router.put("/:id/likes", auth, likeItem);

// // UNLIKE an item
// router.delete("/:id/likes", auth, dislikeItem);

// module.exports = router;

//new code

// routes/clothingItem.js

const express = require("express");
const {
  createItemValidation,
  idValidation,
} = require("../middlewares/validation");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", getItems);

router.use(auth);
router.post("/", createItemValidation, createItem);
router.delete("/:id", idValidation, deleteItem);
router.put("/:id/likes", idValidation, likeItem);
router.delete("/:id/likes", idValidation, dislikeItem);

module.exports = router;
