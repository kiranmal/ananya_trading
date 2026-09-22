import AdminTable from "../components/AdminTable";


const inventory = [

  [
    "Premium Cotton Shirt",
    "SKU-001",
    "Fashion",
    45,
    "In Stock",
  ],

  [
    "Classic Sneakers",
    "SKU-002",
    "Footwear",
    18,
    "In Stock",
  ],

  [
    "Leather Backpack",
    "SKU-003",
    "Bags",
    7,
    "Low Stock",
  ],

  [
    "Smart Watch Pro",
    "SKU-004",
    "Electronics",
    0,
    "Out of Stock",
  ],

];


export default function AdminInventory() {

  return (
    <div>

      <div className="page-heading">

        <div>

          <h2>
            Inventory
          </h2>

          <p>
            Monitor and update
            stock levels
          </p>

        </div>

      </div>


      <section className="panel">

        <AdminTable
          headers={[
            "Product",
            "SKU",
            "Category",
            "Stock",
            "Status",
            "Action",
          ]}
        >

          {inventory.map(
            (item) => (

              <tr key={item[1]}>

                <td>
                  <strong>
                    {item[0]}
                  </strong>
                </td>

                <td>
                  {item[1]}
                </td>

                <td>
                  {item[2]}
                </td>

                <td>
                  {item[3]}
                </td>

                <td>

                  <span
                    className={`status ${
                      item[4] === "In Stock"
                        ? "delivered"
                        : item[4] ===
                          "Low Stock"
                        ? "pending"
                        : "cancelled"
                    }`}
                  >
                    {item[4]}
                  </span>

                </td>

                <td>

                  <button className="small-action">
                    Update Stock
                  </button>

                </td>

              </tr>

            )
          )}

        </AdminTable>

      </section>

    </div>
  );
}