import express from "express";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  deleteBookImage,
} from "../controllers/book.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

/* =====================================
   ✅ PUBLIC ROUTES
   ===================================== */
router.get("/", getBooks);

/* =====================================
   ✅ CREATE VALIDATORS (STRICT)
   ===================================== */
const createBookValidators = [
  body("title")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("price")
    .isNumeric()
    .withMessage("Price must be a number"),

  body("type")
    .optional({ checkFalsy: true })
    .isIn(["direct", "partner"])
    .withMessage("Invalid type"),

  body("affiliate_link")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("affiliate_link must be a valid URL"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array"),

  body("images.*")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Each image must be a valid URL"),
];

/* =====================================
   ✅ UPDATE VALIDATORS (FLEXIBLE)
   ===================================== */
const updateBookValidators = [
  body("title")
    .optional()
    .isString()
    .trim(),

  body("price")
    .optional()
    .isNumeric(),

  body("type")
    .optional()
    .isIn(["direct", "partner"]),

  body("affiliate_link")
    .optional({ checkFalsy: true })
    .isURL(),

  body("replaceImages")
    .optional()
    .isBoolean(),

  body("images")
    .optional()
    .isArray(),

  body("images.*")
    .optional({ checkFalsy: true })
    .isURL(),
];

/* =====================================
   ✅ VALIDATION HANDLER
   ===================================== */
function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
}

/* =====================================
   ✅ ADMIN ROUTES
   ===================================== */

// ✅ CREATE book (single / multiple images)
router.post(
  "/",
  authMiddleware,
  adminOnly,
  createBookValidators,
  runValidation,
  createBook
);

// ✅ UPDATE book (append / replace images, edit fields)
router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  updateBookValidators,
  runValidation,
  updateBook
);

// ✅ DELETE specific image
router.delete(
  "/:id/image",
  authMiddleware,
  adminOnly,
  deleteBookImage
);

// ✅ DELETE entire book (and all images)
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  deleteBook
);

export default router;