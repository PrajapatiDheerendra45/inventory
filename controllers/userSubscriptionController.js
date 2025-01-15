import subscriptionModel from "../models/subscription/subscriptionModel.js";

export const getCurrentPlanController = async(req,res)=>{
    try {

        const currentPlan = await subscriptionModel.find({ customer: req.params.id }).sort({ createdAt: -1 });

      
        res.json(currentPlan)
    } catch (error) {
        console.log(error)
        return res.status(500).send({success:false,message:error.message})
    }
}