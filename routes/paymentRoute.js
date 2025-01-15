import express from "express";
import { subPayCreateController, subPayOrderRazorController } from "../controllers/subscription/subscriptionPaymentController.js";

const router = express.Router();

router.post("/createOrder",subPayCreateController)
router.post("/subPayOrder",subPayOrderRazorController)

export default router;
