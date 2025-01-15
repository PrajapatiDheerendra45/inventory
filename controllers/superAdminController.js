import subscriptionModel from "../models/subscription/subscriptionModel.js";
import userModel from "../models/userModel.js";

export const getAllUserController = async (req, res) => {
    try {
        const users = await userModel.find({ role: 1 });
        if (users.length === 0) {
            return res.send({ success: false, message: "No users found" });
        }

        return res.status(200).send({ success: true, users ,message:"Users found successfully"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: error.message });
    }
};

export const activeUserController = async(req,res)=>{
   try {
    const users = await userModel.find({ role: 1,status:"Active" });
  
        if (users.length === 0) {
            return res.send({ success: false, message: "No users found" });
        }

        return res.status(200).send({ success: true, users ,message:"Users found successfully"});
        
   } catch (error) {
    console.log(error)
    return res.status(500).send({ success: false, message: error.message });
    
   }

}
export const InActiveUserController = async(req,res)=>{
    try {
     const users = await userModel.find({ role: 1,status:"Inactive" });
   
         if (users.length === 0) {
             return res.send({ success: false, message: "No users found" });
         }
 
         return res.status(200).send({ success: true, users ,message:"Users found successfully"});
         
    } catch (error) {
     console.log(error)
     return res.status(500).send({ success: false, message: error.message });
     
    }
 
 }


 export const getSubscribedController = async (req, res) => {
    try {
        const users = await userModel.find({ role: 1,isFreeTrial:false,status:"Active" });
        if (users.length === 0) {
            return res.send({ success: false, message: "No users found" });
        }

        return res.status(200).send({ success: true, users ,message:"Users found successfully"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: error.message });
    }
};

export const revenueController = async(req,res)=>{
    try {

        const data = await subscriptionModel.find()
        if(data.length===0){
            return res.send({success:false,message:"data not found "}) 
        }       
        return res.status(200).send({success:true,message:"data found successfully",data})
    } catch (error) {
        console.log(error)
        return res.status(500).send({success:false,message:error.message})
    }
}


export const  getStaffByUserController = async(req,res)=>{
    try {
      
      const {_id}=req.params;
      const staff = await userModel.find({role:0,admin:_id}).populate("admin")
     
      return res.send({success:true,message:"staff found successfully",staff})
    } catch (error) {
      console.log(error)
      return res.status(500).send({success:false,message:error.message})
    }
  }