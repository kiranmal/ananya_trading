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
      "https://static-01.daraz.com.bd/p/2803ec18990b2ea84bf993e54fb18b8c.jpg"
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
      "https://girlsfashionideas.com/wp-content/uploads/2023/06/5fb7dad3d7f74670aaa0674995de1f3a_353577607_2766442920191902_4108349185161659179_n.webp",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85",
      "https://i5.walmartimages.com/seo/Dovford-Long-Sleeve-Shirts-for-Men-Satin-Mens-Dress-Shirts-Long-Sleeve-Formal-Shirts-for-Men-Button-Down-Regular-Fit-Party-Wedding_a750df16-da0b-4fee-a4d7-cdc080c7365a.b6a4d9a7c0ac5f7582a016b8031a3b99.jpeg"
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
      "https://i5.walmartimages.com/seo/Dovford-2024-Mens-Dress-Shirts-Long-Sleeve-Shirts-for-Men-Tuxedo-Shirt-Mens-Dress-Shirt-Slim-Fit-Casual-Button-Down-Shirts_3175e32e-9daf-40b9-a02b-1adbe05f1db6.62bd1881a941cdffa5ccdfaa1fe1ae0e.jpeg",
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
      "https://hips.hearstapps.com/hmg-prod/images/mhl-052224-hanes-1264-socialindex-6661f22b2f322.jpg?crop=0.412xw:0.824xh;0.301xw,0&resize=1120:*",
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1000&q=85",
      "https://static-01.daraz.com.bd/p/cd564387fd6a419d7215327423930b30.jpg"
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
      "https://rukminim2.flixcart.com/image/1200/1255/xif0q/shopsy-t-shirt/6/o/g/l-spsy-green-pista-dream-half-stelino-original-imaghfyzhbhje8es.jpeg?q=60&crop=false",
      "https://www.velthentic.com/cdn/shop/files/H989dc724f5cd42fda1a9ade4f8ab4b0dF.webp?v=1721382800&width=800",
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