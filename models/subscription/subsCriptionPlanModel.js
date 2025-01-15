import mongoose from "mongoose";
const subCriptionPlan = new mongoose.Schema ({
     planName:{
        type:String,
        required:true,
     },
     description:{
        type:String,
        required:true,
     },
     duration:{
        type:Number,
        required:true,
     },
     price:{
        type:Number,
         required:true,
     },
     planStatus:{
        type:String,
        enum:["Inactive","Active"],
        default:"Active",
        required:true,
     }

},{timestamps:true})
export default mongoose.model("subscriptionPlan",subCriptionPlan)