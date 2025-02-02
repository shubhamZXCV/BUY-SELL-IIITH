import React, { useEffect } from "react";
import EditForm from "./components/EditForm";
import SellForm from "./components/SellForm"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({ user: { email: "email" } });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return; // Exit if there's no token
      }

      const req = { token: token };

      try {
        const response = await fetch("http://localhost:5000/api/user/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        });

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch user details");
        }

        setUserDetails(data); // Store the user details in state
      } catch (err) {
        // setUserDetails(null); // Clear user details
      }
    };

     fetchData();
  }, [navigate]);

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Profile</h1>
          {/* <p className="py-6">Your One-Stop Shop on Campus!</p> */}
          <div>
            <div className="card bg-base-100  shadow-xl">
              <figure>
                <div className="avatar m-3">
                  <div className="w-24 rounded-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                  </div>
                </div>
              </figure>
              <div className="flex flex-col items-center justify-center gap-2 p-2">
                <div className="flex justify-between items-center w-full flex-wrap">
                  <span className="text-xs p-1  w-12 rounded ">Name</span>
                  <span> {userDetails.user && userDetails.user.name}</span>
                </div>
                <div className="flex items-center justify-between  w-full">
                  <span className="text-xs p-1 w-12 rounded ">Roll No</span>
                  <span>{userDetails.user && userDetails.user.rollNo}</span>
                </div>
                <div className="flex items-center justify-between  w-full">
                  <span className="text-xs p-1 w-12 rounded">email</span>
                  <span>{userDetails.user && userDetails.user.email}</span>
                </div>
                <div className="flex items-center justify-between  w-full">
                  <span className="text-xs p-1 w-12 rounded ">Age</span>
                  <span>{userDetails.user && userDetails.user.age}</span>
                </div>
                <div className="flex items-center justify-between  w-full">
                  <span className="text-xs p-1 w-12 rounded  ">Contact</span>
                  <span>
                    {userDetails.user && userDetails.user.contactNumber}
                  </span>
                </div>

                <div className="flex justify-between w-full">
                  {/* edit button */}
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      document.getElementById("my_modal_edit").showModal()
                    }
                  >
                    Edit
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z" />
                      </g>
                    </svg>
                  </button>

                  {/* sell button  */}
                  <button
                    className="btn btn-primary "
                    onClick={() =>
                      document.getElementById("my_modal_sell").showModal()
                    }
                  >
                    SELL
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#000000"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                    </svg>
                  </button>
                </div>

                <dialog
                  id="my_modal_edit"
                  className="modal modal-bottom sm:modal-middle"
                >
                  <EditForm  />
                </dialog>
                <dialog
                  id="my_modal_sell"
                  className="modal modal-bottom sm:modal-middle"
                >
                  <SellForm />
                </dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
