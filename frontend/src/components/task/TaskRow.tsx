/**
 * Represents a single task row within a tasks table, providing inline editing and deletion.
 * 
 * - Displays task details
 * - Allows inline editing
 * - Supports deleting the task
 * - Validates input on save using client-side validation.
 */

import { useState } from "react";
import { Check, SquarePen, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import type { FormErrors } from "../../utils/validation/validateTaskForms";
import { validateAddTaskForms } from "../../utils/validation/validateTaskForms";

import type { Project, Task } from "../../utils/helpers/typesHelper";

// Defines the props for the TaskRow component
interface TaskRowProps {
  project: Project;
  task: Task;
  onDelete: (id: number) => void;
  onUpdate: (updatedTask: Task) => void;
  onRequestDelete: (taskId: number) => void;
  onRequestAlert: () => void;
}

/**
 * A table row representing a single task, with inline editing capability.
 * 
 * @param {Project} project - The project that the task belongs to.
 * @param {Task} task - The task to render and edit.
 * @param {Function} onDelete - Function to delete the task.
 * @param {Function} onUpdate - Function to update the task.
 */
export default function TaskRow(props: TaskRowProps) {
  const { project, task, onUpdate, onRequestDelete, onRequestAlert } = props;

  // ============================
  // states
  // ============================
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [titleExpanded, setTitleExpanded] = useState(false);

  // title content: display limited amount of characters
  const maxPreviewChars = 50;
  const isLong = task.title.length > maxPreviewChars;
  const displayedTitle = !titleExpanded && isLong
    ? task.title.slice(0, maxPreviewChars) + "..."
    : task.title;

  /**
 * Requests task deletion via parent handler.
 */
  const handleDeleteClick = () => {
    // inform parent
    onRequestDelete(task.id);
  };

  /**
 * Handles task modification.
 */
  const handleSave = async () => {
    setFormErrors({});

    // Client-side validation
    const errors = validateAddTaskForms(title);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Send a PUT request to the tasks endpoint with the provided credentials.
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          dueDate: dueDate ? new Date(dueDate) : null,
          isCompleted,
        }),
      });

      // If an error was received- visualize the specific message
      if (!res.ok) throw new Error("Failed to update task");

      const updated = await res.json();
      // inform parent that the operation was successful
      onUpdate(updated); 
      setIsEditing(false);
      // inform parent 
      onRequestAlert();
    } catch (err: any) {
      alert("Error saving task: " + err.message);
    }
  };

  /**
   * Cancels edit mode and restores the original task state.
   *
   * Resets all local form fields to match the current task's data,
   * clears validation errors, and exits edit mode.
   */
  const handleCancel = () => {
    setIsEditing(false);
    setTitle(task.title);
    setDueDate(task.dueDate ?? "");
    setIsCompleted(task.isCompleted);
    setFormErrors({});
  };

  // ============================
  // render
  // ============================
  return (
    <tr className="even:bg-white odd:bg-gray-50 hover:bg-blue-50">
      {/* delete */}
      <th className="text-center">
        <button className="text-blue-400 cursor-pointer" onClick={handleDeleteClick}>
          <X className="w-5 h-5" />
        </button>
      </th>

      {/* title */}
      <td className="p-3">
        {isEditing ? (
          <div className="flex flex-col">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className={`w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 ${formErrors.title ? "border-red-500" : "border-gray-300"
                }`}
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
            )}
          </div>
        ) : (
          <p className={`${!titleExpanded ? "line-clamp-2 overflow-hidden" : ""}`}>
            {displayedTitle}
            {isLong && !titleExpanded && (
              <button
                onClick={() => setTitleExpanded(true)}
                className="text-blue-600 underline ml-1 cursor-pointer"
              >
                more
              </button>
            )}
            {isLong && titleExpanded && (
              <button
                onClick={() => setTitleExpanded(false)}
                className="text-blue-600 underline ml-1 cursor-pointer"
              >
                less
              </button>
            )}
          </p>
        )}
      </td>
      {/* due date */}
      <td className="p-1 text-center whitespace-nowrap">
        {isEditing ? (
          <div className="inline-block w-[140px]">
            <DatePicker
              selected={dueDate ? new Date(dueDate) : null}
              onChange={(date) => setDueDate(date ? date.toISOString() : "")}
              minDate={project.creationDate}
              placeholderText="Select date"
              className="w-full px-2 py-1 border rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
              dateFormat="dd/MM/yyyy"
              isClearable
              todayButton="Today"
              showPopperArrow={false}
            />
          </div>
        ) : task.dueDate ? (
          new Date(task.dueDate).toLocaleDateString("en-GB")
        ) : (
          "-"
        )}
      </td>
      {/* status */}
      <td className="p-2 w-32 text-center">
        {isEditing ? (
          <button
            type="button"
            onClick={() => setIsCompleted(!isCompleted)}
            className={`w-full px-2 py-1 rounded-full transition-colors duration-200 ${isCompleted
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {isCompleted ? "Completed" : "In Process"}
          </button>
        ) : (
          <div
            className={`w-full px-2 py-1 rounded-full font-medium cursor-default ${isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
              }`}
          >
            {isCompleted ? "Completed" : "In Process"}
          </div>
        )}
      </td>
      {/* modify */}
      <td className="p-3 w-20 text-center">
        {isEditing ? (
          <div className="flex justify-center gap-2">
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-800 cursor-pointer"
              title="Save"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
            title="Edit"
          >
            <SquarePen className="w-5 h-5" />
          </button>
        )}
      </td>
    </tr>
  );
}
