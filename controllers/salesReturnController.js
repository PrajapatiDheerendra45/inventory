import returnModel from "../models/salesReturnModel.js";

export const createReturnController = async (req, res) => {
  try {
    const {
      date,
      salesType,
      creditNoteNo,
      customerName,
      cash, // Include cash in the model
      selectedBank, // Include selected bank data
      placeOfSupply,
      customerType,
      paymentTerm,
      dueDate,
      dispatchedThrough,
      destination,
      carrierNameAgent,
      billOfLading,
      billingAddress,
      reverseCharge,
      gstType,
      reasonForReturn,
      rows,
      otherChargesDescriptions,
      otherCharges,
      narration,
      grossAmount,
      GstAmount,
      netAmount,
      userId,
    } = req.body;

    const newSalesReturn = new returnModel({
      admin: userId,
      date,
      salesType,
      creditNoteNo,
      customerName,
      cash, // Include cash in the model
      selectedBank, // Include selected bank data
      placeOfSupply,
      customerType,
      paymentTerm,
      dueDate,
      dispatchedThrough,
      destination,
      carrierNameAgent,
      billOfLading,
      billingAddress,
      reverseCharge,
      gstType,
      reasonForReturn,
      rows,
      otherChargesDescriptions,
      otherCharges,
      narration,
      grossAmount,
      GstAmount,
      netAmount,
    });
    const savedSalesReturn = await newSalesReturn.save();
    res.status(201).send({
      message: "SalesReturn created successfully",
      salesreturn: savedSalesReturn,
    });
  } catch (error) {
    res.status(500).send({ error: "Server error", message: error.message });
  }
};
export const getAllReturnCOntroller = async (req, res) => {
  try {
    const _id = req.params._id;
    const response = await returnModel.find({ admin: _id });

    if (!response) {
      return res
        .status(404)
        .send({ success: false, message: "Data not found" });
    }

    return res
      .status(200)
      .send({ success: true, message: "Data  found", response });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Issue" });
  }
};
export const getAllReturnByIdController = async (req, res) => {
  try {
    const { _id } = req.params;
    const response = await returnModel.findById(_id);
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data found",
      salesreturn: response, // Named it `salesreturn` for clarity
    });
  } catch (error) {
    console.error("Error fetching sales salesreturn by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Issue",
      error: error.message,
    });
  }
};
export const deletReturnByIDController = async (req, res) => {
  try {
    const { _id } = req.params;
    const deleteData = await returnModel.findByIdAndDelete({ _id });

    if (!deleteData) {
      return res
        .status(404)
        .send({ success: false, message: "Data not found" });
    }

    return res.status(200).send({
      success: true,
      message: "Sales SalesReturn Deleted Successfully",
      deleteData,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Issue" });
  }
};
export const updateReturnByIDController = async (req, res) => {
  try {
    const { _id } = req.params;
    const updateData = req.body;
    // Find the existing sales return document by ID
    const salesreturn = await returnModel.findById(_id);
    if (!salesreturn) {
      return res
        .status(404)
        .send({ success: false, message: "Sales return not found" });
    }
    // Apply the updates from updateData to the sales return
    Object.assign(salesreturn, updateData);
    // Save the updated sales return
    const updatedSalesReturn = await salesreturn.save();

    return res.status(200).send({
      success: true,
      message: "Sales return updated successfully",
      updatedSalesReturn,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Issue" });
  }
};
