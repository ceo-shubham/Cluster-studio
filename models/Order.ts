import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  customImageUrl?: string;
  finalImageUrl?: string;
}

export interface IShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface IOrder extends Document {
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: IShippingAddress;
  status: string;
  paymentStatus: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  customImageUrl: { type: String },
  finalImageUrl: { type: String },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  name: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
