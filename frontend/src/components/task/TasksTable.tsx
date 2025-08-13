import { useState } from "react";
import TaskRow from "./TaskRow";
import CustomDialog from "../layout/CustomDialog";
import type { Project, Task } from "../../utils/helpers/typesHelper";

// Defines the props for the TasksTable component
interface TasksTableProps {
  project: Project;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

/**
 * Component for displaying a table of tasks for a given project.
 *
 * @param {any} props.project - The current project object.
 * @param {any[]} props.tasks - Array of tasks to display.
 * @param {Function} props.setTasks - Function to update the tasks state.
 */
export default function TasksTable(props: TasksTableProps) {

  const { project, tasks, setTasks } = props;
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  /**
 * Removes a task from the list after successful deletion on the server.
 * Updates the local UI by filtering out the deleted project by ID.
 * @param id Task ID to remove
*/
  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  /**
 * Updates a task after successful modification.
 * @param id Task ID to modify
*/
  const handleUpdate = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  /**
   * Sends DELETE request to backend to delete task by id.
   */
  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/tasks/${taskToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete task");
      handleDelete(taskToDelete);
    } catch (err) {
      alert("Error deleting task: " + (err as Error).message);
    } finally {
      setTaskToDelete(null);
    }
  };

  // ============================
  // render
  // ============================
  return (
    <>
      {/* tasks table */}
      <div className="max-h-[50vh] sm:max-h-[400px] overflow-auto mt-6 border border-transparent">
        <table className="min-w-full text-sm sm:text-base border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800/50 ">
              <th className="w-4 p-3"></th>
              <th className="p-3 whitespace-nowrap">Title</th>
              <th className="p-3 text-center whitespace-nowrap">Due Date</th>
              <th className="p-3 text-center whitespace-nowrap">Status</th>
              <th className="p-3 text-center whitespace-nowrap">Modify</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                project={project}
                task={task}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onRequestDelete={setTaskToDelete}
                onRequestAlert={() => setShowSuccessDialog(true)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm deletion dialog */}
      <CustomDialog
        isOpen={taskToDelete !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        type="warning"
        mode="confirm"
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />

      {/* Success alert dialog */}
      <CustomDialog
        isOpen={showSuccessDialog}
        title="Task Updated"
        message="Task updated successfully!"
        type="success"
        mode="alert"
        onCancel={() => setShowSuccessDialog(false)}
      />
    </>
  );
}
