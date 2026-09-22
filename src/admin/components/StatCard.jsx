import React from "react";

export default function StatCard({
  icon,
  title,
  value,
  change,
}) {

  return (
    <div className="stat-card">

      {/* ICON */}

      <div className="stat-icon">
        {icon}
      </div>


      {/* CONTENT */}

      <div className="stat-content">

        <p className="stat-title">
          {title}
        </p>

        <h3 className="stat-value">
          {value}
        </h3>

        <span className="stat-change">
          {change}
        </span>

        <span className="stat-period">
          {" "}from last month
        </span>

      </div>

    </div>
  );
}