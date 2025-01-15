import InventorySubCategoryModel from "../models/InventorySubCategoryModel.js";

export const createInventorySubCategoryController = async (req, res) => {
  try {
    const { CategoryName, subCategoryName, userId } = req.body;

    const requiredFields = ["CategoryName", "subCategoryName", "userId"];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).send({
        message: "Required fields are missing",
        missingFields: missingFields,
      });
    }

    const response = await InventorySubCategoryModel.create({
      CategoryName,
      subCategoryName,
      admin: userId,
    });

    if (response) {
      return res.status(201).send({
        success: true,
        message: "SubCategory Created Successfully",
        response,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
export const manageInventorySubCategoryController = async (req, res) => {
  try {
    const _id = req.params._id;

    const data = await InventorySubCategoryModel.find({ admin: _id });

    if (data && data.length > 0) {
      return res
        .status(200)
        .send({ success: true, message: "Data found", data });
    } else {
      return res
        .status(404)
        .send({ success: false, message: "Data not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};
export const deleteInventorySubCategoryController = async (req, res) => {
  try {
    const { _id } = req.params;
    const response = await InventorySubCategoryModel.findByIdAndDelete(_id);

    if (!response) {
      return res
        .status(404)
        .send({ success: false, message: "SubCategory not found" });
    }

    return res.status(200).send({
      success: true,
      message: "SubCategory deleted successfully",
      response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};
export const updateInventorySubCategoryController = async (req, res) => {
  try {
    const { _id } = req.params;
    const { CategoryName, subCategoryName } = req.body;

    const requiredFields = ["CategoryName", "subCategoryName"];
    const missingFields = requiredFields.filter(
      (field) => !(field in req.body)
    );

    if (missingFields.length > 0) {
      return res.status(400).send({
        message: "Required fields are missing",
        missingFields: missingFields,
      });
    }

    const SubCategory = await InventorySubCategoryModel.findByIdAndUpdate(
      _id,
      { CategoryName, subCategoryName },
      {
        new: true,
      }
    );

    if (!SubCategory) {
      return res.status(404).send({
        success: false,
        message: "SubCategory not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "SubCategory updated successfully",
      data: SubCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};
