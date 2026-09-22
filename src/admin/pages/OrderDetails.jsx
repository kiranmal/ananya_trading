import { useParams } from "react-router-dom";

export default function OrderDetails() {

  const { id } = useParams();


  return (
    <div>

      <div className="page-heading">

        <div>

          <h2>
            Order #{id}
          </h2>

          <p>
            Order details and
            fulfillment information
          </p>

        </div>

        <span className="status processing">
          Processing
        </span>

      </div>


      <div className="dashboard-grid order-grid">

        {/* Order Items */}

        <section className="panel">

          <h3>
            Order Items
          </h3>


          <div className="order-item">

            <div className="product-thumb">
              👕
            </div>

            <div>

              <strong>
                Premium Cotton Shirt
              </strong>

              <p>
                Size: L · Qty: 2
              </p>

            </div>

            <b>
              ₹2,598
            </b>

          </div>


          <div className="order-item">

            <div className="product-thumb">
              👟
            </div>

            <div>

              <strong>
                Classic Sneakers
              </strong>

              <p>
                Size: 9 · Qty: 1
              </p>

            </div>

            <b>
              ₹2,499
            </b>

          </div>


          <div className="total-line">

            <span>
              Subtotal
            </span>

            <b>
              ₹5,097
            </b>

          </div>


          <div className="total-line">

            <span>
              Shipping
            </span>

            <b>
              ₹100
            </b>

          </div>


          <div className="total-line grand">

            <span>
              Total
            </span>

            <b>
              ₹5,197
            </b>

          </div>

        </section>


        {/* Customer */}

        <section className="panel">

          <h3>
            Customer Information
          </h3>


          <div className="info-list">

            <p>

              <span>
                Name
              </span>

              <strong>
                Rahul Sharma
              </strong>

            </p>


            <p>

              <span>
                Email
              </span>

              <strong>
                rahul@gmail.com
              </strong>

            </p>


            <p>

              <span>
                Phone
              </span>

              <strong>
                +91 9876543210
              </strong>

            </p>


            <p>

              <span>
                Address
              </span>

              <strong>
                Gorakhpur,
                Uttar Pradesh,
                India
              </strong>

            </p>


            <p>

              <span>
                Payment
              </span>

              <strong>
                UPI · Paid
              </strong>

            </p>

          </div>

        </section>

      </div>

    </div>
  );
}