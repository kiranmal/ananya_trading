import AdminTable from "../components/AdminTable";


const reviews = [

  [
    "Rahul Sharma",
    "Premium Cotton Shirt",
    "★★★★★",
    "Excellent quality!",
  ],

  [
    "Priya Singh",
    "Classic Sneakers",
    "★★★★☆",
    "Very comfortable.",
  ],

  [
    "Aman Verma",
    "Smart Watch Pro",
    "★★★★★",
    "Amazing product.",
  ],

];


export default function AdminReviews() {

  return (
    <div>

      <div className="page-heading">

        <div>

          <h2>
            Reviews
          </h2>

          <p>
            Moderate customer
            feedback and ratings
          </p>

        </div>

      </div>


      <section className="panel">

        <AdminTable
          headers={[
            "Customer",
            "Product",
            "Rating",
            "Review",
            "Action",
          ]}
        >

          {reviews.map(
            (review) => (

              <tr key={review[0]}>

                <td>
                  <strong>
                    {review[0]}
                  </strong>
                </td>

                <td>
                  {review[1]}
                </td>

                <td className="stars">
                  {review[2]}
                </td>

                <td>
                  {review[3]}
                </td>

                <td>

                  <button className="small-action">
                    Approve
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