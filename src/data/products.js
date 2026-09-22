const products = [
  {
    id: 1,
    name: "Premium Business Cards",
    category: "Visiting Cards",
    price: 299,
    oldPrice: 499,
    discount: "40% OFF",
    rating: 4.8,
    reviews: 128,
    badge: "PREMIUM",

    description:
      "Make a lasting impression with premium quality business cards printed on high-quality paper.",

    images: [
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&w=1000&q=85"
    ],

    paperTypes: ["Matte", "Glossy", "Textured"],
    sizes: ["Standard (3.5 × 2)", "Square (2.5 × 2.5)"],

    features: [
      "350 GSM Premium Paper",
      "Matte Finish",
      "Full Color Printing",
      "Double Side Printing",
      "High Resolution",
      "Custom Design Support"
    ]
  },

  {
    id: 2,
    name: "Luxury Matte Cards",
    category: "Visiting Cards",
    price: 449,
    oldPrice: 699,
    discount: "36% OFF",
    rating: 4.9,
    reviews: 96,
    badge: "BEST SELLER",

    description:
      "Elegant luxury visiting cards designed for businesses that want a premium professional identity.",

    images: [
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1000&q=85"
    ],

    paperTypes: ["Matte", "Luxury", "Textured"],
    sizes: ["Standard", "Square"],

    features: [
      "400 GSM Premium Paper",
      "Luxury Matte Finish",
      "Sharp Printing",
      "Premium Color Quality",
      "Double Side Printing",
      "Professional Design Support"
    ]
  },

  {
    id: 3,
    name: "Elegant Black Business Cards",
    category: "Visiting Cards",
    price: 399,
    oldPrice: 599,
    discount: "33% OFF",
    rating: 4.7,
    reviews: 74,
    badge: "NEW",

    description:
      "Bold black business cards with a sophisticated finish for premium brands and professionals.",

    images: [
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=85"
    ],

    paperTypes: ["Matte", "Glossy"],
    sizes: ["Standard", "Rounded Corner"],

    features: [
      "Premium Black Paper",
      "Luxury Finish",
      "High Resolution Printing",
      "Water Resistant",
      "Double Side Printing",
      "Custom Branding"
    ]
  },

  {
    id: 4,
    name: "Corporate Business Cards",
    category: "Visiting Cards",
    price: 249,
    oldPrice: 399,
    discount: "38% OFF",
    rating: 4.6,
    reviews: 52,
    badge: "POPULAR",

    description:
      "Clean and professional corporate visiting cards for offices, companies and startups.",

    images: [
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85"
    ],

    paperTypes: ["Matte", "Glossy"],
    sizes: ["Standard"],

    features: [
      "300 GSM Paper",
      "Professional Finish",
      "Full Color Printing",
      "Fast Delivery",
      "High Quality Print",
      "Custom Design"
    ]
  },

  {
    id: 5,
    name: "Textured Finish Cards",
    category: "Visiting Cards",
    price: 499,
    oldPrice: 799,
    discount: "37% OFF",
    rating: 4.8,
    reviews: 88,
    badge: "PREMIUM",

    description:
      "Premium textured visiting cards with a unique tactile finish.",

    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85"
    ],

    paperTypes: ["Textured", "Matte"],
    sizes: ["Standard", "Square"],

    features: [
      "350 GSM Textured Paper",
      "Premium Feel",
      "Sharp Print",
      "Luxury Finish",
      "Double Side Printing",
      "Design Assistance"
    ]
  },

  {
    id: 6,
    name: "Rounded Corner Cards",
    category: "Visiting Cards",
    price: 349,
    oldPrice: 549,
    discount: "36% OFF",
    rating: 4.7,
    reviews: 69,
    badge: "NEW",

    description:
      "Modern rounded-corner business cards for a clean and contemporary brand identity.",

    images: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1000&q=85"
    ],

    paperTypes: ["Matte", "Glossy"],
    sizes: ["Rounded Corner"],

    features: [
      "350 GSM Paper",
      "Rounded Corners",
      "Premium Printing",
      "Smooth Finish",
      "High Quality Colors",
      "Custom Design"
    ]
  },

  {
    id: 7,
    name: "Ultra Premium Cards",
    category: "Visiting Cards",
    price: 599,
    oldPrice: 999,
    discount: "40% OFF",
    rating: 4.9,
    reviews: 112,
    badge: "BEST SELLER",

    description:
      "Our most premium business card collection designed for luxury brands.",

    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85"
    ],

    paperTypes: ["Luxury", "Textured", "Matte"],
    sizes: ["Standard", "Square"],

    features: [
      "450 GSM Luxury Paper",
      "Premium Finish",
      "Foil Printing",
      "Embossed Options",
      "Double Side Printing",
      "Free Design Support"
    ]
  },

  {
    id: 8,
    name: "Minimal Design Cards",
    category: "Visiting Cards",
    price: 199,
    oldPrice: 299,
    discount: "33% OFF",
    rating: 4.5,
    reviews: 43,
    badge: "POPULAR",

    description:
      "Minimal and elegant business cards for modern professionals and startups.",

    images: [
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=85"
    ],

    paperTypes: ["Matte", "Glossy"],
    sizes: ["Standard"],

    features: [
      "300 GSM Paper",
      "Minimal Finish",
      "Full Color Printing",
      "Fast Production",
      "Professional Quality",
      "Easy Customization"
    ]
  }
];

export default products;