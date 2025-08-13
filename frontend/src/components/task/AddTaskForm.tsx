/**
 * A form that allows the user to add a new task to a given project.
 * - Includes validation and loading states
 * - Sends POST request to backend to create the task
 */
import { useState } from "react";
import { Loader2 } from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import type { FormErrors } from "../../utils/validation/validateTaskForms";
import { validateAddTaskForms } from "../../utils/validation/validateTaskForms";

import type { Project } from "../../utils/helpers/typesHelper";

// Props definition for AddTaskForm
interface AddTaskFormProps {
  project: Project;
  onAdded: () => void;
  onCancel: () => void;
}

/**
 * Renders a form for adding a new task to a given project.
 * Handles form validation, task submission, and user feedback.
 *
 * @param {Project} props.project - The project to which the task will be added.
 * @param {Function} props.onAdded - Callback triggered after a successful task creation.
 * @param {Function} props.onCancel - Callback triggered when the user cancels the form.
 */
export default function AddTaskForm(props: AddTaskFormProps) {
  const { project, onAdded, onCancel } = props;

  // ============================
  // states
  // ============================
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState(""); // Error message if fetching fails
  const [loading, setLoading] = useState(false); // Loading state for initial data fetch

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setFormErrors({});
    setLoading(true);

    // Client-side validation for each field
    const errors = validateAddTaskForms(title);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    // Send a POST request to the login endpoint with the provided credentials.
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/projects/${project.id}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          dueDate: dueDate || null,
          isCompleted,
        }),
      });
      // If an error was received- visualize the specific message
      if (!res.ok) {
        let msg = "Failed to create task";
        try {
          const err = await res.json();
          if (err.message) msg = err.message;
        } catch { }
        throw new Error(msg);
      }

      setTitle("");
      setDueDate(null);
      setIsCompleted(false);
      onAdded();
    } catch (err: any) {
      setServerError(err.message || "Failed to add task");
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
        <h2 className="text-lg font-semibold text-gray-800">Add Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Add new task form">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title*"
              maxLength={100}
              disabled={loading}
              className={`px-8 py-2 border rounded-lg outline-none focus:ring-2 transition-all ${formErrors.title ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
                }`}
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1 text-left">{formErrors.title}</p>
            )}
          </div>
          {/* Due Date */}
          <div>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              minDate={project.creationDate} // begin with the date in which the project was created
              placeholderText="Select due date"
              disabled={loading}
              className="w-full px-8 py-2 border rounded-lg outline-none border-gray-300 focus:ring-blue-500 focus:ring-2"
              dateFormat="dd/MM/yyyy"
              isClearable
              todayButton="Today"
              showPopperArrow={false}
            />
          </div>
          {/* Completed */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCompleted"
              checked={isCompleted}
              onChange={() => setIsCompleted(!isCompleted)}
              disabled={loading}
              className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="isCompleted" className="text-md text-gray-700">Completed</label>
          </div>

          {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-400 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer font-montserrat-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add"
              )}
            </button>
            {/* Cancel */}
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 rounded-lg transition-colors cursor-pointer font-montserrat-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
