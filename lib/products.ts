import { Product } from "@/types";

export interface CustomerReview {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  isVerified: boolean;
  comment: string;
  productName: string;
  productImage: string;
}

export interface ReviewPhoto {
  id: string;
  name: string;
  rating: number;
  image: string;
  productTitle: string;
}

export const products: Product[] = [
  {
    id: "1-1",
    name: "White Mug",
    category: "Mugs",
    price: 199,
    mrp: 229,
    discount: "13% OFF",
    rating: 4.9,
    reviewsCount: 180,
    isBestSeller: true,
    cardImage: "/bannerimg/1 (1).jpeg",
    image: "/showimg/1 (1).jpeg",
    gallery: [
      "/showimg/1 (1).jpeg",
      "/bannerimg/1 (1).jpeg",
      "/bannerimg/1 (2).jpeg",
      "/bannerimg/1 (3).jpeg",
    ],
    colors: ["#FFFFFF", "#111111"],
    giftTags: ["birthday", "corporate", "personalized", "under299", "photo"],
    description: "Classic ceramic white mug designed for vibrant sublimation custom printing. High glossy finish, microwave safe, and comfortable grip.",
    specs: "Capacity: 330ml | Material: Ceramic | Dishwasher & Microwave Safe",
    specificationsList: [
      "High quality ceramic with glossy glaze",
      "Capacity: 330ml standard mug size",
      "Fade-proof sublimation custom print",
      "Microwave and dishwasher safe",
      "Gift-ready protective bubble packaging"
    ],
    printAreaWidth: 200, printAreaHeight: 120, printAreaX: 80, printAreaY: 60,
  },
  {
    id: "1-2",
    name: "Patch Mug",
    category: "Mugs",
    price: 299,
    mrp: 350,
    discount: "15% OFF",
    rating: 4.8,
    reviewsCount: 145,
    isBestSeller: true,
    cardImage: "/bannerimg/1 (2).jpeg",
    image: "/showimg/1 (2).jpeg",
    gallery: [
      "/showimg/1 (2).jpeg",
      "/bannerimg/1 (2).jpeg",
      "/bannerimg/1 (1).jpeg",
      "/bannerimg/1 (4).jpeg",
    ],
    colors: ["#111111", "#FFFFFF"],
    giftTags: ["birthday", "anniversary", "couple", "personalized", "under299"],
    description: "Premium patch mug with an elegant textured print patch that makes your customized photo or artwork pop beautifully.",
    specs: "Capacity: 350ml | Material: Ceramic | Premium Patch Finish",
    specificationsList: [
      "Unique patch styling for distinct photo focus",
      "Capacity: 350ml",
      "Sturdy ceramic build with easy-hold handle",
      "Scratch-resistant high-definition printing",
      "Ideal for birthday and anniversary surprises"
    ],
    printAreaWidth: 180, printAreaHeight: 100, printAreaX: 90, printAreaY: 70,
  },
  {
    id: "1-3",
    name: "Mini Mug",
    category: "Mugs",
    price: 149,
    mrp: 199,
    discount: "25% OFF",
    rating: 4.7,
    reviewsCount: 92,
    cardImage: "/bannerimg/1 (3).jpeg",
    image: "/showimg/1 (3).jpeg",
    gallery: [
      "/showimg/1 (3).jpeg",
      "/bannerimg/1 (3).jpeg",
      "/bannerimg/1 (1).jpeg",
    ],
    colors: ["#FFFFFF", "#F3E8DF"],
    giftTags: ["birthday", "under299", "personalized"],
    description: "Adorable mini ceramic mug, perfect for strong espresso shots, children's milk cups, or desk decorative keepsakes.",
    specs: "Capacity: 150ml | Material: Ceramic | Compact & Cute",
    specificationsList: [
      "Compact 150ml size for espresso & tea",
      "Premium gloss finish",
      "Lightweight and adorable form factor",
      "Long-lasting permanent print"
    ],
    printAreaWidth: 140, printAreaHeight: 90, printAreaX: 70, printAreaY: 55,
  },
  {
    id: "1-4",
    name: "Magic Mug",
    category: "Magic Mugs",
    price: 349,
    mrp: 449,
    discount: "22% OFF",
    rating: 5.0,
    reviewsCount: 245,
    isBestSeller: true,
    cardImage: "/bannerimg/1 (4).jpeg",
    image: "/showimg/1 (4).jpeg",
    gallery: [
      "/showimg/1 (4).jpeg",
      "/bannerimg/1 (4).jpeg",
      "/bannerimg/1 (2).jpeg",
      "/bannerimg/1 (1).jpeg",
    ],
    colors: ["#111111", "#FFFFFF"],
    giftTags: ["birthday", "anniversary", "couple", "personalized", "under499", "premium"],
    description: "Add some magic to your mornings! Heat-sensitive mug that reveals the hidden design when hot liquid is poured in.",
    specs: "Capacity: 330ml | Heat Sensitive Coating | Magic Transformation",
    specificationsList: [
      "Heat-sensitive thermo-reactive coating",
      "High quality ceramic material",
      "Design appears magically with hot liquid",
      "Capacity: 330ml",
      "Perfect for surprising loved ones",
      "Hand wash recommended for longest magic life"
    ],
    printAreaWidth: 200, printAreaHeight: 120, printAreaX: 80, printAreaY: 60,
  },
  {
    id: "1-5",
    name: "Sipper Bottle",
    category: "Sipper Bottles",
    price: 499,
    mrp: 649,
    discount: "23% OFF",
    rating: 4.8,
    reviewsCount: 164,
    isBestSeller: true,
    cardImage: "/bannerimg/1 (5).jpeg",
    image: "/showimg/1 (5).jpeg",
    gallery: [
      "/showimg/1 (5).jpeg",
      "/bannerimg/1 (5).jpeg",
      "/bannerimg/1 (6).jpeg",
      "/bannerimg/1 (7).jpeg",
    ],
    colors: ["#E5E7EB", "#111111"],
    giftTags: ["birthday", "corporate", "personalized", "under499", "premium"],
    description: "Stainless steel sipper bottle with leak-proof flip cap and 360-degree custom graphic wrap. Keeps hydration stylish.",
    specs: "Capacity: 750ml | Material: Stainless Steel | Leak Proof",
    specificationsList: [
      "Food-grade rust-free stainless steel",
      "Generous 750ml capacity",
      "BPA-free leak-proof lid with carabiner hook",
      "Scratch resistant vibrant print"
    ],
    printAreaWidth: 160, printAreaHeight: 200, printAreaX: 80, printAreaY: 40,
  },
  {
    id: "1-6",
    name: "Camera Bottle",
    category: "Sipper Bottles",
    price: 499,
    mrp: 699,
    discount: "28% OFF",
    rating: 4.9,
    reviewsCount: 110,
    isNewArrival: true,
    cardImage: "/bannerimg/1 (6).jpeg",
    image: "/showimg/1 (6).jpeg",
    gallery: [
      "/showimg/1 (6).jpeg",
      "/bannerimg/1 (6).jpeg",
      "/bannerimg/1 (5).jpeg",
    ],
    colors: ["#111111", "#D1D5DB"],
    giftTags: ["birthday", "couple", "personalized", "under499", "photo"],
    description: "Creative camera-inspired custom water bottle. Unique design for photography enthusiasts and trendsetters.",
    specs: "Capacity: 600ml | Camera Styling | Sports Nozzle",
    specificationsList: [
      "Ergonomic easy-grip sports body",
      "High quality thermal sublimation printing",
      "Leak-proof safety lock nozzle",
      "Capacity: 600ml"
    ],
    printAreaWidth: 150, printAreaHeight: 180, printAreaX: 85, printAreaY: 50,
  },
  {
    id: "1-7",
    name: "Couple Mug",
    category: "Mugs",
    price: 299,
    mrp: 399,
    discount: "25% OFF",
    rating: 4.9,
    reviewsCount: 178,
    isNewArrival: true,
    cardImage: "/bannerimg/1 (7).jpeg",
    image: "/showimg/1 (7).jpeg",
    gallery: [
      "/showimg/1 (7).jpeg",
      "/bannerimg/1 (7).jpeg",
      "/bannerimg/1 (1).jpeg",
    ],
    colors: ["#FFFFFF", "#FDE8E8"],
    giftTags: ["anniversary", "couple", "personalized", "under299", "photo"],
    description: "Romantic custom couple mug crafted for celebrating love, anniversaries, and sweet daily moments together.",
    specs: "Capacity: 330ml | Ceramic | Romantic Couple Theme",
    specificationsList: [
      "Custom names and photo compatibility",
      "Premium glossy ceramic body",
      "Capacity: 330ml",
      "Dishwasher & microwave safe"
    ],
    printAreaWidth: 150, printAreaHeight: 180, printAreaX: 85, printAreaY: 50,
  },
  {
    id: "1-8",
    name: "Name Keychain",
    category: "Keychains",
    price: 149,
    mrp: 199,
    discount: "25% OFF",
    rating: 4.8,
    reviewsCount: 310,
    isNewArrival: true,
    cardImage: "/bannerimg/1 (8).jpeg",
    image: "/showimg/1 (8).jpg",
    gallery: [
      "/showimg/1 (8).jpg",
      "/bannerimg/1 (8).jpeg",
    ],
    colors: ["#D4AF37", "#C0C0C0"],
    giftTags: ["birthday", "couple", "personalized", "under299"],
    description: "Personalized metallic name keychain with precision engraving/printing. Lightweight and durable for bike, car, and house keys.",
    specs: "Material: Solid Alloy / Acrylic | Custom Name & Icon",
    specificationsList: [
      "High durability scratch-proof coating",
      "Sturdy split key ring included",
      "Dual-side customizable",
      "Compact gift box included"
    ],
    printAreaWidth: 260, printAreaHeight: 220, printAreaX: 20, printAreaY: 20,
  },
  {
    id: "1-9",
    name: "Photo Frame",
    category: "Photo Frames",
    price: 349,
    mrp: 449,
    discount: "22% OFF",
    rating: 4.9,
    reviewsCount: 195,
    isNewArrival: true,
    cardImage: "/bannerimg/1 (9).jpeg",
    image: "/showimg/1 (9).jpeg",
    gallery: [
      "/showimg/1 (9).jpeg",
      "/bannerimg/1 (9).jpeg",
    ],
    colors: ["#4A2E18", "#1E1E1E"],
    giftTags: ["anniversary", "birthday", "couple", "photo", "personalized", "under499"],
    description: "Handcrafted wooden photo frame with high-resolution photo print and protective acrylic glass. Preserve precious memories forever.",
    specs: "Size: 6x8 inches | Material: Solid Wood & Acrylic Glass",
    specificationsList: [
      "Premium matte-finish synthetic wood frame",
      "High-definition 300 DPI photo print",
      "Table stand and wall-mount hooks included",
      "Shatterproof acrylic front"
    ],
    printAreaWidth: 160, printAreaHeight: 200, printAreaX: 80, printAreaY: 40,
  },
  {
    id: "1-10",
    name: "Custom Photo Cushion",
    category: "Cushions",
    price: 399,
    mrp: 549,
    discount: "27% OFF",
    rating: 4.8,
    reviewsCount: 130,
    cardImage: "/bannerimg/1 (10).jpeg",
    image: "/showimg/1 (10).jpeg",
    gallery: [
      "/showimg/1 (10).jpeg",
      "/bannerimg/1 (10).jpeg",
    ],
    colors: ["#FFFFFF", "#FDE8E8"],
    giftTags: ["birthday", "anniversary", "couple", "photo", "under499"],
    description: "Ultra-soft custom printed photo cushion. Includes high quality filler, silky satin cover, and invisible zipper.",
    specs: "Size: 16x16 inches | Material: Satin & Microfiber Filler",
    specificationsList: [
      "Ultra-smooth satin cover",
      "Comes complete with fluffy hypoallergenic filler",
      "Full edge-to-edge personalized print",
      "Machine washable zipper cover"
    ],
    printAreaWidth: 220, printAreaHeight: 260, printAreaX: 90, printAreaY: 80,
  },
  {
    id: "1-11",
    name: "Black T-Shirt",
    category: "T-Shirts",
    price: 390,
    mrp: 599,
    discount: "35% OFF",
    rating: 4.7,
    reviewsCount: 154,
    cardImage: "/bannerimg/1 (11).jpeg",
    image: "/showimg/1 (11).jpeg",
    gallery: [
      "/showimg/1 (11).jpeg",
      "/bannerimg/1 (11).jpeg",
    ],
    colors: ["#111111", "#FFFFFF"],
    giftTags: ["birthday", "corporate", "personalized", "under499"],
    description: "Premium 200 GSM 100% combed cotton black t-shirt with high-definition DTF custom front print.",
    specs: "GSM: 200 | 100% Combed Cotton | Bio-Washed | Unisex Fit",
    specificationsList: [
      "100% Super Combed Cotton",
      "200 GSM Heavyweight fabric",
      "Bio-washed & pre-shrunk",
      "Long-lasting DTF vibrant print"
    ],
    printAreaWidth: 220, printAreaHeight: 260, printAreaX: 90, printAreaY: 80,
  },
  {
    id: "1-12",
    name: "White T-Shirt",
    category: "T-Shirts",
    price: 449,
    mrp: 599,
    discount: "25% OFF",
    rating: 4.8,
    reviewsCount: 88,
    cardImage: "/bannerimg/1 (12).jpeg",
    image: "/showimg/1 (12).jpeg",
    gallery: [
      "/showimg/1 (12).jpeg",
      "/bannerimg/1 (12).jpeg",
    ],
    colors: ["#FFFFFF", "#111111"],
    giftTags: ["birthday", "corporate", "personalized", "under499"],
    description: "Breathable 220 GSM pure white cotton t-shirt with crisp photo and typographic printing.",
    specs: "GSM: 220 | 100% Cotton | Bio-Washed | Unisex Fit",
    specificationsList: [
      "220 GSM thick, non-see-through cotton",
      "Vivid color absorption",
      "Double stitched seams",
      "Comfort regular fit"
    ],
    printAreaWidth: 220, printAreaHeight: 260, printAreaX: 90, printAreaY: 80,
  },
  {
    id: "1-13",
    name: "Brown T-Shirt",
    category: "T-Shirts",
    price: 339,
    mrp: 499,
    discount: "32% OFF",
    rating: 4.6,
    reviewsCount: 65,
    cardImage: "/bannerimg/1 (13).jpeg",
    image: "/showimg/1 (13).jpeg",
    gallery: [
      "/showimg/1 (13).jpeg",
      "/bannerimg/1 (13).jpeg",
    ],
    colors: ["#5C3A21", "#111111"],
    giftTags: ["birthday", "under499"],
    description: "Earthy mocha brown casual t-shirt with subtle custom branding or artwork placement.",
    specs: "GSM: 180 | 100% Cotton | Soft Bio-Wash",
    specificationsList: [
      "Modern earthy color palette",
      "Comfortable breathable fit",
      "Fade-resistant colors"
    ],
    printAreaWidth: 220, printAreaHeight: 260, printAreaX: 90, printAreaY: 80,
  },
  {
    id: "1-14",
    name: "White Hoodie",
    category: "Hoodies",
    price: 749,
    mrp: 999,
    discount: "25% OFF",
    rating: 4.9,
    reviewsCount: 112,
    cardImage: "/bannerimg/1 (14).jpeg",
    image: "/showimg/1 (14).jpeg",
    gallery: [
      "/showimg/1 (14).jpeg",
      "/bannerimg/1 (14).jpeg",
    ],
    colors: ["#FFFFFF", "#111111"],
    giftTags: ["birthday", "anniversary", "couple", "premium"],
    description: "Plush 400 GSM fleece-lined white hoodie. Ultra-soft inside, matching drawstring, and kangaroo pocket.",
    specs: "GSM: 400 | Cotton-Fleece Blend | Kangaroo Pocket",
    specificationsList: [
      "400 GSM heavyweight thermal fleece",
      "Matching drawstring and metallic eyelets",
      "Ribbed cuffs and waistband",
      "Large chest print area"
    ],
    printAreaWidth: 230, printAreaHeight: 280, printAreaX: 85, printAreaY: 100,
  },
  {
    id: "1-15",
    name: "Blue Hoodie",
    category: "Hoodies",
    price: 549,
    mrp: 799,
    discount: "31% OFF",
    rating: 4.7,
    reviewsCount: 74,
    cardImage: "/bannerimg/1 (15).jpeg",
    image: "/showimg/1 (15).jpeg",
    gallery: [
      "/showimg/1 (15).jpeg",
      "/bannerimg/1 (15).jpeg",
    ],
    colors: ["#1E3A8A", "#111111"],
    giftTags: ["birthday", "premium"],
    description: "Royal navy blue hoodie with plush brushed inner fleece and long-lasting custom chest print.",
    specs: "GSM: 350 | Cotton Fleece | Double Layered Hood",
    specificationsList: [
      "Comfort fit with double lined hood",
      "High tensile stitching",
      "Color lock technology"
    ],
    printAreaWidth: 230, printAreaHeight: 280, printAreaX: 85, printAreaY: 100,
  },
  {
    id: "1-16",
    name: "Chocolaty T-Shirt",
    category: "T-Shirts",
    price: 449,
    mrp: 599,
    discount: "25% OFF",
    rating: 4.8,
    reviewsCount: 52,
    cardImage: "/bannerimg/1 (16).jpeg",
    image: "/showimg/1 (16).jpeg",
    gallery: [
      "/showimg/1 (16).jpeg",
      "/bannerimg/1 (16).jpeg",
    ],
    colors: ["#452211", "#FFFFFF"],
    giftTags: ["birthday", "under499"],
    description: "Rich chocolaty brown premium heavyweight cotton t-shirt with custom chest or back graphic.",
    specs: "GSM: 240 | 100% Combed Cotton | Premium Streetwear Cut",
    specificationsList: [
      "240 GSM heavy cotton streetwear fit",
      "Bio-washed & silicone treated",
      "Seamless collar"
    ],
    printAreaWidth: 220, printAreaHeight: 260, printAreaX: 90, printAreaY: 80,
  },
  {
    id: "1-17",
    name: "Black Hoodie",
    category: "Hoodies",
    price: 699,
    mrp: 999,
    discount: "30% OFF",
    rating: 4.9,
    reviewsCount: 140,
    cardImage: "/bannerimg/1 (17).jpeg",
    image: "/showimg/1 (17).jpeg",
    gallery: [
      "/showimg/1 (17).jpeg",
      "/bannerimg/1 (17).jpeg",
    ],
    colors: ["#111111", "#374151"],
    giftTags: ["birthday", "anniversary", "couple", "premium"],
    description: "Sleek all-black 350 GSM fleece hoodie with high-definition custom graphic print.",
    specs: "GSM: 350 | Premium Fleece | Unisex Regular Fit",
    specificationsList: [
      "350 GSM high density fleece",
      "Double stitched kangaroo pocket",
      "Perfect for personalized gifting"
    ],
    printAreaWidth: 230, printAreaHeight: 280, printAreaX: 85, printAreaY: 100,
  },
];

