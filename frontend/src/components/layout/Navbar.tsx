/**
 * This component renders the top navigation bar of the application.
 * It displays the app name, authentication-related links, and a dropdown menu for logged-in users.
 * It adapts based on authentication state by reading from the JWT token.
 * 
 * Features:
 * - Shows guest links (Login / Register) if user is not authenticated
 * - Displays the user's name and a dropdown menu if authenticated with options for "My Projects" and "Logout"
 */
import { Link, useNavigate } from "react-router-dom";
import { getUserNameFromToken, logout } from "../../utils/helpers/authHelper";
import { useState, useRef, useEffect } from "react";
import { UserRound } from "lucide-react";

/**
 * A navigation bar component used across all pages.
 * Automatically adapts its content based on the user's authentication status.
 */
export default function Navbar() {
  const username = getUserNameFromToken(); // Get current username from JWT token (or null)
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Controls dropdown menu visibility
  const menuRef = useRef<HTMLDivElement>(null); // Reference to the dropdown container, used for outside-click detection

  // Logs out the current user and navigates to the homepage
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close dropdown menu if clicked outside the menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-transparent px-6 py-4 flex justify-between items-center font-montserrat-bold relative">
      {/* ClearPlan Name */}
      <Link to="/" className="text-2xl font-bold text-white tracking-wide">
        ClearPlan
      </Link>

      {/* Current user and navigation links */}
      <div className="flex items-center space-x-6">
        {!username ? (
          // If user is not logged in
          <>
            <div className="flex items-center text-white space-x-2">
              <UserRound size={20} />
              <span className="font-medium">guest</span>
            </div>
            <Link
              to="/login"
              className="text-white hover:text-blue-600 transition font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white hover:text-blue-600 transition font-medium"
            >
              Register
            </Link>
          </>
        ) : (
          // If user is logged in
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 text-white font-medium cursor-pointer"
            >
              <UserRound size={20} />
              <span>{username}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 w-40 bg-white/30 rounded-md z-50">
                <Link
                  to="/projects"
                  className="block px-4 py-2 text-white hover:text-blue-600 bg-gray-500/10 cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  My Projects
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-white hover:text-blue-600 bg-gray-500/10 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
