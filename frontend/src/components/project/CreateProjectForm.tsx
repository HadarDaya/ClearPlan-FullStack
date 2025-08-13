/**
 * A form that allows the user to create a new project.
 * - Includes validation and loading states
 * - Sends POST request to backend to create the project
 */
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { FormErrors } from "../../utils/validation/validateCreateProjectForm";
import { validateCreateProjectForm } from "../../utils/validation/validateCreateProjectForm";

// Props definition for CreateProjectForm
interface CreateProjectFormProps {
  onAdded: () => void;
  onCancel: () => void;
}

/**
 * CreateProjectForm component.
 *
 * Renders a form that allows the user to add a new project.
 * Includes client-side validation and error display.
 * On successful submission – sends the data to the API and triggers the onAdded callback.
 *
 * @param {() => void} props.onAdded - Callback to call after a successful creation.
 * @param {() => void} props.onCancel - Callback to cancel form submission.
 */
export default function CreateProjectForm(props: CreateProjectFormProps) {
  const { onAdded, onCancel } = props;

  // ============================
  // states
  // ============================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serverError, setServerError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  /**
   * Handles form submission.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setFormErrors({});
    setLoading(true);

    // client-side validation
    const errors = validateCreateProjectForm(title, description);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errorMsg = errData.message || "Failed to create project";
        throw new Error(errorMsg);
      }

      setTitle("");
      setDescription("");

      // inform parent that the operation was successful
      onAdded();

    } catch (err: any) {
      setServerError(err.message || "Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // render
  // ============================

  return (
    <div className="max-w-md mx-auto rounded-2xl">
      <section className="bg-white border border-gray-300 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Create project</h2>
        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Add new project form">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project Title*"
              maxLength={100}
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 transition-all ${
                formErrors.title ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {formErrors.title && <p className="text-red-500 text-sm mt-1 text-left">{formErrors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              maxLength={500}
              disabled={loading}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 transition-all resize-none ${
                formErrors.description ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {formErrors.description && <p className="text-red-500 text-sm mt-1 text-left">{formErrors.description}</p>}
          </div>

          {/* Server error */}
          {serverError && <p className="text-red-500 text-sm mt-1 text-center">{serverError}</p>}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-400 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-montserrat-bold cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 rounded-lg transition-colors font-montserrat-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
