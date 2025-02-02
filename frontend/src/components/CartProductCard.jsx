import React from 'react'
import {useNavigate} from 'react-router-dom';


const CartProductCard = (props) => {
    const navigate = useNavigate();
    const removeFromCart=async (productId)=> {
        const url = 'http://localhost:5000/api/cart/remove'; // Your API endpoint
      
        // Request payload
        const token  = localStorage.getItem("token");
        const body = JSON.stringify({
          token,
          productId
        });
      
        try {
          // Send DELETE request
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json', // Specify JSON payload
            },
            body
          });
      
          // Parse the response
          const data = await response.json();
      
          if (response.ok) {
            console.log('Product removed from cart:', data);
            navigate("/feed");
            return data;
          } else {
            console.error('Error removing product from cart:', data.message);
            throw new Error(data.message);
          }
        } catch (error) {
          console.error('Request failed:', error.message);
          throw error;
        }
      }
  return (
    <div className="max-w-sm bg-base  rounded-lg shadow-lg overflow-hidden">
      {/* Image Section */}
      <div className="overflow-hidden">
        <img
          src={props.imageUrl}
          alt={props.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold  truncate">
          {props.name}
        </h2>
        <p className="text-sm text-gray-500 mb-2">{props.sellerEmail}</p>

        {/* Price and Action */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-indigo-500">
            ₹{props.price}
          </span>
          <button
           className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg  focus:outline-none focus:ring-2 "
           onClick={()=>{removeFromCart(props.productId)}}

           >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartProductCard
