import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Building,
  School,
  Hospital,
  ShoppingBag,
  Train,
  Navigation,
} from "lucide-react";
import "./MapAdmin.css";

const MapAdminDashboard = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "landmarks",
      title: "Landmarks",
      description: "Update major landmarks information",
      icon: <MapPin size={36} />,
      color: "#3f608fea",
      route: "/dashboard/landmarks",
      hasDescription: true,
    },
    {
      id: "hotels",
      title: "Hotels",
      description: "Update nearby hotels information",
      icon: <Building size={36} />,
      color: "#3f608fea",
      route: "/dashboard/hotels",
      hasDescription: false,
    },
    {
      id: "schools",
      title: "Education",
      description: "Update educational institutions info",
      icon: <School size={36} />,
      color: "#3f608fea",
      route: "/dashboard/schools",
      hasDescription: false,
    },
    {
      id: "hospitals",
      title: "Healthcare",
      description: "Update healthcare facilities info",
      icon: <Hospital size={36} />,
      color: "#3f608fea",
      route: "/dashboard/hospitals",
      hasDescription: false,
    },
    {
      id: "malls",
      title: "Shopping",
      description: "Update shopping centers information",
      icon: <ShoppingBag size={36} />,
      color: "#3f608fea",
      route: "/dashboard/malls",
      hasDescription: false,
    },
  ];

  return (
    <div className="map-admin-dashboard">
        <div className="admin-header">
          <div className="header-content">
            <h1>Map Administration</h1>
            <p>Update and manage map landmarks and amenities</p>
          </div>
          {/* <button className="btn-back" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button> */}
        </div>

        <div className="admin-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => navigate(category.route)}
              style={{ borderTop: `4px solid ${category.color}` }}
            >
              <div className="card-icon" style={{ color: category.color }}>
                {category.icon}
              </div>
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <div className="card-footer">
                {category.hasDescription && (
                  <span className="badge">Detailed</span>
                )}
                <button
                  className="btn-manage"
                  style={{ backgroundColor: category.color }}
                >
                  View & Edit →
                </button>
              </div>
            </div>
          ))}
        </div>

    
      </div>
  );
};

export default MapAdminDashboard;
