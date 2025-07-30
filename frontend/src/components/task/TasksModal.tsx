/**
 * Modal component for displaying and managing tasks for a specific project.
 *
 * - Fetches tasks from the backend based on the selected project (on parent)
 * - Displays loading/error messages and a table of tasks.
 * - Includes a form to add new tasks.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTaskForm from "./AddTaskForm";
import TasksTable from "./TasksTable";
import { getUserIdFromToken } from "../../utils/helpers/authHelper";
import type { Project, Task } from "../../utils/helpers/typesHelper";
import CustomDialog from "../layout/CustomDialog";

interface TaskModalProps {
  project: Project;
  onClose: () => void;
}

/**
 * Displays a modal showing the tasks of a specific project.
 * Allows adding new tasks and viewing them in a table.
 *
 * @param {Project} props.project - The project whose tasks are displayed.
 * @param {Function} props.onClose - Function to close the modal.
 */
export default function TaskModal(props: TaskModalProps) {
  const { project, onClose } = props;

  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  // ============================
  // state
  // ============================
  const [tasks, setTasks] = useState<Task[]>([]); // List of tasks for the project
  const [loading, setLoading] = useState(true);   // Indicates whether tasks are being fetched
  const [error, setError] = useState("");         // Holds error messages, if any
  const [showAddForm, setShowAddForm] = useState(false); // Toggle to show/hide the add task form
  const [successDialogOpen, setSuccessDialogOpen] = useState(false); // state of confirm dialog

  /**
   * Fetches tasks whenever the project changes.
   */
  useEffect(() => {
    fetchTasks();
  }, [project]);

  /**
   * Fetches tasks for the current project from the backend.
   * Handles loading state and errors.
   */
  const fetchTasks = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/projects/${project.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let errorMsg = "Failed to fetch tasks";
        try {
          const errData = await res.json();
          if (errData.message) errorMsg = errData.message;
        } catch {}
        throw new Error(errorMsg);
      }

      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Called when a task is successfully added.
   * Closes the add form and reloads the task list.
   */
  const onTaskAdded = () => {
    setShowAddForm(false);
    fetchTasks();
    setSuccessDialogOpen(true); // show dialog
  };

  // ============================
  // render
  // ============================
  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-5xl relative">
        <h2 className="text-xl font-bold mb-4 text-blue-800">
          Tasks for Project: {project.title}
        </h2>

        {/* Add New Task toggle button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-400 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-colors font-montserrat-bold cursor-pointer"
            aria-expanded={showAddForm}
            aria-controls="add-task-form"
          >
            Add New Task
          </button>
        </div>

        {/* Add New Task form */}
        {showAddForm && (
          <div id="add-task-form" className="mt-6">
            <AddTaskForm
              project={project}
              onAdded={onTaskAdded}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Tasks table */}
        {loading ? (
          <p className="text-blue-500 text-center">Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-600 text-center">You don't have any tasks yet.</p>
        ) : (
          <TasksTable project={project} tasks={tasks} setTasks={setTasks} />
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          ✕
        </button>

        {/* Success dialog */}
        <CustomDialog
          isOpen={successDialogOpen}
          title="Task was added"
          message="Task was successfully added."
          type="success"
          mode="alert"
          onCancel={() => { setSuccessDialogOpen(false); }}
        />
      </div>
    </div>
  );
}