import React from "react";
import { useNavigate } from "react-router-dom";
const ProductCard = (props) => {
  const navigate = useNavigate();
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
           className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-400"
           onClick={() => navigate(`/product/${props.productId}`)}

           >
            Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
