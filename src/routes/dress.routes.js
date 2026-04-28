import express from "express";
import {
  getDresses,
  createDress,
  updateDress,
  deleteDress,
  deleteDressImage,
} from "../controllers/dress.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

/* =====================================
   ✅ PUBLIC ROUTES
   ===================================== */
router.get("/", getDresses);

/* =====================================
   ✅ CREATE VALIDATORS (STRICT)
   ===================================== */
const createDressValidators = [
  body("name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

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
const updateDressValidators = [
  body("name")
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

// ✅ CREATE dress (single / multiple images)
router.post(
  "/",
  authMiddleware,
  adminOnly,
  createDressValidators,
  runValidation,
  createDress
);

// ✅ UPDATE dress (append / replace images, edit fields)
router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  updateDressValidators,
  runValidation,
  updateDress
);

// ✅ DELETE specific image
router.delete(
  "/:id/image",
  authMiddleware,
  adminOnly,
  deleteDressImage
);

// ✅ DELETE entire dress (and all images)
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  deleteDress
);

export default router;