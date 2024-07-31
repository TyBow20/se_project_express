// const ClothingItem = require("../models/clothingItem");
// const ERROR_CODES = require("../utils/errors");

// const createItem = (req, res, next) => {
//   const { name, weather, imageUrl } = req.body;

//   const newItem = {
//     name,
//     weather,
//     imageUrl,
//     owner: req.user._id,
//     likes: [],
//     createdAt: Date.now(),
//   };

//   ClothingItem.create(newItem)
//     .then((item) => {
//       res.send({ data: item });
//     })
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         err.statusCode = ERROR_CODES.INVALID_DATA;
//         err.message = "Invalid data passed";
//       } else {
//         err.statusCode = ERROR_CODES.SERVER_ERROR;
//         err.message = "Error creating item";
//       }
//       next(err);
//     });
// };

// const getItems = (req, res, next) => {
//   ClothingItem.find()
//     .then((items) => {
//       res.send(items);
//     })
//     .catch((err) => {
//       err.statusCode = ERROR_CODES.SERVER_ERROR;
//       err.message = "An error has occurred";
//       next(err);
//     });
// };

// const deleteItem = (req, res, next) => {
//   const { id } = req.params;

//   ClothingItem.findById(id)
//     .then((item) => {
//       if (!item) {
//         const error = new Error("Item not found");
//         error.statusCode = ERROR_CODES.NOT_FOUND;
//         throw error;
//       }

//       if (item.owner.toString() !== req.user._id.toString()) {
//         const error = new Error("Not authorized to delete this item");
//         error.statusCode = ERROR_CODES.FORBIDDEN;
//         throw error;
//       }

//       return item.remove().then(() => {
//         res.status(200).send({ message: "Item deleted successfully" });
//       });
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         err.statusCode = ERROR_CODES.INVALID_DATA;
//         err.message = "Invalid ID format";
//       } else {
//         err.statusCode = ERROR_CODES.SERVER_ERROR;
//         err.message = "Error deleting item";
//       }
//       next(err);
//     });
// };

// const likeItem = (req, res, next) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.id,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(new Error("DocumentNotFoundError"))
//     .then((item) => res.json(item))
//     .catch((err) => {
//       if (err.message === "DocumentNotFoundError") {
//         err.statusCode = ERROR_CODES.NOT_FOUND;
//         err.message = "Item not found";
//       } else if (err.name === "CastError") {
//         err.statusCode = ERROR_CODES.INVALID_DATA;
//         err.message = "Invalid ID format";
//       } else {
//         err.statusCode = ERROR_CODES.SERVER_ERROR;
//         err.message = "An error occurred";
//       }
//       next(err);
//     });
// };

// const dislikeItem = (req, res, next) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.id,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(new Error("DocumentNotFoundError"))
//     .then((item) => res.json(item))
//     .catch((err) => {
//       if (err.message === "DocumentNotFoundError") {
//         err.statusCode = ERROR_CODES.NOT_FOUND;
//         err.message = "Item not found";
//       } else if (err.name === "CastError") {
//         err.statusCode = ERROR_CODES.INVALID_DATA;
//         err.message = "Invalid ID format";
//       } else {
//         err.statusCode = ERROR_CODES.SERVER_ERROR;
//         err.message = "An error occurred";
//       }
//       next(err);
//     });
// };

// module.exports = {
//   createItem,
//   getItems,
//   // updateItem, code not needed for this project
//   deleteItem,
//   likeItem,
//   dislikeItem,
// };

const ClothingItem = require("../models/clothingItem");
const {
  // ERROR_CODES,
  NotFoundError,
  ForbiddenError,
  InvalidDataError,
  ServerError,
} = require("../errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  const newItem = {
    name,
    weather,
    imageUrl,
    owner: req.user._id,
    likes: [],
    createdAt: Date.now(),
  };

  ClothingItem.create(newItem)
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new InvalidDataError("Invalid data passed"));
      } else {
        next(new ServerError("Error creating item"));
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find()
    .then((items) => {
      res.send(items);
    })
    .catch(() => {
      next(new ServerError("An error has occurred"));
    });
};

const deleteItem = (req, res, next) => {
  const { id } = req.params;

  ClothingItem.findById(id)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      if (item.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError("Not authorized to delete this item");
      }

      return item.remove().then(() => {
        res.status(200).send({ message: "Item deleted successfully" });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new InvalidDataError("Invalid ID format"));
      } else if (err.statusCode) {
        next(err);
      } else {
        next(new ServerError("Error deleting item"));
      }
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new InvalidDataError("Invalid ID format"));
      } else if (err.statusCode) {
        next(err);
      } else {
        next(new ServerError("An error occurred"));
      }
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new InvalidDataError("Invalid ID format"));
      } else if (err.statusCode) {
        next(err);
      } else {
        next(new ServerError("An error occurred"));
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
