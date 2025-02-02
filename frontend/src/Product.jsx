import React from "react";
import { useParams ,useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";



const Product = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { productId } = useParams();

  const handleClickCart=async (sellerEmail)=>{

    const buyerEmail = localStorage.getItem("email");
    if(buyerEmail == sellerEmail){
      alert("You cant buy your own products!!!");
      return;
    }

      const url = "http://localhost:5000/api/cart/add";

      const token = localStorage.getItem("token");


    // Request payload
    const body = JSON.stringify({
      token:token,
      productId:productId
    });
  
    try {
      // Send POST request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify JSON payload
        },
        body
      });
  
      // Parse the response
      const data = await response.json();
  
      if (response.ok) {
        console.log('Product added to cart:', data);
        alert("product added to cart!!");
        navigate("/feed")
        return data;
      } else {
        console.error('Error adding product to cart:', data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Request failed:', error.message);
      throw error;
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product with ID:", productId);

        // Backend API endpoint with productId in the URL
        const url = `http://localhost:5000/api/product/get?productId=${productId}`;

        // Send GET request
        const response = await fetch(url, {
          method: "GET",
        });

        // Handle response
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Product data:", data);
        setProduct(data.data); // Assuming 'data' contains the product info inside 'data'
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        {product ? (
          <div className="card lg:card-side bg-base-100 shadow-xl flex">
            <figure className="flex-1">
              <img
                src={product.imageUrl}
                alt="Album"
                className="w-48"
              />
            </figure>
            <div className="card-body flex-1">
              <h2 className="card-title">{product.name}</h2>
              <p className="text-info">{product.sellerEmail}</p>
              <p className="">{product.description}</p>
              <div className="card-actions justify-end">
                <span className="text-info text-xl">{product.price}</span>
                {!product.sold && <button className="btn btn-primary" onClick={()=>{handleClickCart(product.sellerEmail)}}>Cart</button>}
              </div>
            </div>
          </div>
        ) : (
          <div>No info to display</div>
        )}
      </div>
    </div>
  );
};

export default Product;