export const circularCategories = [
  { name: "Mugs", slug: "Mugs", image: "/showimg/1 (1).jpeg" },
  { name: "Magic Mugs", slug: "Magic Mugs", image: "/showimg/1 (4).jpeg" },
  { name: "Sipper Bottles", slug: "Sipper Bottles", image: "/showimg/1 (5).jpeg" },
  { name: "Keychains", slug: "Keychains", image: "/showimg/1 (8).jpg" },
  { name: "Photo Frames", slug: "Photo Frames", image: "/showimg/1 (9).jpeg" },
  { name: "Cushions", slug: "Cushions", image: "/showimg/1 (10).jpeg" },
  { name: "T-Shirts", slug: "T-Shirts", image: "/showimg/1 (11).jpeg" },
];

export const sidebarGiftCategories = [
  { id: "all", label: "All Gifts", iconKey: "sparkles", filterKey: "all" },
  { id: "birthday", label: "Birthday Gifts", iconKey: "cake", filterKey: "birthday" },
  { id: "anniversary", label: "Anniversary Gifts", iconKey: "heart", filterKey: "anniversary" },
  { id: "couple", label: "Couple Gifts", iconKey: "users", filterKey: "couple" },
  { id: "corporate", label: "Corporate Gifts", iconKey: "briefcase", filterKey: "corporate" },
  { id: "festival", label: "Festival Gifts", iconKey: "flame", filterKey: "festival" },
  { id: "photo", label: "Photo Gifts", iconKey: "image", filterKey: "photo" },
  { id: "personalized", label: "Personalized Gifts", iconKey: "palette", filterKey: "personalized" },
  { id: "under299", label: "Under ₹299", iconKey: "tag", filterKey: "under299" },
  { id: "under499", label: "₹300 - ₹499", iconKey: "percent", filterKey: "under499" },
  { id: "premium", label: "₹500 & Above", iconKey: "crown", filterKey: "premium" },
];

