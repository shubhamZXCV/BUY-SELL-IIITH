import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import FilterForm from "./components/FilterForm";
import { useNavigate } from "react-router-dom";
const Feed = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState([]);
  const [products , setProducts] = useState([]);
  const handleApplyFilters = (selectedfilters) => {
    setFilters(selectedfilters); 
  };

  const navigate = useNavigate();

  useEffect(() => {

    const fetchProducts = async () => {
      const token  = localStorage.getItem('token');
      if(!token){
        navigate('/login');
        return;
      }
      try {
        // Construct the query parameters
        const queryParams = new URLSearchParams();

        if (searchTerm) {
          queryParams.append("searchTerm", searchTerm);
        }

        if (filters && filters.length > 0) {
          queryParams.append("filters", filters.join(",")); // Convert array to comma-separated string
        }

        // Backend API endpoint with query parameters
        const url = `http://localhost:5000/api/product/search?${queryParams.toString()}`;

        // Send GET request
        const response = await fetch(url, {
          method: "GET",
        });

        // Handle response
        if (!response.ok) {
          return;
          // throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Products:", data);
        console.log(data);
        setProducts(data.data);

        // return data; // Return the response data
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    };
    fetchProducts();
  }, [searchTerm, filters]);


  return (
    <div className="bg-base-200 min-h-screen flex flex-col items-center  gap-5 p-5">

      <div className="flex gap-1 items-center justify-center">
        <input
          type="text"
          placeholder="Search.."
          className="input input-bordered input-lg w-full max-w-xs"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        
        <button
          className="btn"
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="None"
            stroke="oklch(0.6569 0.196 275.75)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </button>
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <FilterForm onApply={handleApplyFilters} />
        </dialog>
      </div>

      <div className=" w-full flex gap-3 flex-wrap items-center justify-center">
        {products.length>0 ? (
          products.map((product) => {
            return (
              <ProductCard
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                sellerEmail={product.sellerEmail}
                productId= {product._id}
              />
            );
          })
        ) : (
          <div>No product to display</div>
        )}
      </div>
    </div>
  );
};

export default Feed;
