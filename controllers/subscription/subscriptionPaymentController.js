import subPayment from "../../models/subscription/subscriptionModel.js";
import Razorpay from "razorpay";
import crypto from "crypto"; // Import crypto for signature verification
import userModel from "../../models/userModel.js";

// Controller to create a Razorpay order
export const subPayCreateController = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: req.body.amount, // Amount in paise
      currency: "INR",
    };

    const orderRazor = await instance.orders.create(options);
  
    if (!orderRazor) 
      return res.send("Some error occurred");

    res.send(orderRazor);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};



// Controller to handle the payment verification
export const subPayOrderRazorController = async (req, res) => {
  try {
    const { amount, razorpay, plan, customer } = req.body;
    const { orderId, paymentId, signature } = razorpay;

    // Verify payment signature
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    shasum.update(`${orderId}|${paymentId}`);
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Initialize Razorpay instance
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // Retrieve payment status from Razorpay
    const paymentStatus = await instance.payments.fetch(paymentId);
    const isPaid = paymentStatus.status === "captured";

    // if (!isPaid) {
    //   return res.status(400).json({ success: false, message: "Payment not captured" });
    // }

    // Continue processing after successful payment
    let amt = amount;
    let finamt = amt.toString().slice(0, -2);
    let dmt = parseInt(finamt);

    let newInvoice;
    const lastInvoice = await subPayment.findOne({}).sort({ createdAt: -1 });
    if (lastInvoice == null || lastInvoice.invoiceNo == null) {
      newInvoice = 10101;
    } else {
      newInvoice = lastInvoice.invoiceNo + 1;
    }

    const newOrder = new subPayment({
      isPaid: true,
      paymentMode: true,
      amount: dmt,
      plan: plan,
      razorpay: razorpay,
      customer: customer,
      invoiceNo: newInvoice,
    });
    const result = await newOrder.save();

   
    const user = await userModel.findById(customer);
    if (user) {
      const noOfDay = result.plan[0].duration;
      const edate = user.endDate || new Date();
      const endDate = new Date(edate);
      endDate.setDate(endDate.getDate() + noOfDay);

      await userModel.findByIdAndUpdate(
        customer,
        { paymentValidation: result.plan[0]._id, endDate: endDate ,status:"Active" },
        { new: true }
      );
    }

    
    res.send({
      success: true,
      message: "Payment was successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};




