import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import GoogleRecaptcha from "./components/GoogleRecaptcha";
import Cas from "./components/Cas";

const Login = () => {
  const [captchaToken, setCaptchaToken] = useState(null); // State to store CAPTCHA token
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: {  isSubmitting },
  } = useForm();

 

  const onSubmit = async (data) => {
    console.log(captchaToken);
    if (!captchaToken) {
      alert("Please complete the CAPTCHA before logging in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/verify-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token:captchaToken }),
      });

      const data = await response.json();
      console.log("Verification response:", data);
      if(data.success){
        console.log("google recaptcha verified!!!");
      }else{
        console.log("google recaptcha failed!!!");
        return;
      }
    } catch (error) {
      console.error("Error verifying reCAPTCHA:", error);
      return;
    }

    // Include CAPTCHA token in the request
    const requestData = {
      ...data,
      captchaToken,
    };

    const req = new Request("http://localhost:5000/api/user/login", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await fetch(req);
    const body = await res.json();

    if (body.success) {
      localStorage.setItem("token", body.data);
      localStorage.setItem("email", body.email);
      navigate("/profile");
    } else {
      alert("Invalid credentials or CAPTCHA verification failed.");
    }
  };

  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Login</h1>
            <p className="py-6">Welcome back !!!</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
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
                    type="text"
                    className="grow"
                    placeholder="Email"
                    {...register("email", { required: true })}
                  />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="password"
                    className="grow"
                    placeholder="Password"
                    {...register("password", { required: true })}
                  />
                </label>
                {/* Google reCAPTCHA */}
                <GoogleRecaptcha onVerify={setCaptchaToken} />
                <input
                  className="btn btn-primary"
                  value="Login"
                  type="submit"
                  disabled={isSubmitting}
                />
                <Cas />
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

export default Login;
