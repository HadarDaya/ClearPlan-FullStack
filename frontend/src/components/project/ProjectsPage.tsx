/**
 * Displays the "My Projects" page for authenticated users.
 *
 * - Fetches the user's projects from the backend.
 * - Shows a loading spinner or error message if needed.
 * - Allows toggling a form to create a new project.
 * - Displays the list of projects in a table.
 *
 * Redirects to login if the user is not authenticated.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getUserIdFromToken } from "../../utils/helpers/authHelper";
import CreateProjectForm from "./CreateProjectForm";
import ProjectsTable from "./ProjectsTable";
import CustomDialog from "../layout/CustomDialog";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  // ============================
  // states
  // ============================
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false); // state of confirm dialog

  // Fetches the user's projects from the server whenever userId changes.
  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let errorMsg = "Failed to fetch projects";
        try {
          const errData = await res.json();
          if (errData.message) errorMsg = errData.message;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Called when a new project is successfully added.
   * Shows success dialog and fetches projects.
   */
  const onProjectAdded = () => {
    setShowAddForm(false);
    fetchProjects(); // load projects
    setSuccessDialogOpen(true); // show dialog
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8 rounded-2xl bg-white/90 border border-transparent">
      <h1 className="text-4xl font-montserrat-bold text-blue-500 mb-6 text-center">My Projects</h1>

      {/* Create New Project toggle button */}
      <div className="max-w-md mx-auto mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors font-montserrat-bold cursor-pointer"
          aria-expanded={showAddForm}
          aria-controls="add-project-form"
        >
          Create New Project
        </button>

        {showAddForm && (
          <div id="add-project-form" className="mt-6">
            {/* passes two callback props: 
                1. onAdded: triggered after a successful project creation.
                2. onCancel: triggered when the user cancels the form. */}
            <CreateProjectForm onAdded={onProjectAdded} onCancel={() => setShowAddForm(false)} />
          </div>
        )}
      </div>

      {/* Projects table */}
      {loading ? (
        <div className="flex justify-center items-center gap-2 text-blue-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading projects...
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-600 text-center">You don't have any projects yet.</p>
      ) : (
        // passes the current list of projects to display and a setter function to update the list.
        <ProjectsTable projects={projects} setProjects={setProjects} />
      )}

      {/* Success dialog */}
      <CustomDialog
        isOpen={successDialogOpen}
        title="Project Created"
        message="Project was successfully created."
        type="success"
        mode="alert"
        onCancel={() => { setSuccessDialogOpen(false); }}
      />
    </div>
  );
}
