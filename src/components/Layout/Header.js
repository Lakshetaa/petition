import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, PlusSquare, Vote, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <header className="bg-teal-700 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight flex items-center">
            <Vote className="mr-2" size={28} />
            PetitionPlatform
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-teal-200 transition-colors">
              Home
            </Link>

            {user ? (
              <>
                <Link to="/create-petition" className="hover:text-teal-200 transition-colors">
                  Create Petition
                </Link>
                <Link to="/dashboard" className="hover:text-teal-200 transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="hover:text-teal-200 transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-teal-800 hover:bg-teal-600 px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-teal-200 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-800 hover:bg-teal-600 px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="flex items-center py-2 hover:text-teal-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Home size={18} className="mr-2" /> Home
              </Link>

              {user ? (
                <>
                  <Link
                    to="/create-petition"
                    className="flex items-center py-2 hover:text-teal-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <PlusSquare size={18} className="mr-2" /> Create Petition
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center py-2 hover:text-teal-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Vote size={18} className="mr-2" /> Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center py-2 hover:text-teal-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={18} className="mr-2" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center py-2 text-left w-full hover:text-teal-200 transition-colors"
                  >
                    <LogOut size={18} className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="py-2 hover:text-teal-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="py-2 bg-teal-800 hover:bg-teal-600 px-4 rounded-md transition-colors inline-block"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
