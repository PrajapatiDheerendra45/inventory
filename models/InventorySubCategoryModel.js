import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    CategoryName: {
      type: String,
    },
    subCategoryName: {
      type: String,
    },
    admin:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user",
      required:true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SubCategoryName", SubCategorySchema);
