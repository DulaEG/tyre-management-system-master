import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-4">TireZone</h3>
            <p className="mb-4 text-gray-400">
              Your trusted partner for premium tires and exceptional service
              since 1995.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.2, color: "#1877f2" }}
                href="#"
                className="hover:text-blue-500 transition-colors"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, color: "#1da1f2" }}
                href="#"
                className="hover:text-blue-400 transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, color: "#e1306c" }}
                href="#"
                className="hover:text-pink-500 transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, color: "#ff0000" }}
                href="#"
                className="hover:text-red-600 transition-colors"
              >
                <Youtube size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="/tires"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  All Tires
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="/services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Services
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="/promotions"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Special Offers
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="/appointments"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Book Appointment
                </motion.a>
              </li>
              <li>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Wheel Street, Tire City, TC 12345
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={20} className="flex-shrink-0" />
                <span className="text-gray-400">(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={20} className="flex-shrink-0" />
                <span className="text-gray-400">contact@tirezone.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Hours</h4>
              <p className="text-gray-400">Mon-Fri: 8AM - 6PM</p>
              <p className="text-gray-400">Sat: 9AM - 5PM</p>
              <p className="text-gray-400">Sun: Closed</p>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to receive updates on new products and special
              promotions.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} TireZone. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="/privacy"
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/sitemap"
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