export const customerReviews: CustomerReview[] = [
  {
    id: "rev-1",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    date: "18 Aug 2024",
    isVerified: true,
    comment: "Amazing quality and printing is just awesome! The colors came out so vibrant on the Magic Mug. Totally worth it.",
    productName: "Magic Mug",
    productImage: "/bannerimg/1 (4).jpeg",
  },
  {
    id: "rev-2",
    name: "Rahul Verma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    date: "12 Aug 2024",
    isVerified: true,
    comment: "Loved the packaging and super fast delivery. The custom couple mug made our anniversary morning extra special!",
    productName: "Couple Mug",
    productImage: "/bannerimg/1 (2).jpeg",
  },
  {
    id: "rev-3",
    name: "Neha Singh",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    date: "04 Aug 2024",
    isVerified: true,
    comment: "Best gift I ordered for my bestie. She loved it! The photo frame quality is heavy and very premium looking.",
    productName: "Photo Frame",
    productImage: "/bannerimg/1 (1).jpeg",
  },
];

export const reviewPhotos: ReviewPhoto[] = [
  { id: "rp-1", name: "Anjali T.", rating: 5, image: "/bannerimg/1 (4).jpeg", productTitle: "Magic Mug" },
  { id: "rp-2", name: "Rohit K.", rating: 5, image: "/bannerimg/1 (1).jpeg", productTitle: "White Mug" },
  { id: "rp-3", name: "Sneha P.", rating: 5, image: "/bannerimg/1 (2).jpeg", productTitle: "Patch Mug" },
  { id: "rp-4", name: "Vikram M.", rating: 5, image: "/bannerimg/1 (4).jpeg", productTitle: "Magic Mug Black" },
  { id: "rp-5", name: "Pooja S.", rating: 5, image: "/bannerimg/1 (3).jpeg", productTitle: "Mini Mug" },
];

export const instagramPosts = [
  { id: "ig-1", image: "/bannerimg/1 (4).jpeg", likes: "1.2k" },
  { id: "ig-2", image: "/bannerimg/1 (5).jpeg", likes: "890" },
  { id: "ig-3", image: "/bannerimg/1 (2).jpeg", likes: "2.1k" },
  { id: "ig-4", image: "/bannerimg/1 (8).jpeg", likes: "740" },
  { id: "ig-5", image: "/bannerimg/1 (9).jpeg", likes: "1.5k" },
  { id: "ig-6", image: "/bannerimg/1 (4).jpeg", likes: "980" },
];

export const categories = [
  "All",
  "Mugs",
  "Magic Mugs",
  "Sipper Bottles",
  "Keychains",
  "Photo Frames",
  "Cushions",
  "T-Shirts",
  "Hoodies",
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((p) => p.category === category);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNewArrival);
}

export function filterProductsByGiftTag(tag: string): Product[] {
  if (!tag || tag === "all") return products;
  if (tag === "under299") return products.filter((p) => p.price <= 299);
  if (tag === "under499") return products.filter((p) => p.price >= 300 && p.price <= 499);
  if (tag === "premium") return products.filter((p) => p.price >= 500);
  return products.filter((p) => p.giftTags?.includes(tag));
}
