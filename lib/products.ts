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
  // ── MUGS CATEGORY ──
  {
    id: "1-1",
    name: "White Mug",
    category: "Mugs",
    price: 149,
    mrp: 199,
    discount: "25% OFF",
    rating: 4.8,
    reviewsCount: 180,
    isBestSeller: true,
    cardImage: "/bannerimg/1 (1).jpeg",
    image: "/showimg/1 (1).jpeg",
    gallery: [
      "/showimg/1 (1).jpeg",
      "/bannerimg/1 (1).jpeg",
      "/bannerimg/1 (2).jpeg",
      "/bannerimg/1 (4).jpeg",
    ],
    colors: ["#FFFFFF", "#111111"],
    giftTags: ["birthday", "corporate", "personalized", "under299", "photo"],
    description: "Classic white ceramic mug with your custom print. High glossy finish, microwave safe, and comfortable grip handle.",
    specs: "Capacity: 330ml | Material: Ceramic | Dishwasher Safe",
    specificationsList: [
      "11 Oz capacity (330ml standard mug)",
      "Premium ceramic quality with glossy finish",
      "Microwave & dishwasher safe",
      "Fade-proof high quality sublimation print",
      "Comfortable grip handle"
    ],
    printAreaWidth: 200, printAreaHeight: 120, printAreaX: 80, printAreaY: 60,
  },
  {
    id: "1-2",
    name: "Patch Mug",
    category: "Mugs",
    price: 249,
    mrp: 349,
    discount: "28% OFF",
    rating: 4.7,
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
    description: "Premium patch mug with a raised custom print area for a distinct photo focus and rich contrast.",
    specs: "Capacity: 350ml | Material: Ceramic | Premium Patch Finish",
    specificationsList: [
      "Unique patch styling for distinct photo focus",
      "11.5 Oz capacity (350ml)",
      "Sturdy ceramic build with easy-hold handle",
      "Scratch-resistant high-definition printing",
      "Microwave & dishwasher safe"
    ],
    printAreaWidth: 180, printAreaHeight: 100, printAreaX: 90, printAreaY: 70,
  },
  {
    id: "1-3",
    name: "Mini Mug",
    category: "Mugs",
    price: 129,
    mrp: 199,
    discount: "35% OFF",
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
    giftTags: ["birthday", "under299", "personalized", "cute"],
    description: "Adorable mini ceramic mug, perfect for strong espresso shots, children's milk cups, or desk keepsakes.",
    specs: "Capacity: 150ml | Material: Ceramic | Cute & Compact",
    specificationsList: [
      "Compact 150ml size for espresso & tea",
      "Premium glossy glaze",
      "Lightweight and adorable form factor",
      "Long-lasting permanent print"
    ],
    printAreaWidth: 140, printAreaHeight: 90, printAreaX: 70, printAreaY: 55,
  },
  {
    id: "1-4",
    name: "Magic Mug",
    category: "Mugs",
    price: 299,
    mrp: 399,
    discount: "25% OFF",
    rating: 4.9,
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
    giftTags: ["birthday", "anniversary", "couple", "personalized", "under299", "magic"],
    description: "Add magic to your mornings! Heat-sensitive mug that reveals the hidden customized photo when hot liquid is poured.",
    specs: "Capacity: 11 Oz (330ml) | Thermo-reactive Coating | Magic Reveal",
    specificationsList: [
      "Heat-sensitive thermo-reactive coating",
      "Design magically appears with hot tea/coffee",
      "Capacity: 11 Oz (330ml)",
      "Premium glossy ceramic finish",
      "Perfect surprise gift for loved ones"
    ],
    printAreaWidth: 200, printAreaHeight: 120, printAreaX: 80, printAreaY: 60,
  },

  // ── BOTTLES CATEGORY ──
  {
    id: "1-5",
    name: "Sipper Bottle (750ml)",
    category: "Bottles",
    price: 299,
    mrp: 499,
    discount: "40% OFF",
    rating: 4.8,
    reviewsCount: 164,
    isBestSeller: true,
    cardImage: "/bannerimg/1 (5).jpeg",
    image: "/showimg/1 (5).jpeg",
    gallery: [
      "/showimg/1 (5).jpeg",
      "/bannerimg/1 (5).jpeg",
      "/bannerimg/1 (6).jpeg",
    ],
    colors: ["#FFFFFF", "#111111"],
    giftTags: ["gym", "office", "travel", "personalized", "bottle"],
    description: "Large 750ml sipper bottle with full-color custom print. BPA-free and leak-proof food grade stainless steel.",
    specs: "Capacity: 750ml | BPA Free | Leak Proof | Stainless Steel",
    specificationsList: [
      "Food-grade rust-proof stainless steel",
      "Generous 750ml hydration capacity",
      "Leak-proof spout lid with carabiner hook",
      "Scratch-resistant vibrant custom sublimation"
    ],
    printAreaWidth: 160, printAreaHeight: 200, printAreaX: 80, printAreaY: 40,
  },
  {
    id: "1-6",
    name: "Nozzle Bottle",
    category: "Bottles",
    price: 380,
    mrp: 549,
    discount: "30% OFF",
    rating: 4.8,
    reviewsCount: 115,
    cardImage: "/bannerimg/1 (6).jpeg",
    image: "/showimg/1 (6).jpeg",
    gallery: [
      "/showimg/1 (6).jpeg",
      "/bannerimg/1 (6).jpeg",
      "/bannerimg/1 (5).jpeg",
    ],
    colors: ["#111111", "#475569"],
    giftTags: ["sports", "gym", "trendy", "bottle"],
    description: "Sports nozzle bottle with ergonomic grip and custom design. Lightweight and durable for workouts and outdoor trips.",
    specs: "Capacity: 600ml | Nozzle Cap | BPA Free | Sports Grade",
    specificationsList: [
      "Ergonomic easy-grip sports body",
      "Leak-proof safety nozzle spout",
      "Double-coated thermal print",
      "Capacity: 600ml"
    ],
    printAreaWidth: 150, printAreaHeight: 180, printAreaX: 80, printAreaY: 50,
  },
  {
    id: "1-7",
    name: "Sipper Bottle (600ml)",
    category: "Bottles",
    price: 249,
    mrp: 399,
    discount: "37% OFF",
    rating: 4.8,
    reviewsCount: 88,
    cardImage: "/bannerimg/1 (7).jpeg",
    image: "/showimg/1 (7).jpeg",
    gallery: [
      "/showimg/1 (7).jpeg",
      "/bannerimg/1 (7).jpeg",
      "/bannerimg/1 (5).jpeg",
    ],
    colors: ["#FFFFFF", "#111111"],
    giftTags: ["travel", "compact", "bottle", "personalized"],
    description: "Compact 600ml sipper bottle, perfect for daily use, school, and office with a vivid custom print.",
    specs: "Capacity: 600ml | Sipper Cap | BPA Free | Lightweight",
    specificationsList: [
      "Compact 600ml lightweight stainless steel",
      "Flip-top sipper cap with secure lock",
      "Full wrap custom design printing",
      "Rust-proof and easy to wash"
    ],
    printAreaWidth: 150, printAreaHeight: 180, printAreaX: 80, printAreaY: 50,
  },
  {
    id: "1-9",
    name: "Sports Bottle",
    category: "Bottles",
    price: 349,
    mrp: 499,
    discount: "30% OFF",
    rating: 4.9,
    reviewsCount: 96,
    cardImage: "/bannerimg/1 (9).jpeg",
    image: "/showimg/1 (9).jpeg",
    gallery: [
      "/showimg/1 (9).jpeg",
      "/bannerimg/1 (9).jpeg",
      "/bannerimg/1 (5).jpeg",
    ],
    colors: ["#1E293B", "#FFFFFF"],
    giftTags: ["sports", "stainless", "bottle", "active"],
    description: "Premium sports bottle designed for active lifestyles with bold custom graphics and insulated durability.",
    specs: "Capacity: 700ml | Stainless Steel | Double-Wall Insulated",
    specificationsList: [
      "Grade 304 stainless steel construction",
      "Generous 700ml capacity",
      "Loop handle cap for easy carrying",
      "Custom laser or color sublimation"
    ],
    printAreaWidth: 160, printAreaHeight: 200, printAreaX: 80, printAreaY: 40,
  },

  // ── CLOTHING & T-SHIRTS CATEGORY ──
  {
    id: "1-10",
    name: "Black T-Shirt",
    category: "Clothing",
    price: 390,
    mrp: 599,
    discount: "35% OFF",
    rating: 4.9,
    reviewsCount: 210,
    isBestSeller: true,
    cardImage: "/bannerimg/1 (10).jpeg",
    image: "/showimg/1 (10).jpeg",
    gallery: [
      "/showimg/1 (10).jpeg",
      "/bannerimg/1 (10).jpeg",
    ],
    colors: ["#111111", "#FFFFFF"],
    giftTags: ["fashion", "clothing", "tshirt", "personalized"],
    description: "Premium 200 GSM 100% bio-washed combed cotton black t-shirt with high-definition DTF custom front print.",
    specs: "GSM: 200 | Material: 100% Cotton | Unisex Fit | S–3XL",
    specificationsList: [
      "100% Super Combed Cotton",
      "200 GSM Heavyweight bio-washed fabric",
      "High-definition direct-to-film digital print",
      "Sizes: S, M, L, XL, XXL, 3XL",
      "Double stitched seams for long durability"
    ],
    printAreaWidth: 220, printAreaHeight: 260, printAreaX: 90, printAreaY: 80,
  },
  {
    id: "1-11",
    name: "Orange T-Shirt",
    category: "Clothing",
    price: 379,
    mrp: 549,
    discount: "31% OFF",
    rating: 4.7,
    reviewsCount: 75,
    cardImage: "/bannerimg/1 (11).jpeg",
    image: "/showimg/1 (11).jpeg",
    gallery: [
      "/showimg/1 (11).jpeg",
      "/bannerimg/1 (11).jpeg",
    ],
    colors: ["#EA580C", "#111111"],
    giftTags: ["fashion", "clothing", "tshirt", "vibrant"],
    description: "Vibrant 200 GSM orange cotton t-shirt. Stand out with your customized artwork, quotes, or graphics.",
    specs: "GSM: 200 | Material: 100% Cotton | Unisex Fit | S–3XL",
    specificationsList: [
      "Vibrant high-contrast color",
      "Soft bio-washed 200 GSM cotton",
      "Crisp fade-resistant DTF print",
      "Comfortable everyday regular fit"
    ],
    printAreaWidth: 220, printAreaHeight: 260, printAreaX: 90, printAreaY: 80,
  },
  {
    id: "1-12",
    name: "White T-Shirt",
    category: "Clothing",
    price: 449,
    mrp: 649,
    discount: "30% OFF",
    rating: 4.8,
    reviewsCount: 130,
    cardImage: "/bannerimg/1 (12).jpeg",
    image: "/showimg/1 (12).jpeg",
    gallery: [
      "/showimg/1 (12).jpeg",
      "/bannerimg/1 (12).jpeg",
    ],
    colors: ["#FFFFFF", "#111111"],
    giftTags: ["fashion", "clothing", "tshirt", "white"],
    description: "High-quality 220 GSM thick pure white cotton t-shirt, ideal for vibrant full-color photo and graphic prints.",
    specs: "GSM: 220 | Material: 100% Cotton | Premium Grade | S–3XL",
    specificationsList: [
      "220 GSM non-see-through thick cotton",
      "Vivid color absorption technology",
      "Double stitched collar and hem",
      "Pre-shrunk fabric"
    ],
    printAreaWidth: 220, printAreaHeight: 260, printAreaX: 90, printAreaY: 80,
  },
  {
    id: "1-13",
    name: "Brown T-Shirt",
    category: "Clothing",
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
    giftTags: ["fashion", "clothing", "tshirt", "earthy"],
    description: "Earthy mocha brown 180 GSM cotton t-shirt with custom graphic print for a clean casual streetwear aesthetic.",
    specs: "GSM: 180 | Material: 100% Cotton | Casual Fit | S–3XL",
    specificationsList: [
      "Modern mocha earthy color",
      "Soft breathable cotton build",
      "Long-lasting permanent print"
    ],
    printAreaWidth: 220, printAreaHeight: 260, printAreaX: 90, printAreaY: 80,
  },
  {
    id: "1-14",
    name: "White Hoodie",
    category: "Clothing",
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
    giftTags: ["winter", "fashion", "hoodie", "couple"],
    description: "Plush 400 GSM fleece-lined white hoodie with kangaroo pocket and high-definition custom chest print.",
    specs: "GSM: 400 | Material: Cotton-Fleece Blend | Kangaroo Pocket | S–3XL",
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
    category: "Clothing",
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
    giftTags: ["winter", "fashion", "hoodie", "premium"],
    description: "Royal navy blue 350 GSM fleece hoodie with plush brushed interior and durable customized print.",
    specs: "GSM: 350 | Material: Cotton-Fleece Blend | Ribbed Cuffs | S–3XL",
    specificationsList: [
      "Comfort regular fit with double lined hood",
      "High tensile stitching",
      "Deep royal blue shade"
    ],
    printAreaWidth: 230, printAreaHeight: 280, printAreaX: 85, printAreaY: 100,
  },
  {
    id: "1-16",
    name: "Chocolaty T-Shirt",
    category: "Clothing",
    price: 449,
    mrp: 649,
    discount: "30% OFF",
    rating: 4.8,
    reviewsCount: 52,
    cardImage: "/bannerimg/1 (16).jpeg",
    image: "/showimg/1 (16).jpeg",
    gallery: [
      "/showimg/1 (16).jpeg",
      "/bannerimg/1 (16).jpeg",
    ],
    colors: ["#452211", "#FFFFFF"],
    giftTags: ["fashion", "clothing", "tshirt", "streetwear"],
    description: "Rich chocolaty 240 GSM heavy cotton streetwear t-shirt with premium custom chest or back graphic.",
    specs: "GSM: 240 | Material: 100% Cotton | Premium Fit | S–3XL",
    specificationsList: [
      "240 GSM heavy cotton streetwear cut",
      "Bio-washed & silicone treated",
      "Seamless collar and sleeve hems"
    ],
    printAreaWidth: 220, printAreaHeight: 260, printAreaX: 90, printAreaY: 80,
  },
  {
    id: "1-17",
    name: "Black Hoodie",
    category: "Clothing",
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
    giftTags: ["winter", "fashion", "hoodie", "black"],
    description: "Sleek 350 GSM black hoodie — minimal, bold, and fully customizable with your photos and graphics.",
    specs: "GSM: 350 | Material: Cotton-Fleece Blend | Slim Fit | S–3XL",
    specificationsList: [
      "350 GSM high density fleece",
      "Double stitched kangaroo pocket",
      "Fade-proof DTF custom printing"
    ],
    printAreaWidth: 230, printAreaHeight: 280, printAreaX: 85, printAreaY: 100,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  const norm = category.toLowerCase().trim();
  return products.filter((p) => {
    const cat = p.category.toLowerCase().trim();
    if (norm === "mugs" || norm === "mug") return cat.includes("mug");
    if (norm === "bottles" || norm === "bottle") return cat.includes("bottle") || cat.includes("sipper");
    if (norm === "clothing" || norm === "t-shirts" || norm === "tshirt" || norm === "hoodies") {
      return cat.includes("clothing") || cat.includes("shirt") || cat.includes("hoodie");
    }
    return cat.includes(norm);
  });
};

