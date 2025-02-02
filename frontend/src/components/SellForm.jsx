import React from "react";
import { useForm } from "react-hook-form";

const SellForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

     
      data.token = token;

      console.log(data);
     

      const req = new Request("http://localhost:5000/api/product/list", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await fetch(req);
      const body = await res.json();

      if (!res.ok) {
        console.error("Failed to submit:", body.message || "Unknown error");
        return;
      }

      console.log("Success:", body);
      alert("Product Listed succesfully!!!");
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <div className="modal-box">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          {/* Product Name */}
          <label className="input input-bordered flex items-center gap-2">
            <span className="text-xs">Product Name</span>
            <input
              type="text"
              className="grow"
              placeholder="Maggie"
              {...register("name", { required: "Product name is required" })}
            />
          </label>
          {errors.productName && (
            <span className="text-red-500 text-xs">
              {errors.productName.message}
            </span>
          )}

          {/* Image URL */}
          <label className="input input-bordered flex items-center gap-2">
            <span className="text-xs">Image URL</span>
            <input
              type="text"
              className="grow"
              placeholder="https://example.com/image.jpg"
              {...register("imageUrl", { required: "Image URL is required" })}
            />
          </label>
          {errors.imageUrl && (
            <span className="text-red-500 text-xs">
              {errors.imageUrl.message}
            </span>
          )}

          {/* Category */}
          <label className="flex items-center gap-2">
            <span className="text-xs">Category</span>
            <select
              className="select w-full max-w-xs border"
              {...register("category", { required: "Category is required" })}
              defaultValue=""
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="furniture">Furniture</option>
              <option value="books">Books</option>
              <option value="grocery">Grocery</option>
              <option value="games">Games</option>
              <option value="beauty">Beauty</option>
              <option value="health">Health</option>
            </select>
          </label>
          {errors.category && (
            <span className="text-red-500 text-xs">{errors.category.message}</span>
          )}

          {/* Price */}
          <label className="input input-bordered flex items-center gap-2">
            <span className="text-xs">Price</span>
            <input
              type="number"
              className="grow"
              placeholder="100"
              {...register("price", {
                required: "Price is required",
                min: { value: 1, message: "Price must be greater than 0" },
              })}
            />
          </label>
          {errors.price && (
            <span className="text-red-500 text-xs">{errors.price.message}</span>
          )}

          {/* Description */}
          <textarea
            className="textarea textarea-bordered"
            placeholder="Product description"
            {...register("description", { required: "Description is required" })}
          ></textarea>
          {errors.description && (
            <span className="text-red-500 text-xs">
              {errors.description.message}
            </span>
          )}

          {/* Submit */}
          <input
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            value="SELL"
          />
          {isSubmitting && (
            <span className="loading loading-dots loading-lg m-auto"></span>
          )}
        </div>
      </form>
      <div className="modal-action">
        <form method="dialog">
          <button className="btn">Close</button>
        </form>
      </div>
    </div>
  );
};

export default SellForm;
