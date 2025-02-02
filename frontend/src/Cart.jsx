import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartProductCard from "./components/CartProductCard.jsx";

const Cart = () => {
  const [cartProducts, setCartProduct] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate  = useNavigate()
  useEffect(() => {
    
    const fetchCartProduct = async () => {
      const token = localStorage.getItem("token");
      if(!token){
        navigate("/login");
        return;
      }

      const url = `http://localhost:5000/api/cart/get?token=${token}`;

      const response = await fetch(url);
      if (!response.ok) {
        setCartProduct([]);
        return;
        // throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setCartProduct(data.products);
      const totalPrice = data.products.reduce((acc, obj) => acc + obj.price, 0);
      console.log(totalPrice);
      setTotalPrice(totalPrice);
    };

    fetchCartProduct();
  }, []);

  const handlePlaceOrder = async () => {
    // Retrieve buyerEmail from localStorage
    const buyerEmail = localStorage.getItem("email");
  
    // Group product IDs by sellerEmail
    const groupedBySeller = cartProducts.reduce((acc, product) => {
      const { sellerEmail, _id } = product;
      if (!acc[sellerEmail]) {
        acc[sellerEmail] = [];
      }
      acc[sellerEmail].push(_id); // Add product ID to the respective seller
      return acc;
    }, {});
  
    // Prepare the request body
    const requestBody = {
      buyerEmail, // Buyer's email retrieved from local storage
      sellers: Object.entries(groupedBySeller).map(([sellerEmail, productIds]) => ({
        sellerEmail,
        productIds,
      })),
    };
  
    const endpoint = "http://localhost:5000/api/order/place";
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Convert the requestBody object to JSON
      });
  
      if (response.ok) {
        const result = await response.json(); // Parse the response to get orders
        const newOrders = result.orders; // Extract new orders from the response
  
        // Update orders in localStorage
        const existingOrdersJSON = localStorage.getItem("orders");
        let ordersMap = {};
  
        if (existingOrdersJSON) {
          // If orders exist, parse them into an object
          ordersMap = JSON.parse(existingOrdersJSON);
        }
  
        // Add new orders to the orders map
        newOrders.forEach((order) => {
          ordersMap[order.productId] = order.otp; // Use productId as the key and otp as the value
        });
  
        // Save updated orders map back to localStorage
        localStorage.setItem("orders", JSON.stringify(ordersMap));
        console.log("Updated orders saved to localStorage:", ordersMap);
  
        // Clear the cart
        const clearCartResponse = await fetch(
          `http://localhost:5000/api/cart/clear/${buyerEmail}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (clearCartResponse.ok) {
          const result = await clearCartResponse.json();
          console.log("Cart deleted successfully:", result);
        } else {
          const error = await clearCartResponse.json();
          console.error("Error deleting cart:", error.message);
        }
  
        alert("Order placed Successfully");
        navigate("/orderHistory");
      } else {
        alert("Sorry, can't place order");
      }
    } catch (err) {
      console.error("Error in handlePlaceOrder:", err);
      alert("An error occurred while placing the order. Please try again.");
    }
  };
  
  
  

  return (
    <div className="flex flex-col items-center bg-base-200 min-h-screen  gap-5">
      <h3 className="font-bold text-5xl m-3">My Cart</h3>
      <div className="stats shadow">
        <div className="stat flex flex-col items-center">
          <div className="stat-title">Total Cart Value</div>
          <div className="stat-value">{totalPrice}</div>
         {cartProducts.length>0 &&  <button class="btn btn-primary" onClick={handlePlaceOrder}>
          
            Place order
          </button>}
         {cartProducts.length==0 &&  <button class="btn btn-primary" onClick={()=>{navigate("/feed")}}>
            Explore
          </button>}
        </div>
      </div>
      <div className=" w-full flex gap-3 flex-wrap items-center justify-center">
        {cartProducts.length>0 ? (
          cartProducts.map((product) => {
            return (
              <CartProductCard
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                sellerEmail={product.sellerEmail}
                productId={product._id}
              />
            );
          })
        ) : (
          <div>Cart is empty</div>
        )}
      </div>
    </div>
  );
};

export default Cart;
