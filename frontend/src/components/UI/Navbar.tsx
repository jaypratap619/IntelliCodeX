import React from "react";
import { FaLaptopCode, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router";

const Navbar: React.FC = () => {
  return <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
    <Link to={{
      pathname: "/",
    }}
      className="flex items-center space-x-3">
      <FaLaptopCode className="text-2xl text-blue-400" />
      <span className="text-xl font-bold">IntelliCodeX</span>
    </Link>
    <div className="flex items-center space-x-4">
      <FaUserCircle className="text-2xl" />
      <button className="bg-blue-600 px-4 py-1 rounded">Login</button>
    </div>
  </nav>
};
export default Navbar;