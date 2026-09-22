import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="premium-footer">

      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="newsletter-content">
          <div>
            <span className="newsletter-small">STAY CONNECTED</span>
            <h2>Get the latest offers & updates</h2>
            <p>
              Subscribe to our newsletter and get exclusive deals,
              new product updates and special offers.
            </p>
          </div>

          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
            />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">

        {/* Company */}
        <div className="footer-column footer-company">
          <h2>ANANYA</h2>
          <h3>TRADING COMPANY</h3>

          <p>
            Your trusted destination for premium printing,
            customized products and quality lifestyle solutions.
          </p>

          <div className="footer-contact">
            <p>
              <strong>📍</strong>
              India
            </p>

            <p>
              <strong>📞</strong>
              +91 98765 43210
            </p>

            <p>
              <strong>✉</strong>
              support@ananyatrading.com
            </p>
          </div>

          <div className="footer-social">
            <a href="/">f</a>
            <a href="/">𝕏</a>
            <a href="/">◎</a>
            <a href="/">in</a>
            <a href="/">▶</a>
          </div>
        </div>

        {/* Shop */}
        <div className="footer-column">
          <h3>Shop</h3>

          <a href="/category">All Products</a>
          <a href="/category">New Arrivals</a>
          <a href="/category">Best Sellers</a>
          <a href="/category">Featured Products</a>
          <a href="/category">Special Offers</a>
          <a href="/category">Customized Products</a>
          <a href="/category">Printing Products</a>
        </div>

        {/* Categories */}
        <div className="footer-column">
          <h3>Categories</h3>

          <a href="/category">T-Shirts</a>
          <a href="/category">Hoodies</a>
          <a href="/category">Mugs</a>
          <a href="/category">Bottles</a>
          <a href="/category">Caps</a>
          <a href="/category">Bags</a>
          <a href="/category">Corporate Gifts</a>
          <a href="/category">Customized Gifts</a>
        </div>

        {/* Customer Service */}
        <div className="footer-column">
          <h3>Customer Service</h3>

          <a href="/contact">Contact Us</a>
          <a href="/track-order">Track Your Order</a>
          <a href="/shipping">Shipping Information</a>
          <a href="/returns">Returns & Refunds</a>
          <a href="/faq">FAQs</a>
          <a href="/help">Help Center</a>
          <a href="/support">Customer Support</a>
        </div>

        {/* Account */}
        <div className="footer-column">
          <h3>My Account</h3>

          <a href="/profile">My Profile</a>
          <a href="/orders">My Orders</a>
          <a href="/wishlist">Wishlist</a>
          <a href="/cart">Shopping Cart</a>
          <a href="/login">Login</a>
          <a href="/signup">Create Account</a>
        </div>

      </div>

      {/* Trust Section */}
      <div className="footer-trust">

        <div className="trust-item">
          <span>🚚</span>
          <div>
            <strong>Fast Delivery</strong>
            <p>Quick & reliable shipping</p>
          </div>
        </div>

        <div className="trust-item">
          <span>🔒</span>
          <div>
            <strong>Secure Payment</strong>
            <p>100% secure transactions</p>
          </div>
        </div>

        <div className="trust-item">
          <span>↩</span>
          <div>
            <strong>Easy Returns</strong>
            <p>Simple return process</p>
          </div>
        </div>

        <div className="trust-item">
          <span>💬</span>
          <div>
            <strong>24/7 Support</strong>
            <p>We're here to help</p>
          </div>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">

        <div className="footer-bottom-left">
          <p>
            © 2026 <strong>Ananya Trading Company</strong>.
            All Rights Reserved.
          </p>
        </div>

        <div className="footer-policies">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
          <a href="/refund">Refund Policy</a>
          <a href="/shipping">Shipping Policy</a>
        </div>

        <div className="payment-methods">
          <span>VISA</span>
          <span>Mastercard</span>
          <span>UPI</span>
          <span>COD</span>
        </div>

      </div>

    </footer>
  );
}

export default Footer;