/**
 * Register page component.
 *
 * Renders a registration form.
 * Performs client-side validation and displays validation errors.
 * On successful registration, stores a JWT token in localStorage and navigates to the main page.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// validation
import type { FormErrors } from "../../utils/validation/validateRegistrationForm";
import { validateRegistrationForm } from "../../utils/validation/validateRegistrationForm";

/**
 * Registration page component.
 */
export default function RegisterPage() {

  // ============================
  // states
  // ============================

  // State for storing each input value
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for general errors from server
  const [serverError, setServerError] = useState("");

  // State for possible validation errors for each field
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // State for loading symbol
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ============================
  // event handlers
  // ============================

  /**
   * Handles form submission.
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setFormErrors({});
    setLoading(true);


    // Client-side validation for each field
    const errors = validateRegistrationForm(userName, password, confirmPassword);
    if (Object.keys(errors).length > 0) { // at least one field has an error
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    // Send a POST request to the register endpoint with the provided credentials.
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: userName.trim(), password: password.trim() }),
      });

      // If an error was received- visualize the specific message
      if (!res.ok) {
        let errorMessage = "Registration failed";
        try {
          const errorData = await res.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch { }
        throw new Error(errorMessage);
      }

      // Otherwise- store a JWT token in local storage, and navigate to the main page.
      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/"); // main page
    } catch (err: any) {
      setServerError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // render
  // ============================
  return (
    <div className="max-w-md mx-auto mt-24 p-6 rounded-2xl bg-white/90 border border-transparent">
      <h2 className="text-4xl mb-6 text-center font-montserrat-bold text-blue-500">Create an Account</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <div>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username*"
            maxLength={20}
            className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 transition-all ${formErrors.username
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-500"
              }`}
          />
          {formErrors.username && (
            <p className="text-red-500 text-sm mt-1 text-left">{formErrors.username}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password*"
            maxLength={30}
            className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 transition-all ${formErrors.password
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-500"
              }`}
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1 text-left">{formErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password*"
            className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 transition-all ${formErrors.confirmPassword
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-500"
              }`}
          />
          {formErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1 text-left">{formErrors.confirmPassword}</p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <p className="text-red-500 text-sm mt-1">{serverError}</p>
        )}

        {/* Register button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-montserrat-bold cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );

}