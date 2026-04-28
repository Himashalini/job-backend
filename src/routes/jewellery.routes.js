import express from "express";
import {
  getJewellery,
  createJewellery,
  updateJewellery,
  deleteJewellery,
  deleteJewelleryImage,
} from "../controllers/jewellery.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

/* =====================================
   ✅ PUBLIC ROUTES
   ===================================== */
router.get("/", getJewellery);

/* =====================================
   ✅ CREATE VALIDATORS (STRICT)
   ===================================== */
const createJewelleryValidators = [
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
const updateJewelleryValidators = [
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

// ✅ CREATE jewellery (single / multiple images)
router.post(
  "/",
  authMiddleware,
  adminOnly,
  createJewelleryValidators,
  runValidation,
  createJewellery
);

// ✅ UPDATE jewellery (append / replace images, edit fields)
router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  updateJewelleryValidators,
  runValidation,
  updateJewellery
);

// ✅ DELETE specific image
router.delete(
  "/:id/image",
  authMiddleware,
  adminOnly,
  deleteJewelleryImage
);

// ✅ DELETE entire jewellery (and all images)
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  deleteJewellery
);

export default router;