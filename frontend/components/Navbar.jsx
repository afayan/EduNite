import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../pages/Landing.css";
import useLogin from "../hooks/useLogin";

const Navbar = () => {

  const [loading, userid, islogged] = useLogin()

  return (
    <nav>
      <div className="logo">
        <Link to="/">Empowering Education</Link>
      </div>
      <div className="menu">
        <Link to="/about">About Us</Link>

        {!loading && !islogged && <Link to="/login">Login</Link>}
       {!loading && !islogged && <Link to="/signup">Signup</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
