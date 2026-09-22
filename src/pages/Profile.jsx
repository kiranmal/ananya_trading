import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getOrders } from "../services/orderService";

import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInfo from "../components/profile/PersonalInfo";
import EditProfile from "../components/profile/EditProfile";
import MyOrders from "../components/profile/MyOrders";
import OrderTracking from "../components/profile/OrderTracking";
import AddressBook from "../components/profile/AddressBook";

import "../styles/Profile.css";

const Profile = () => {

  const navigate = useNavigate();

  const {
    user,
    logout,
    updateUser,
  } = useAuth();

  const [activeTab, setActiveTab] =
    useState("profile");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [orders] = useState(() =>
    getOrders()
  );

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  const handleSaveProfile = (data) => {

    updateUser(data);

    setActiveTab("profile");

    alert("Profile updated successfully!");
  };

  const handleTrackOrder = (order) => {

    setSelectedOrder(order);

    setActiveTab("tracking");
  };

  if (!user) {

    return (
      <div className="profile-login-required">

        <div className="profile-login-box">

          <div className="profile-login-icon">
            🔐
          </div>

          <h2>Login Required</h2>

          <p>
            Please login to view your profile
            and orders.
          </p>

          <button
            onClick={() => navigate("/login")}
          >
            Login Now
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-container">

        <ProfileSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        <main className="profile-main">

          {activeTab === "profile" && (
            <>
              <ProfileHeader
                user={user}
                onEdit={() =>
                  setActiveTab("edit")
                }
              />

              <PersonalInfo
                user={user}
                onEdit={() =>
                  setActiveTab("edit")
                }
              />

              <AddressBook
                user={user}
                onEdit={() =>
                  setActiveTab("edit")
                }
              />
            </>
          )}

          {activeTab === "edit" && (
            <EditProfile
              user={user}
              onSave={handleSaveProfile}
            />
          )}

          {activeTab === "orders" && (
            <MyOrders
              orders={orders}
              onTrack={handleTrackOrder}
            />
          )}

          {activeTab === "tracking" && (
            <OrderTracking
              order={selectedOrder}
            />
          )}

          {activeTab === "address" && (
            <AddressBook
              user={user}
              onEdit={() =>
                setActiveTab("edit")
              }
            />
          )}

        </main>

      </div>

    </div>
  );
};

export default Profile;