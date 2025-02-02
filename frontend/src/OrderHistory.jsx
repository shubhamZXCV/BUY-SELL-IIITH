import React, { useEffect, useState } from "react";
import BuyTable from "./components/BuyTable";
import SellTable from "./components/SellTable";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("buy"); // State to manage active tab
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token){
      navigate("/login");
      return;
    }
  },[]);
  return (
    <div className="bg-base-200 min-h-screen">
      {/* Tabs */}
      <div role="tablist" className="tabs tabs-lifted">
        <a
          role="tab"
          className={`tab ${activeTab === "buy" ? "tab-active text-primary" : ""}`}
          onClick={() => setActiveTab("buy")}
        >
          Buy
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === "sell" ? "tab-active text-primary" : ""}`}
          onClick={() => setActiveTab("sell")}
        >
          Sell
        </a>
      </div>

      {/* Conditionally Render Tables */}
      {activeTab === "buy" ? <BuyTable /> : <SellTable />}
    </div>
  );
};

export default OrderHistory;
