import express from "express";

import {
  createInventorySubCategoryController,
  deleteInventorySubCategoryController,
  manageInventorySubCategoryController,
  updateInventorySubCategoryController,
} from "../controllers/InventorySubCategoryController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post(
  "/createSubCategory",
  requireSignIn,
  createInventorySubCategoryController
);
router.get(
  "/getSubCategory/:_id",
  requireSignIn,
  manageInventorySubCategoryController
);
router.delete(
  "/deleteSubCategory/:_id",
  requireSignIn,
  deleteInventorySubCategoryController
);
router.put(
  "/updtaeSubCategory/:_id",
  requireSignIn,
  updateInventorySubCategoryController
);
export default router;
