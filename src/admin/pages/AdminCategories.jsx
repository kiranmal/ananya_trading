import React from "react";

export default function AdminCategories() {
  return (
    <div className="admin-page">

      <div className="page-heading">
        <div>
          <h2>Categories</h2>
          <p>Manage your product categories.</p>
        </div>

        <button className="primary-btn">
          + Add Category
        </button>
      </div>

      <div className="panel">

        <div className="panel-head">
          <div>
            <h3>All Categories</h3>
            <p>Product category management</p>
          </div>
        </div>

        <div className="table-wrap">

          <table className="admin-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Products</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>#CAT-001</td>
                <td>Electronics</td>
                <td>84</td>
                <td>
                  <span className="status delivered">
                    Active
                  </span>
                </td>
              </tr>

              <tr>
                <td>#CAT-002</td>
                <td>Fashion</td>
                <td>126</td>
                <td>
                  <span className="status delivered">
                    Active
                  </span>
                </td>
              </tr>

              <tr>
                <td>#CAT-003</td>
                <td>Home & Kitchen</td>
                <td>62</td>
                <td>
                  <span className="status delivered">
                    Active
                  </span>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}