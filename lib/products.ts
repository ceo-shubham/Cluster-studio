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
    price: 199,
    mrp: 249,
    discount: "20% OFF",
    rating: 4.8,
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
    description: "High quality ceramic mug with premium sublimation coating. Perfect for your daily coffee and special moments. Microwave & dishwasher safe with glossy finish.",
    specs: "Capacity: 11 Oz (330ml) | Material: Premium Ceramic | High Quality Print",
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
    price: 299,
    mrp: 350,
    discount: "15% OFF",
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
    description: "Premium patch mug with distinct photo focus background and rich contrast. High glossy ceramic body with long-lasting print.",
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
    id: "1-4",
    name: "Magic Mug",
    category: "Mugs",
    price: 249,
    mrp: 349,
    discount: "28% OFF",
    rating: 4.8,
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
    description: "Add some magic to your mornings! Heat-sensitive mug that reveals the hidden customized photo when hot liquid is poured inside.",
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
  {
    id: "1-3",
    name: "Inner Color Mug",
    category: "Mugs",
    price: 229,
    mrp: 299,
    discount: "23% OFF",
    rating: 4.6,
    reviewsCount: 120,
    cardImage: "/bannerimg/1 (3).jpeg",
    image: "/showimg/1 (3).jpeg",
    gallery: [
      "/showimg/1 (3).jpeg",
      "/bannerimg/1 (3).jpeg",
      "/bannerimg/1 (1).jpeg",
    ],
    colors: ["#E11D48", "#2563EB", "#16A34A", "#F59E0B"],
    giftTags: ["birthday", "under299", "personalized", "color"],
    description: "Vibrant ceramic mug with stylish contrasting inner color and handle. Complements your personalized photo or graphic perfectly.",
    specs: "Capacity: 330ml | Material: Ceramic | Dual Tone Finish",
    specificationsList: [
      "Dual tone aesthetic with colorful interior",
      "Capacity: 330ml standard mug size",
      "Microwave & dishwasher safe",
      "Permanent fade-resistant vibrant print"
    ],
    printAreaWidth: 200, printAreaHeight: 120, printAreaX: 80, printAreaY: 60,
  },
  {
    id: "1-18",
    name: "Photo Mug",
    category: "Mugs",
    price: 249,
    mrp: 299,
    discount: "16% OFF",
    rating: 4.7,
    reviewsCount: 98,
    cardImage: "/bannerimg/1 (2).jpeg",
    image: "/showimg/1 (2).jpeg",
    gallery: [
      "/showimg/1 (2).jpeg",
      "/bannerimg/1 (2).jpeg",
      "/bannerimg/1 (1).jpeg",
    ],
    colors: ["#FFFFFF", "#111111"],
    giftTags: ["birthday", "anniversary", "family", "photo"],
    description: "Personalized photo collage mug displaying your fondest memories in razor-sharp high-definition print quality.",
    specs: "Capacity: 330ml | Material: Ceramic | Full Wrap Print",
    specificationsList: [
      "Full panoramic wrap print",
      "Ultra-clear photo rendering",
      "Capacity: 330ml",
      "Microwave safe & glossy coating"
    ],
    printAreaWidth: 200, printAreaHeight: 120, printAreaX: 80, printAreaY: 60,
  },
  {
    id: "1-7",
    name: "Couple Mug",
    category: "Mugs",
    price: 499,
    mrp: 649,
    discount: "23% OFF",
    rating: 4.8,
    reviewsCount: 76,
    cardImage: "/bannerimg/1 (7).jpeg",
    image: "/showimg/1 (7).jpeg",
    gallery: [
      "/showimg/1 (7).jpeg",
      "/bannerimg/1 (7).jpeg",
      "/bannerimg/1 (4).jpeg",
    ],
    colors: ["#FFFFFF", "#F43F5E"],
    giftTags: ["anniversary", "couple", "valentines", "wedding"],
    description: "Set of two interlocking romantic mugs crafted for couples. Personalized with your names, date, and couple photos.",
    specs: "Pair of 2 Mugs | Capacity: 300ml each | Heart Interlocking Handles",
    specificationsList: [
      "Set of 2 complementing couple mugs",
      "Heart-shaped interlocking handle design",
      "Individual custom photo & name on each mug",
      "Premium gift-box packaging"
    ],
    printAreaWidth: 180, printAreaHeight: 110, printAreaX: 80, printAreaY: 60,
  },

  // ── BOTTLES CATEGORY ──
  {
    id: "1-5",
    name: "Sipper Bottle",
    category: "Bottles",
    price: 399,
    mrp: 549,
    discount: "27% OFF",
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
    description: "Food-grade stainless steel sipper bottle with flip spout cap and personalized permanent 360-degree custom graphic wrap.",
    specs: "Capacity: 750ml | Material: Stainless Steel | Leak Proof Spout",
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
    name: "Camera Bottle",
    category: "Bottles",
    price: 499,
    mrp: 699,
    discount: "28% OFF",
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
    giftTags: ["photography", "trendy", "unique", "bottle"],
    description: "Creative camera-lens styled insulated tumbler bottle with detachable lens-cap cup. Keeps beverages hot or cold for hours.",
    specs: "Capacity: 450ml | Double Wall Vacuum Insulated | Camera Lens Replica",
    specificationsList: [
      "Realistic camera lens exterior styling",
      "Double-walled stainless steel thermal insulation",
      "Detachable lens cover doubles as drinking cup",
      "Keeps drinks hot for 6h / cold for 12h"
    ],
    printAreaWidth: 150, printAreaHeight: 180, printAreaX: 80, printAreaY: 50,
  },
  {
    id: "1-13",
    name: "Insulated Tumbler",
    category: "Bottles",
    price: 549,
    mrp: 799,
    discount: "31% OFF",
    rating: 4.9,
    reviewsCount: 88,
    cardImage: "/bannerimg/1 (5).jpeg",
    image: "/showimg/1 (5).jpeg",
    gallery: [
      "/showimg/1 (5).jpeg",
      "/bannerimg/1 (5).jpeg",
    ],
    colors: ["#1E293B", "#FFFFFF", "#F59E0B"],
    giftTags: ["travel", "coffee", "premium", "insulated"],
    description: "Double-wall vacuum insulated coffee travel tumbler with spill-resistant slider lid. Custom engraved or color printed.",
    specs: "Capacity: 500ml | Stainless Steel 304 | Thermal 12 Hours",
    specificationsList: [
      "Grade 304 stainless steel interior",
      "12-hour temperature retention",
      "Splash-proof sliding lid with straw hole",
      "Custom name or logo laser / sublimation"
    ],
    printAreaWidth: 160, printAreaHeight: 180, printAreaX: 80, printAreaY: 50,
  },

  // ── CLOTHING CATEGORY ──
  {
    id: "1-19",
    name: "Custom Cotton T-Shirt",
    category: "Clothing",
    price: 399,
    mrp: 599,
    discount: "33% OFF",
    rating: 4.9,
    reviewsCount: 210,
    cardImage: "/bannerimg/1 (3).jpeg",
    image: "/showimg/1 (3).jpeg",
    gallery: [
      "/showimg/1 (3).jpeg",
      "/bannerimg/1 (3).jpeg",
    ],
    colors: ["#111111", "#FFFFFF", "#3B82F6", "#EF4444"],
    giftTags: ["fashion", "clothing", "tshirt", "personalized"],
    description: "100% bio-washed breathable combed cotton t-shirt. High-density digital DTF custom print on chest or back that stays vibrant wash after wash.",
    specs: "Fabric: 100% Combed Cotton 180 GSM | Bio-Washed | Pre-Shrunk",
    specificationsList: [
      "180 GSM premium combed cotton",
      "Bio-washed and silicone softened fabric",
      "High-definition direct-to-film digital print",
      "Sizes: XS, S, M, L, XL, XXL",
      "Double stitched seams for long durability"
    ],
    printAreaWidth: 220, printAreaHeight: 250, printAreaX: 80, printAreaY: 50,
  },
  {
    id: "1-20",
    name: "Personalized Hoodie",
    category: "Clothing",
    price: 799,
    mrp: 1199,
    discount: "33% OFF",
    rating: 4.9,
    reviewsCount: 95,
    cardImage: "/bannerimg/1 (1).jpeg",
    image: "/showimg/1 (1).jpeg",
    gallery: [
      "/showimg/1 (1).jpeg",
      "/bannerimg/1 (1).jpeg",
    ],
    colors: ["#111111", "#475569", "#7F1D1D"],
    giftTags: ["winter", "fashion", "hoodie", "couple"],
    description: "Warm fleece-lined heavyweight unisex hoodie. Custom printed with your favorite artwork, quote, or memorable couple photo.",
    specs: "Fabric: 320 GSM Fleece Cotton Blend | Kangaroo Pocket | Drawstring Hood",
    specificationsList: [
      "320 GSM heavyweight warm cotton fleece",
      "Soft brushed interior for supreme comfort",
      "Spacious kangaroo pouch pocket",
      "Durable non-fading HD print"
    ],
    printAreaWidth: 220, printAreaHeight: 250, printAreaX: 80, printAreaY: 50,
  },

  // ── KEYCHAINS CATEGORY ──
  {
    id: "1-8",
    name: "Name Keychain",
    category: "Keychains",
    price: 149,
    mrp: 199,
    discount: "25% OFF",
    rating: 4.8,
    reviewsCount: 130,
    cardImage: "/bannerimg/1 (7).jpeg",
    image: "/showimg/1 (7).jpeg",
    gallery: [
      "/showimg/1 (7).jpeg",
      "/bannerimg/1 (7).jpeg",
    ],
    colors: ["#D4AF37", "#94A3B8", "#111111"],
    giftTags: ["pocket", "keychain", "car", "name", "under199"],
    description: "Durable metallic acrylic keychain engraved or printed with custom name, lucky number, or vehicle number plate design.",
    specs: "Size: 6cm x 2cm | Material: High-Gloss Acrylic & Metal Ring",
    specificationsList: [
      "Premium shatter-resistant cast acrylic",
      "Stainless steel heavy-duty key ring",
      "Precision laser cut finish with smooth edges",
      "Double-sided glossy protective finish"
    ],
    printAreaWidth: 120, printAreaHeight: 80, printAreaX: 80, printAreaY: 60,
  },
  {
    id: "1-15",
    name: "Spotify Song Plaque",
    category: "Keychains",
    price: 299,
    mrp: 449,
    discount: "33% OFF",
    rating: 4.9,
    reviewsCount: 175,
    cardImage: "/bannerimg/1 (4).jpeg",
    image: "/showimg/1 (4).jpeg",
    gallery: [
      "/showimg/1 (4).jpeg",
      "/bannerimg/1 (4).jpeg",
    ],
    colors: ["#000000", "#FFFFFF"],
    giftTags: ["music", "romantic", "spotify", "acrylic"],
    description: "Crystal clear acrylic plaque featuring your favorite song, scannable Spotify track barcode, customized album cover photo, and timestamp.",
    specs: "Material: Clear Cast Acrylic | Scannable Spotify URI Code",
    specificationsList: [
      "Real scannable Spotify music code",
      "Your uploaded couple / memory photo as album art",
      "Crystal clear optical grade acrylic",
      "Includes display stand"
    ],
    printAreaWidth: 160, printAreaHeight: 180, printAreaX: 80, printAreaY: 50,
  },

  // ── COMBOS & GIFTS CATEGORY ──
  {
    id: "1-10",
    name: "Custom Photo Cushion",
    category: "Combos",
    price: 399,
    mrp: 549,
    discount: "27% OFF",
    rating: 4.8,
    reviewsCount: 140,
    cardImage: "/bannerimg/1 (1).jpeg",
    image: "/showimg/1 (1).jpeg",
    gallery: [
      "/showimg/1 (1).jpeg",
      "/bannerimg/1 (1).jpeg",
    ],
    colors: ["#FFFFFF", "#FCE7F3"],
    giftTags: ["home", "cushion", "romantic", "photo"],
    description: "Soft satin square cushion with full edge-to-edge personalized photo print. Includes ultra-fluffy microfiber cushion filler.",
    specs: "Size: 16x16 Inches (40x40cm) | Fabric: Satin & Polyfill Filler",
    specificationsList: [
      "16x16 inches square dimensions",
      "Silky soft luxury satin fabric with concealed zipper",
      "High density micro-fiber hypoallergenic filler included",
      "Washable non-fading vivid photo print"
    ],
    printAreaWidth: 220, printAreaHeight: 220, printAreaX: 80, printAreaY: 60,
  },
  {
    id: "1-9",
    name: "Wooden Photo Frame",
    category: "Combos",
    price: 349,
    mrp: 499,
    discount: "30% OFF",
    rating: 4.8,
    reviewsCount: 125,
    cardImage: "/bannerimg/1 (2).jpeg",
    image: "/showimg/1 (2).jpeg",
    gallery: [
      "/showimg/1 (2).jpeg",
      "/bannerimg/1 (2).jpeg",
    ],
    colors: ["#92400E", "#D97706"],
    giftTags: ["frame", "wood", "table", "anniversary"],
    description: "Natural pine wood desk photo frame with rich glossy UV photo print. Perfect for keeping heartfelt moments close on study or work desks.",
    specs: "Size: 6x8 Inches | Material: Natural Seasoned Pine Wood",
    specificationsList: [
      "Natural seasoned wood with smooth lacquer finish",
      "Direct UV photographic permanent print",
      "Table stand & wall hook both included",
      "Scratch & water-resistant front coating"
    ],
    printAreaWidth: 180, printAreaHeight: 140, printAreaX: 80, printAreaY: 60,
  },
  {
    id: "1-14",
    name: "Rotating Photo Lamp",
    category: "Combos",
    price: 699,
    mrp: 999,
    discount: "30% OFF",
    rating: 4.9,
    reviewsCount: 82,
    cardImage: "/bannerimg/1 (4).jpeg",
    image: "/showimg/1 (4).jpeg",
    gallery: [
      "/showimg/1 (4).jpeg",
      "/bannerimg/1 (4).jpeg",
    ],
    colors: ["#F59E0B", "#FFFFFF"],
    giftTags: ["nightlamp", "led", "romantic", "premium"],
    description: "Motorized 360-degree rotating warm LED cylinder lamp featuring 4 of your favorite photos. Creates a magical glowing ambience in bedrooms.",
    specs: "Height: 8 Inches | Warm LED Light | Electric 360° Rotation",
    specificationsList: [
      "Holds 4 customized high-res photos",
      "Smooth silent electric rotating mechanism",
      "Warm ambient LED soothing night light",
      "Plug & play with power adapter included"
    ],
    printAreaWidth: 180, printAreaHeight: 200, printAreaX: 80, printAreaY: 50,
  },
  {
    id: "1-17",
    name: "Magic Sequin Heart Cushion",
    category: "Combos",
    price: 449,
    mrp: 649,
    discount: "30% OFF",
    rating: 4.8,
    reviewsCount: 110,
    cardImage: "/bannerimg/1 (6).jpeg",
    image: "/showimg/1 (6).jpeg",
    gallery: [
      "/showimg/1 (6).jpeg",
      "/bannerimg/1 (6).jpeg",
    ],
    colors: ["#E11D48", "#D97706", "#2563EB"],
    giftTags: ["heart", "sequin", "magic", "valentines"],
    description: "Reversible glitter sequin heart cushion. Swipe your hand one way for sparkling red sequins, swipe the other to reveal your hidden photo!",
    specs: "Size: 15x15 Inches Heart | Reversible Mermaid Sequins",
    specificationsList: [
      "Interactive 2-way reversible mermaid sequins",
      "Photo hidden under sparkling red/gold sequins",
      "Includes plush heart filler cushion",
      "Guaranteed surprise reaction gift"
    ],
    printAreaWidth: 200, printAreaHeight: 200, printAreaX: 80, printAreaY: 50,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  const norm = category.toLowerCase().trim();
  return products.filter((p) => {
    const cat = p.category.toLowerCase().trim();
    if (norm === "mugs") return cat.includes("mug");
    if (norm === "bottles") return cat.includes("bottle") || cat.includes("sipper");
    if (norm === "clothing") return cat.includes("clothing") || cat.includes("shirt") || cat.includes("hoodie");
    if (norm === "keychains") return cat.includes("keychain") || cat.includes("spotify");
    if (norm === "combos") return cat.includes("combo") || cat.includes("cushion") || cat.includes("frame") || cat.includes("lamp");
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
    comment: "Ordered couple mugs for our anniversary. The print quality is so crisp and shiny. Super fast delivery!",
    productName: "Couple Mug",
    productImage: "/showimg/1 (7).jpeg",
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
    image: "/bannerimg/1 (4).jpeg",
    productTitle: "Magic Mug",
  },
  {
    id: "rp3",
    name: "Vikram S.",
    rating: 5,
    image: "/bannerimg/1 (5).jpeg",
    productTitle: "Sipper Bottle",
  },
];
