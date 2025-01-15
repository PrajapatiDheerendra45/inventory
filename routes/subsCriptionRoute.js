import express from "express";
import { subPlanCreateController, subPlanDeleteController, subPlanGetAllController, subPlanGetSingleController, subPlanUpdateController } from "../controllers/subscription/subscriptionController.js";
import { isAdmin, requireSignIn,isSuperAdmin } from "../middleware/authMiddleware.js";
import { getCurrentPlanController } from "../controllers/userSubscriptionController.js";



const router = express.Router();

router.post("/create",requireSignIn, isSuperAdmin,subPlanCreateController)
router.get("/all",subPlanGetAllController)
router.get("/single/:_id",subPlanGetSingleController)
router.put("/update/:_id", requireSignIn,isSuperAdmin,subPlanUpdateController)
router.delete("/delete/:_id",  requireSignIn,isSuperAdmin,subPlanDeleteController)
    



// for user panel getting and fetching single and all subscription detail 
router.get("/allPlan/:id",getCurrentPlanController)


export default router;
