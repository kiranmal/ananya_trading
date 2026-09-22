import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Visiting Cards");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!name.trim() || !price || !image.trim()) {
      alert("Please fill Product Name, Price and Image");
      return;
    }

    const priceNumber = Number(price);
    const oldPriceNumber = Number(oldPrice || price);

    const discount =
      oldPriceNumber > priceNumber
        ? `${Math.round(
            ((oldPriceNumber - priceNumber) /
              oldPriceNumber) *
              100
          )}% OFF`
        : "";

    const newProduct = {

      id: Date.now(),

      name: name.trim(),

      category,

      price: priceNumber,

      oldPrice: oldPriceNumber,

      discount,

      rating: 5,

      reviews: 0,

      badge: "NEW",

      image: image.trim(),

      images: [
        image.trim()
      ],

      description:
        description.trim() ||
        "Premium quality product from Ananya Trading Company.",

      paperTypes: [
        "Matte",
        "Glossy",
        "Textured"
      ],

      sizes: [
        "Standard",
        "Premium"
      ],

      features: [
        "Premium Quality",
        "High Quality Printing",
        "Fast Delivery",
        "100% Quality Assured"
      ]
    };

    // IMPORTANT:
    // Same storage key used by Home.jsx
    const existingProducts =
      JSON.parse(
        localStorage.getItem("ananyaProducts") || "[]"
      );

    const updatedProducts = [
      ...existingProducts,
      newProduct
    ];

    localStorage.setItem(
      "ananyaProducts",
      JSON.stringify(updatedProducts)
    );

    // Other components ko notify karo
    window.dispatchEvent(
      new Event("productsUpdated")
    );

    alert("Product added successfully!");

    navigate("/admin/products");

  };

  return (

    <div className="admin-page">

      <div className="page-heading">

        <div>

          <h2>
            Add Product
          </h2>

          <p>
            Add a new product to your store.
          </p>

        </div>

      </div>


      <form
        onSubmit={handleSubmit}
        className="product-form"
      >

        <div className="form-group">

          <label>
            Product Name
          </label>

          <input
            type="text"
            placeholder="Premium Visiting Card"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

        </div>


        <div className="form-group">

          <label>
            Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            <option>Visiting Cards</option>
            <option>Business Cards</option>
            <option>Premium Cards</option>
            <option>Luxury Cards</option>
            <option>Brochures</option>
            <option>Flyers</option>
            <option>Posters</option>
            <option>Banners</option>
            <option>Stickers</option>
            <option>Packaging</option>

          </select>

        </div>


        <div className="form-row">

          <div className="form-group">

            <label>
              Price
            </label>

            <input
              type="number"
              min="0"
              placeholder="499"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>
              Old Price
            </label>

            <input
              type="number"
              min="0"
              placeholder="699"
              value={oldPrice}
              onChange={(e) =>
                setOldPrice(e.target.value)
              }
            />

          </div>

        </div>


        <div className="form-group">

          <label>
            Product Image URL
          </label>

          <input
            type="url"
            placeholder="https://example.com/product.jpg"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
          />

        </div>


        {image && (

          <div className="image-preview">

            <img
              src={image}
              alt="Product Preview"
              style={{
                width: "180px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "12px"
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

          </div>

        )}


        <div className="form-group">

          <label>
            Description
          </label>

          <textarea
            rows="5"
            placeholder="Enter product description..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

        </div>


        <div className="form-actions">

          <button
            type="button"
            className="secondary-btn"
            onClick={() =>
              navigate("/admin/products")
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="primary-btn"
          >
            Add Product
          </button>

        </div>

      </form>

    </div>
  );
}