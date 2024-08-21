import React from 'react';
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <div>
      <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
        <div className="flex items-center gap-10 z-50">
          <Link to="/">
            <img
              src="/netflix-logo.png"
              alt="NETFLIX LOGO"
              className="w-32 sm:w-40"
            />
          </Link>

          <div className="hidden sm:flex gap-2 items-center">
            <Link to="/"> Movies</Link>
            <Link to="/"> Tv Shows</Link>
            <Link to="/history"> Search History</Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
