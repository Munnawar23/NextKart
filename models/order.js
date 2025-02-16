import mongoose, { Schema } from "mongoose";

const ItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  deliveryDate: {
    type: Date,
    require: true,
  },
  adddress: {
    type: String,
  },
  items: {
    type: [ItemSchema],
    require: true,
  },
  status: {
    type: String,
    enum: [
      "Order Placed",
      "Shipping",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Order Placed",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
