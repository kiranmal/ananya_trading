import React from "react";

const AddressBook = ({ user, onEdit }) => {

  return (
    <div className="profile-card address-card">

      <div className="card-title-row">

        <div>
          <p>Delivery Address</p>
          <h2>My Address</h2>
        </div>

        <button
          className="small-edit-btn"
          onClick={onEdit}
        >
          Edit
        </button>

      </div>

      <div className="address-box">

        <div className="address-icon">
          📍
        </div>

        <div>

          <h3>
            {user?.name || "User"}
          </h3>

          <p>
            {user?.address ||
              "No delivery address added yet."}
          </p>

          {user?.phone && (
            <p>
              Phone: {user.phone}
            </p>
          )}

        </div>

      </div>

    </div>
  );
};

export default AddressBook;