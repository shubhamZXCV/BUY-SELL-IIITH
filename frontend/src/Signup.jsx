import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");

  // Check for existing token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  // Handle CAS callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ticket = params.get("ticket");
    // console.log(ticket);
    if (ticket) {
      const validateTicket = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/cas/auth/cas/callback?ticket=${ticket}`
          );
          const data = await response.json();
          console.log(data);
          if (data.success) {
            // Store token and email, then redirect
            localStorage.setItem("token", data.data);
            localStorage.setItem("email", data.email);
            navigate("/profile");
          } else {
            // If user doesn't exist, pre-fill email if available
            if (data.email) {
              setEmail(data.email);
            }
          }
        } catch (error) {
          console.error("Error validating ticket:", error);
          alert("Error during CAS authentication");
        }
      };

      validateTicket();
    }
  }, [location, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    // Merge CAS email with form data
    const submissionData = { ...formData, email: email || formData.email };
    console.log(submissionData);
    try {
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();
      console.log(result);
      if (result.success) {
        localStorage.setItem("token", result.data);
        localStorage.setItem("email", result.email);
        navigate("/profile");
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed");
    }
  };


  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Sign Up</h1>
            <p className="py-6">Register with us :)</p>

           

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2">
                <label className="input input-bordered flex items-center gap-2">
                  <span className="text-xs">Name</span>
                  <input
                    type="text"
                    className="grow"
                    placeholder="John"
                    {...register("name", { required: true })}
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <span className="text-xs">Roll No.</span>
                  <input
                    type="text"
                    className="grow"
                    placeholder="2025XXXXXX"
                    {...register("rollNo", { required: true })}
                  />
                </label>

                {!email && <label className="input input-bordered flex items-center gap-2">
                  <span className="text-xs">Email</span>
                  <input
                    type="text"
                    className="grow"
                    placeholder="john.doe@students.iiit.ac.in"
                    // value={email} // Pre-fill the email field
                    
                    {...register("email", { required: true,pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@(students|research)\.iiit\.ac\.in$/,
                      message: "Invalid email domain",
                    }, })}
                    // readOnly // Make the email field read-only
                  />
                </label>}
                {email && <label className="input input-bordered flex items-center gap-2">
                  <span className="text-xs">Email</span>
                  <input
                    type="text"
                    className="grow"
                    // placeholder="john.doe@students.iiit.ac.in"
                    value={email} // Pre-fill the email field
                    
                    {...register("email", { required: true })}
                    // readOnly // Make the email field read-only
                  />
                </label>}
                <label className="input input-bordered flex items-center gap-2">
                  <span className="text-xs">Age</span>
                  <input
                    type="text"
                    className="grow"
                    placeholder="18"
                    {...register("age", { required: true })}
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <span className="text-xs">Contact</span>
                  <input
                    type="text"
                    className="grow"
                    placeholder="0123456789"
                    {...register("contactNumber", { required: true })}
                  />
                </label>
                {!email && <label className="input input-bordered flex items-center gap-2">
                  <span className="text-xs">Password</span>
                  <input
                    type="text"
                    className="grow"
                    placeholder="********"
                    {...register("password", { required: true })}
                  />
                </label>}

                <input
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  value="Register"
                />
                {isSubmitting && (
                  <span className="loading loading-dots loading-lg m-auto"></span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;