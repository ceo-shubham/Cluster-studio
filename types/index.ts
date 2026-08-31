export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp?: number;
  discount?: string;
  rating?: number;
  reviewsCount?: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  cardImage: string;   // homepage grid card — from /bannerimg/
  image: string;       // product detail page + canvas editor — from /showimg/
  gallery?: string[];  // additional images for product page gallery
  colors?: string[];   // e.g. ["#111111", "#FFFFFF"]
  giftTags?: string[]; // e.g. ["birthday", "anniversary", "couple", "under299"]
  description: string;
  specs?: string;
  specificationsList?: string[];
  features?: string[];
  printAreaWidth: number;
  printAreaHeight: number;
  printAreaX: number;
  printAreaY: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customImageUrl?: string;
  customImageDataUrl?: string;
  finalImageUrl?: string;
  canvasState?: string;
}

export interface Order {
  _id?: string;
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  customImageUrl?: string;
  finalImageUrl?: string;
}

export interface AdminUser {
  email: string;
  password: string;
}
