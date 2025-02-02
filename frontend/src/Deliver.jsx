import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Deliver = () => {
  const navigate = useNavigate();
  const [products, setProduct] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token){
      navigate("/login");
      return;
    }

    const fetchPendingOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/order/pending-orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching pending orders:", errorData.message);
          return null;
        }

        const data = await response.json();
        console.log("Pending Orders:", data.products);
        setProduct(data.products);
        return data.products;
      } catch (error) {
        console.error("Network or server error:", error);
        return null;
      }
    };

    fetchPendingOrders();
  }, []);

  const [otp, setOtp] = useState("");

  const handleSubmit = async (buyerEmail, productId) => {
    // Fetch the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (!otp || !buyerEmail || !token) {
      return;
    }

    try {
      // Send the OTP, buyerEmail, and token to the backend for verification using fetch

      const response = await fetch(
        "http://localhost:5000/api/order/verify-otp",
        {
          // Replace with your backend URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp,
            buyerEmail,
            token,
            productId,
          }),
        }
      );

      // Check if the response is successful
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert("otp verified!!!");
        navigate("/orderHistory");
      } else {
        const data = await response.json();
        console.log(data);
        alert("incorrect otp!!!");
      }
    } catch (err) {
      // Handle network or unexpected errors
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl">Delivery</h1>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Product Name</th>
              <th>OTP</th>
              <th>Price</th>
              <th>Buyer</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}

            {products.length > 0 ? (
              products.map((product) => {
                return (
                  <tr>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={product.imageUrl}
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center flex-wrap">
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          className="input input-bordered input-sm w-full max-w-xs"
                          onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            handleSubmit(product.buyerEmail, product._id);
                          }}
                        >
                          Confirm
                        </button>
                      </div>
                    </td>
                    <td>{product.price}</td>
                    <td>{product.buyerEmail}</td>
                    <th>
                      <button
                        className="btn btn-primary btn-xs"
                        onClick={() => {
                          navigate(`/product/${product._id}`);
                        }}
                      >
                        details
                      </button>
                    </th>
                  </tr>
                );
              })
            ) : (
              <div>You have not placed any order</div>
            )}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th>Product Name</th>
              <th>OTP</th>
              <th>Price</th>
              <th>seller</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Deliver;
