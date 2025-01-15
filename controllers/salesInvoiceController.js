import salesInvoiceModel from "../models/salesInvoiceModel.js";

export const createSalesInvoiceController = async (req, res) => {
  try {
    const {
      date,
      InvoiceNo,
      salesType,
      customerType,
      customerName,
      selctedcash,
      selectedBank, // Include selected bank data
      placeOfSupply,
      paymentTerm,
      dueDate,
      // receiptDocNo,
      dispatchedThrough,
      destination,
      carrierNameAgent,
      billOfLading,
      // motorVehicleNo,
      billingAddress,
      reverseCharge,
      gstType,
      rows,
      cash,
      bank,
      otherChargesDescriptions,
      otherCharges,
      narration,
      grossAmount,
      GstAmount,
      netAmount,
    } = req.body;

    const { _id } = req.user;

    try {
      const newInvoice = new salesInvoiceModel({
        admin: _id,
        date,
        InvoiceNo,
        salesType,
        customerType,
        customerName,
        selctedcash, // Include cash in the model
        selectedBank, // Include selected bank data
        placeOfSupply,
        paymentTerm,
        dueDate,
        // receiptDocNo,
        dispatchedThrough,
        destination,
        carrierNameAgent,
        billOfLading,
        // motorVehicleNo,
        billingAddress,
        reverseCharge,
        gstType,
        rows,
        cash,
        bank,
        otherChargesDescriptions,
        otherCharges,
        narration,
        grossAmount,
        GstAmount,
        netAmount,
      });
      const savedInvoice = await newInvoice.save();
      res.status(201).send({
        message: "Invoice created successfully",
        invoice: savedInvoice,
      });
    } catch (error) {
      res.status(500).send({ error: "Server error", message: error.message });
    }
  } catch (error) {
    res.status(500).send({ error: "Server error", message: error.message });
  }
};

export const getAllSalesInvoiceCOntroller = async (req, res) => {
  try {
    const _id = req.params._id;
    const response = await salesInvoiceModel.find({admin:_id});

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
export const getAllSalesByNameInvoiceController = async (req, res) => {
  try {
    const { customerName } = req.params;

    // If name is provided, filter by name; otherwise, return all documents
    const filter = customerName ? { customerName: new RegExp(customerName, "i") } : {};

    const response = await salesInvoiceModel.find(filter);

    if (!response || response.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Data not found" });
    }

    return res
      .status(200)
      .send({ success: true, message: "Data found", response });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Issue" });
  }
};

export const getAllSalesInvoiceByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await salesInvoiceModel.find(id);
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data found",
      invoice: response, // Named it `invoice` for clarity
    });
  } catch (error) {
    console.error("Error fetching sales invoice by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Issue",
      error: error.message,
    });
  }
};
export const deletSalesInvoiceByIDController = async (req, res) => {
  try {
    const { _id } = req.params;
    const deleteData = await salesInvoiceModel.findByIdAndDelete({ _id });

    if (!deleteData) {
      return res
        .status(404)
        .send({ success: false, message: "Data not found" });
    }

    return res.status(200).send({
      success: true,
      message: "Sales Invoice Deleted Successfully",
      deleteData,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Issue" });
  }
};
export const updateSalesInvoiceByIDController = async (req, res) => {
  try {
    const { _id } = req.params;
    const updateData = req.body;

    // Find the existing sales invoice by ID
    const invoice = await salesInvoiceModel.findById(_id);
    
    if (!invoice) {
      return res
        .status(404)
        .send({ success: false, message: "Sales Invoice not found" });
    }

    // Apply the updates from updateData to the invoice
    Object.assign(invoice, updateData);

    // Save the updated invoice
    const updatedInvoice = await invoice.save();

    return res.status(200).send({
      success: true,
      message: "Sales Invoice updated successfully",
      updatedInvoice,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Issue" });
  }
};

