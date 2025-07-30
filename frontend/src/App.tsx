/**
 * Main application component.
 *
 * Sets up client-side routing using React Router.
 * Wraps all pages within a shared layout (`AppLayout`).
 * Routes:
 * - '/'           Home page
 * - '/login'      Login form
 * - '/register'   Registration form
 * - '/projects'   User's projects dashboard
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/layout/HomePage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ProjectsPage from "./components/project/ProjectsPage";
import AppLayout from "./components/layout/AppLayout";

/**
 * Renders the root of the app with routing configuration.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}