export const customerReviews: CustomerReview[] = [
  {
    id: "r1",
    name: "Aman Verma",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    date: "2 days ago",
    isVerified: true,
    comment: "The Magic Mug photo reveal is mind blowing! Hot coffee daalte hi photo clear dikhti hai. Loved the packing!",
    productName: "Magic Mug",
    productImage: "/showimg/1 (4).jpeg",
  },
  {
    id: "r2",
    name: "Pooja Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    date: "4 days ago",
    isVerified: true,
    comment: "Ordered customized Black T-Shirt. 100% cotton material is super soft and the DTF print is crystal clear!",
    productName: "Black T-Shirt",
    productImage: "/showimg/1 (10).jpeg",
  },
  {
    id: "r3",
    name: "Rohan Kapoor",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    date: "1 week ago",
    isVerified: true,
    comment: "Stainless steel sipper bottle quality is top notch. Gym me roz use karta hu, zero leak and great personalized print.",
    productName: "Sipper Bottle",
    productImage: "/showimg/1 (5).jpeg",
  },
];

export const reviewPhotos: ReviewPhoto[] = [
  {
    id: "rp1",
    name: "Aakash G.",
    rating: 5,
    image: "/bannerimg/1 (1).jpeg",
    productTitle: "White Mug",
  },
  {
    id: "rp2",
    name: "Sneha D.",
    rating: 5,
    image: "/bannerimg/1 (10).jpeg",
    productTitle: "Black T-Shirt",
  },
  {
    id: "rp3",
    name: "Vikram S.",
    rating: 5,
    image: "/bannerimg/1 (5).jpeg",
    productTitle: "Sipper Bottle",
  },
];
