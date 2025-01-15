import { isValidObjectId } from "mongoose";
import subPlan from "../../models/subscription//subsCriptionPlanModel.js"

export const subPlanCreateController = async (req, res) => {
    try {
        
        const { planName, description, duration, price, planStatus } = req.body;
        const requiredField = ["planName", "description", "duration", "price", "planStatus"];

        const missingField = [];
        for (const field of requiredField) {
            if (!req.body[field]) {
                missingField.push(field);
            }
        }


        if (missingField.length > 0) {
            return res.send({ success: false, message: "All fields are required", missingField });
        }

        const ex = await subPlan.findOne({ planName });
        if (ex) {
            return res.send({ success: false, message: "This plan already exists. Try with another name." });
        }

        const plan = await subPlan.create({
            planName, description, duration, price, planStatus
        });
        if (plan) {
            return res.send({ success: true, message: "Subscription Plan Created Successfully.", plan });
        }
    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: error.message, error });
    }
};

export const subPlanGetAllController = async (req, res) => {
    try {
        const plan = await subPlan.find({});
        if (plan) {
            return res.send({ success: true, message: "Found all Subscription Plans successfully.", plan });
        }
    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: error.message, error });
    }
};

export const subPlanUpdateController = async (req, res) => {
    try {
        const { _id } = req.params;
        const { planName, ...updateData } = req.body; 

      
        if (!isValidObjectId(_id)) {
            return res.send({ success: false, message: "Invalid subscription ID", _id });
        }

       
        const existingPlan = await subPlan.findById(_id);
        if (!existingPlan) {
            return res.send({ success: false, message: "Subscription Plan not found." });
        }

        
        if (planName && planName !== existingPlan.planName) {
            return res.send({ success: false, message: "Plan name cannot be changed." });
        }

      
        const requiredField = ["description", "duration", "price", "planStatus"];
        const missingField = [];
        for (const field of requiredField) {
            if (!updateData[field]) {
                missingField.push(field);
            }
        }

        if (missingField.length > 0) {
            return res.send({ success: false, message: "All fields are required", missingField });
        }

    
        const updatedPlan = await subPlan.findByIdAndUpdate(_id, updateData, { new: true });

        if (updatedPlan) {
            return res.send({ success: true, message: "Subscription Plan updated successfully.", plan: updatedPlan });
        } else {
            return res.send({ success: false, message: "Subscription Plan not found." });
        }
    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: error.message, error });
    }
};
export const subPlanDeleteController = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!isValidObjectId(_id)) {
            return res.send({ success: false, message: "Invalid subscription ID", _id });
        }

        const ex = await subPlan.findById(_id);
        if (!ex) {
            return res.send({ success: false, message: "Provided Subscription Plan does not exist." });
        }

        const plan = await subPlan.findByIdAndDelete(_id);
        if (plan) {
            return res.send({ success: true, message: "Subscription Plan deleted successfully.", plan });
        }
    } catch (error) {
        console.log(error);
        return res.send({ success: false, message: error.message, error });
    }
};

export const subPlanGetSingleController = async(req,res)=>{
    try {

        const {_id}=req.params;
        const plan = await subPlan.findById(_id);
        if(plan){
            return res.send({success:true,message:"single subscription plan found successfully",plan})
        }
        
    } catch (error) {

        console.log(error)
      
        return res.send({success:false,message:"error.message",error})
        
    }
}
