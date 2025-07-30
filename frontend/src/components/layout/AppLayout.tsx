/**
 * This file defines the global layout used across all application pages.
 * This layout includes a top navigation bar ('Navbar') and a dynamic content area (`Outlet`).
 */
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * A layout component that wraps all routes with consistent structure and styling.
 * Includes a top Navbar and a main content section where matched routes are rendered.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen font-montserrat-reg">
      {/* Top navigation bar */}
      <Navbar />
      {/* Dynamic content based on current route */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}