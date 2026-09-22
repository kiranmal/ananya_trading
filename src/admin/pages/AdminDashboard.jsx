import StatCard from "../components/StatCard";
import "./AdminDashboard.css";

const recentOrders = [

  {
    id: "#ORD-1001",
    customer: "Rahul Sharma",
    amount: "₹8,499",
    status: "Delivered",
  },

  {
    id: "#ORD-1002",
    customer: "Priya Singh",
    amount: "₹4,299",
    status: "Processing",
  },

  {
    id: "#ORD-1003",
    customer: "Aman Verma",
    amount: "₹12,990",
    status: "Shipped",
  },

  {
    id: "#ORD-1004",
    customer: "Neha Gupta",
    amount: "₹2,499",
    status: "Pending",
  },

  {
    id: "#ORD-1005",
    customer: "Rohit Kumar",
    amount: "₹6,799",
    status: "Delivered",
  },

];


export default function AdminDashboard() {

  return (
    <div>

      {/* Heading */}

      <div className="page-heading">

        <div>

          <h2>
            Good afternoon, Admin 👋
          </h2>

          <p>
            Here is what's happening with
            your store today.
          </p>

        </div>

        <button className="primary-btn">
          ＋ Add Product
        </button>

      </div>


      {/* Statistics */}

      <div className="stats-grid">

        <StatCard
          icon="💰"
          title="Total Revenue"
          value="₹2,48,560"
          change="+12.5%"
        />

        <StatCard
          icon="🛒"
          title="Total Orders"
          value="1,284"
          change="+8.2%"
        />

        <StatCard
          icon="👥"
          title="Total Users"
          value="8,642"
          change="+15.4%"
        />

        <StatCard
          icon="📦"
          title="Total Products"
          value="326"
          change="+4.6%"
        />

      </div>


      {/* Charts */}

      <div className="dashboard-grid">

        {/* Sales */}

        <section className="panel">

          <div className="panel-head">

            <div>

              <h3>
                Sales Overview
              </h3>

              <p>
                Revenue performance this month
              </p>

            </div>

            <select>

              <option>
                Last 7 days
              </option>

              <option>
                Last 30 days
              </option>

              <option>
                Last 6 months
              </option>

            </select>

          </div>


          <div className="fake-chart">

            {[35, 55, 42, 72, 58, 80, 68, 92, 75, 88, 70, 96]
              .map((height, index) => (

                <div
                  className="bar-col"
                  key={index}
                >

                  <div
                    className="bar"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                  <small>
                    {index + 1}
                  </small>

                </div>

              ))}

          </div>

        </section>


        {/* Order Status */}

        <section className="panel">

          <div className="panel-head">

            <div>

              <h3>
                Order Status
              </h3>

              <p>
                Current order distribution
              </p>

            </div>

          </div>


          <div className="donut">

            <div>

              <strong>
                1,284
              </strong>

              <span>
                Orders
              </span>

            </div>

          </div>


          <div className="legend">

            <span>
              <i className="dot delivered"></i>
              Delivered
              <b>68%</b>
            </span>

            <span>
              <i className="dot processing"></i>
              Processing
              <b>17%</b>
            </span>

            <span>
              <i className="dot pending"></i>
              Pending
              <b>10%</b>
            </span>

            <span>
              <i className="dot cancelled"></i>
              Cancelled
              <b>5%</b>
            </span>

          </div>

        </section>

      </div>


      {/* Recent Orders */}

      <section className="panel recent-panel">

        <div className="panel-head">

          <div>

            <h3>
              Recent Orders
            </h3>

            <p>
              Latest customer orders
            </p>

          </div>

          <a href="/admin/orders">
            View All →
          </a>

        </div>


        <div className="table-wrap">

          <table className="admin-table">

            <thead>

              <tr>

                <th>
                  Order ID
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {recentOrders.map(
                (order) => (

                  <tr key={order.id}>

                    <td>
                      <strong>
                        {order.id}
                      </strong>
                    </td>

                    <td>
                      {order.customer}
                    </td>

                    <td>
                      {order.amount}
                    </td>

                    <td>

                      <span
                        className={`status ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}