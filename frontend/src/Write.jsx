import React from "react";
import { useForm } from "react-hook-form";

const Write = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/review/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        alert("Review sent successfully");
      } else {
        alert(result.error || "Failed to send review");
      }
    } catch (error) {
      console.error("Error sending review:", error);
      alert("Error sending review");
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col w-full max-w-md mx-auto p-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="email"
              className="grow"
              placeholder=""
              {...register("receiverEmail", {
                required: "Receiver email is required",
              })}
            />
          </label>

         
          {errors.receiverEmail && (
            <p className="text-red-500 text-sm">
              {errors.receiverEmail.message}
            </p>
          )}

          <textarea
            className="textarea"
            placeholder="Your Message"
            {...register("message", { required: "Message cannot be empty" })}
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message.message}</p>
          )}

          <input
            type="submit"
            value="Send"
            className="btn btn-primary"
            disabled={isSubmitting}
          />
          {isSubmitting && (
            <span className="loading loading-dots loading-lg m-auto"></span>
          )}
        </div>
      </form>
    </div>
  );
};

export default Write;
