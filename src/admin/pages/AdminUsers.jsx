import { useEffect, useState } from "react";
import AdminTable from "../components/AdminTable";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  /* =====================================================
     LOAD REAL USERS
  ===================================================== */

  const loadUsers = () => {
    try {
      const savedUsers =
        localStorage.getItem("users");

      const parsedUsers = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      if (Array.isArray(parsedUsers)) {
        setUsers(parsedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(
        "Users loading error:",
        error
      );

      setUsers([]);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadUsers();

    const handleStorage = () => {
      loadUsers();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    /*
      Same browser tab me signup hone par
      custom event se users refresh honge.
    */

    window.addEventListener(
      "usersUpdated",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "usersUpdated",
        handleStorage
      );
    };
  }, []);

  /* =====================================================
     BLOCK / UNBLOCK USER
  ===================================================== */

  const toggleUser = (id) => {
    const updatedUsers = users.map(
      (user) =>
        String(user.id) === String(id)
          ? {
              ...user,
              status:
                user.status === "Blocked"
                  ? "Active"
                  : "Blocked",
            }
          : user
    );

    setUsers(updatedUsers);

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    window.dispatchEvent(
      new Event("usersUpdated")
    );
  };

  /* =====================================================
     SEARCH USERS
  ===================================================== */

  const filteredUsers = users.filter(
    (user) => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      if (!searchText) {
        return true;
      }

      return (
        String(
          user.name || ""
        )
          .toLowerCase()
          .includes(searchText) ||

        String(
          user.email || ""
        )
          .toLowerCase()
          .includes(searchText) ||

        String(
          user.phone || ""
        )
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  /* =====================================================
     ACTIVE / BLOCKED COUNT
  ===================================================== */

  const activeUsers =
    users.filter(
      (user) =>
        user.status !== "Blocked"
    ).length;

  const blockedUsers =
    users.filter(
      (user) =>
        user.status === "Blocked"
    ).length;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div>

      {/* =================================================
          PAGE HEADING
      ================================================= */}

      <div className="page-heading">

        <div>

          <h2>
            Users
          </h2>

          <p>
            Manage all registered customers
          </p>

        </div>

      </div>


      {/* =================================================
          USER STATS
      ================================================= */}

      <div
        className="user-stats"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "24px",
        }}
      >

        {/* TOTAL */}

        <div
          className="panel"
          style={{
            padding: "22px",
          }}
        >

          <span
            style={{
              fontSize: "13px",
              opacity: 0.65,
            }}
          >
            TOTAL USERS
          </span>

          <h2
            style={{
              margin:
                "8px 0 0",
              fontSize: "30px",
            }}
          >
            {users.length}
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              opacity: 0.6,
            }}
          >
            Registered customers
          </p>

        </div>


        {/* ACTIVE */}

        <div
          className="panel"
          style={{
            padding: "22px",
          }}
        >

          <span
            style={{
              fontSize: "13px",
              opacity: 0.65,
            }}
          >
            ACTIVE USERS
          </span>

          <h2
            style={{
              margin:
                "8px 0 0",
              fontSize: "30px",
            }}
          >
            {activeUsers}
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              opacity: 0.6,
            }}
          >
            Currently active accounts
          </p>

        </div>


        {/* BLOCKED */}

        <div
          className="panel"
          style={{
            padding: "22px",
          }}
        >

          <span
            style={{
              fontSize: "13px",
              opacity: 0.65,
            }}
          >
            BLOCKED USERS
          </span>

          <h2
            style={{
              margin:
                "8px 0 0",
              fontSize: "30px",
            }}
          >
            {blockedUsers}
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              opacity: 0.6,
            }}
          >
            Blocked accounts
          </p>

        </div>

      </div>


      {/* =================================================
          USERS TABLE
      ================================================= */}

      <section className="panel">

        <div className="toolbar">

          <input
            className="search-input"
            placeholder="🔎 Search users..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <AdminTable
          headers={[
            "Customer",
            "Email",
            "Phone",
            "Orders",
            "Status",
            "Action",
          ]}
        >

          {filteredUsers.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "40px",
                  opacity: 0.6,
                }}
              >

                {users.length === 0
                  ? "No registered users found."
                  : "No users found for your search."}

              </td>

            </tr>

          ) : (

            filteredUsers.map(
              (user) => (

                <tr
                  key={user.id}
                >

                  {/* CUSTOMER */}

                  <td>

                    <div className="user-cell">

                      <div className="avatar small">

                        {user.name
                          ? user.name
                              .split(" ")
                              .map(
                                (word) =>
                                  word[0]
                              )
                              .join("")
                              .slice(
                                0,
                                2
                              )
                              .toUpperCase()
                          : "U"}

                      </div>

                      <strong>
                        {user.name ||
                          "Unknown User"}
                      </strong>

                    </div>

                  </td>


                  {/* EMAIL */}

                  <td>
                    {user.email ||
                      "—"}
                  </td>


                  {/* PHONE */}

                  <td>
                    {user.phone ||
                      "—"}
                  </td>


                  {/* ORDERS */}

                  <td>
                    {user.orders ||
                      0}
                  </td>


                  {/* STATUS */}

                  <td>

                    <span
                      className={`status ${
                        user.status ===
                        "Blocked"
                          ? "cancelled"
                          : "delivered"
                      }`}
                    >

                      {user.status ||
                        "Active"}

                    </span>

                  </td>


                  {/* ACTION */}

                  <td>

                    <button
                      className="small-action"
                      onClick={() =>
                        toggleUser(
                          user.id
                        )
                      }
                    >

                      {user.status ===
                      "Blocked"
                        ? "Unblock"
                        : "Block"}

                    </button>

                  </td>

                </tr>

              )
            )

          )}

        </AdminTable>

      </section>

    </div>
  );
}