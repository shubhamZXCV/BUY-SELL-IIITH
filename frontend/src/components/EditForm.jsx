import React from "react";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
const EditForm = () => {
  // const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {

    const token = localStorage.getItem("token");

    const cleanedObj = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '')
    );
    cleanedObj.token = token;
    console.log(cleanedObj);
    

    const req = new Request("http://localhost:5000/api/user/edit", {
      method: "POST",
      body: JSON.stringify(cleanedObj),
      headers: {
        "Content-Type": "application/json", // Add headers
      },
    });

    const res = await fetch(req);
    const body = await res.json();
  
    console.log(res.status);
    console.log(body);
  };

  return (
    <div className="modal-box">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label className="input input-bordered flex items-center gap-2">
            <span className="text-xs">Name</span>
            <input
              type="text"
              className="grow"
              placeholder="John"
              {...register("name")}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <span className="text-xs">Roll No</span>
            <input
              type="text"
              className="grow"
              placeholder="Doe"
              {...register("rollNo")}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <span className="text-xs">Age</span>
            <input
              type="text"
              className="grow"
              placeholder="18"
              {...register("age")}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <span className="text-xs">Contact</span>
            <input
              type="text"
              className="grow"
              placeholder="0123456789"
              {...register("contactNumber")}
            />
          </label>

          <input
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            value="Edit"
          />
          {isSubmitting && (
            <span className="loading loading-dots loading-lg m-auto"></span>
          )}
        </div>
      </form>
      <div className="modal-action">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn">Close</button>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
