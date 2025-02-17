import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.js";
import Transaction from "../models/transaction.js";

const createTransaction = async (req, res) => {
  const { amount, userId } = req.body;
  const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_SECRET,
  });

  const options = {
    amount: amount * 100, // Ensure the amount is in paise
    currency: "INR",
    receipt: `receipt#${Date.now()}`,
  };

  try {
    if (!amount || !userId) {
      return res.status(400).json({
        success: false,
        message: "Amount and user id required",
      });
    }
    const razorpayOrder = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      message: "Order created Successfully",
      key: process.env.RAZOR_PAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order_id: razorpayOrder.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

const createOrder = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    cartItems,
    deliveryDate,
    address,
  } = req.body;

  const key_secret = process.env.RAZOR_PAY_SECRET;
  const generated_signature = crypto
    .createHmac("sha256", key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    try {
      const transaction = await Transaction.create({
        user: userId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: "Success",
        amount: cartItems.reduce(
          (total, item) => total + item?.quantity * item.price,
          0
        ),
      });

      const order = await Order.create({
        userId,
        address,
        deliveryDate,
        items: cartItems?.map((item) => ({
          product: item?.id,
          quantity: item?.quantity,
        })),
        status: "Order Placed",
      });

      transaction.order = order._id;
      await transaction.save();

      res.json({
        success: true,
        message: "Payment Verified and order created",
        order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create transaction or order",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }
};

const getOrdersUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ user: userId })
      .populate("user", "name email")
      .populate("items.product", "name price image_uri ar_uri")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

export { createTransaction, createOrder, getOrdersUserById };
