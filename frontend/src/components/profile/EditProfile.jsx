import React, { useState } from "react";

const EditProfile = ({ user, onSave }) => {

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
    photo: user?.photo || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(formData);
  };

  return (
    <div className="profile-card edit-profile-card">

      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit}>

        <div className="profile-photo-edit">

          <img
            src={
              formData.photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                formData.name || "User"
              )}&background=111827&color=ffffff&size=200`
            }
            alt="Profile"
          />

          <label className="upload-photo-btn">

            Change Photo

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

          </label>

        </div>

        <div className="form-grid">

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

          </div>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

          </div>

          <div className="form-group">

            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

          </div>

          <div className="form-group full-width">

            <label>Complete Address</label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House no., street, area, landmark..."
              rows="3"
            />

          </div>

          <div className="form-group">

            <label>City</label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />

          </div>

          <div className="form-group">

            <label>State</label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />

          </div>

          <div className="form-group">

            <label>Pincode</label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="6 digit pincode"
              maxLength="6"
            />

          </div>

        </div>

        <button
          type="submit"
          className="save-profile-btn"
        >
          Save Changes
        </button>

      </form>

    </div>
  );
};

export default EditProfile;