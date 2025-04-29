import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  User,
  LogIn,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check if userId exists in localStorage
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black text-white shadow-lg">
      {/* Top bar with contact info */}
      <div className="hidden md:flex justify-between items-center px-8 py-2 bg-gray-900">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Phone size={14} />
            <span className="text-sm">(555) 123-4567</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail size={14} />
            <span className="text-sm">contact@tireshop.com</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <MapPin size={14} />
          <span className="text-sm">123 Wheel Street, Tire City</span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span className="font-bold text-xl tracking-tight">
              <Link to={"/"}>TireZone</Link>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8"></div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="/profile"
                  className="hover:text-red-400 transition-colors"
                >
                  <User />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="/cart"
                  className="hover:text-red-400 transition-colors relative"
                >
                  <ShoppingCart />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="/my-payments"
                  className="hover:text-red-400 transition-colors relative"
                >
                  <Wallet />
                </motion.a>
              </>
            ) : (
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="/login"
                className="flex items-center space-x-1 hover:text-red-400 transition-colors"
              >
                <LogIn size={20} />
                <span>Login</span>
              </motion.a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-900"
        >
          <div className="px-2 pt-2 pb-4 space-y-1">
            <a href="/" className="block px-3 py-2 rounded hover:bg-gray-800">
              Home
            </a>
            <a
              href="/tires"
              className="block px-3 py-2 rounded hover:bg-gray-800"
            >
              Tires
            </a>
            <a
              href="/services"
              className="block px-3 py-2 rounded hover:bg-gray-800"
            >
              Services
            </a>
            <a
              href="/about"
              className="block px-3 py-2 rounded hover:bg-gray-800"
            >
              About
            </a>
            <a
              href="/contact"
              className="block px-3 py-2 rounded hover:bg-gray-800"
            >
              Contact
            </a>

            {isLoggedIn ? (
              <div className="flex space-x-4 px-3 py-2">
                <a href="/profile" className="flex items-center space-x-1">
                  <User size={20} />
                  <span>Profile</span>
                </a>
                <a
                  href="/cart"
                  className="flex items-center space-x-1 relative"
                >
                  <ShoppingCart size={20} />
                  <span>Cart</span>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </a>
              </div>
            ) : (
              <a
                href="/login"
                className="flex items-center space-x-1 px-3 py-2"
              >
                <LogIn size={20} />
                <span>Login</span>
              </a>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default NavBar;
