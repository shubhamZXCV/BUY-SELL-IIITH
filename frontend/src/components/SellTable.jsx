import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const SellTable = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [OTP, setOTP] = useState({});
  useEffect(() => {
    const orders = localStorage.getItem("orders");

    if (orders) {
      try {
        const parsedOrders = JSON.parse(orders); // Parse the JSON string into an object
        setOTP(parsedOrders); // Set the parsed object in the state
      } catch (error) {
        console.error("Error parsing orders from localStorage:", error);
      }
    }
   
   

    const fetchSellProducts = async () => {
      const token = localStorage.getItem("token"); // Replace "token" with the key you're using to store the JWT
    
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/order/getSell", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            "Content-Type": "application/json", // Optional, useful for JSON responses
          },
        });

        if (!response.ok) {
          // Handle HTTP errors
          const errorData = await response.json();
          console.error("Error fetching data:", errorData.message);
          return;
        }

        const data = await response.json();
        console.log("Products fetched:", data);
        setProducts(data);
      } catch (error) {
        console.error("Error in fetchBuyProducts:", error.message);
      }
    };

    // Call the function
    fetchSellProducts();
  }, []);
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
           
            <th>Product Name</th>
          
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
                        {/* <div className="text-sm opacity-50">United States</div> */}
                      </div>
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
          
            <th>Price</th>
            <th>Buyer</th>
         
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SellTable;
