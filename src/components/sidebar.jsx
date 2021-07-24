import React from "react";
import { Link } from "react-router-dom";
import logo from "../img/logo.png";
import lupa from "../img/lupa.png";

export default function Sidebar() {
  // Sidebar JSX
  return (
    <div className="sidebar">
      <div className="sidebarLogo">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      <div className="sidebar-wrapper">
        <Link className="sidebarButton" to="/"><p>Usuarios</p></Link>
      </div>
      <div className="sidebar-wrapper">
        <Link className="sidebarButton" to="/generos"><p>Géneros</p></Link>
      </div>
      <div className="sidebar-wrapper">
        <Link className="sidebarButton" to="/libro"><p>Libros</p></Link>
      </div>
      <div className="sidebar-footimg">
        <img src={lupa} className="App-logo" alt="lupa" />
      </div>
    </div>
  );
};
