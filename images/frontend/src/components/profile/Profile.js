import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";

function Profile() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="profile">
      <Navbar />
      <h2>Profile</h2>
    </div>
  );
}

export default Profile;
