/**
 * Displays a table of projects.
 * Each row includes project details and a button to view tasks.
 * Supports project deletion and opens a modal for viewing/managing tasks.
 */
import ProjectRow from "./ProjectRow";
import { useState } from "react";
import TaskModal from "../task/TasksModal";
import CustomDialog from "../layout/CustomDialog";
import type { Project } from "../../utils/helpers/typesHelper"

interface ProjectsTableProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

/**
 * Component for displaying a table of projects.
 *
 * @param {any[]} props.projects - Array of projects to display.
 * @param {Function} props.setProjects - Function to update the projects state.
 */
export default function ProjectsTable(props: ProjectsTableProps) {

  const { projects, setProjects } = props;

  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // for TaskModal
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null); // for CustomDialog

  /**
   * Removes a project from the list after successful deletion.
   * @param id Project ID to remove
   */
  const handleDelete = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  /**
   * Sends DELETE request to backend to delete project by id.
   */
  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete project");
      handleDelete(projectToDelete.id);
    } catch (err) {
      alert("Error deleting project: " + (err as Error).message);
    } finally {
      setProjectToDelete(null);
    }
  };

  // ============================
  // render
  // ============================

  return (
    <>
      {/* Scrollable project table */}
      <div className="max-h-[50vh] sm:max-h-[400px] overflow-auto mt-6 border border-transparent">
        <table className="min-w-full text-sm sm:text-base border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800/50 ">
              <th className="w-4 p-3 text-center"></th>
              <th className="p-3  text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-center">Created</th>
              <th className="p-3 text-center">Tasks</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onRequestDelete={() => setProjectToDelete(project)}
                onViewTasks={() => setSelectedProject(project)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Task modal for the selected project */}
      {selectedProject && (
        <TaskModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Confirm deletion dialog */}
      <CustomDialog
        isOpen={!!projectToDelete}
        title="Delete Project"
        message={`Are you sure you want to delete project "${projectToDelete?.title}"?`}
        type="warning"
        mode="confirm"
        onConfirm={confirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />
    </>
  );
}
