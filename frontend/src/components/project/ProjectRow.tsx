/**
 * Renders a single project row within a projects table.
 * 
 * - Allows deleting the project.
 * - Allows viewing tasks for the project.
 */
import { useState } from "react";
import { ListChecks, X } from "lucide-react";
import type { Project } from "../../utils/helpers/typesHelper";

interface ProjectRowProps {
  project: Project;
  onRequestDelete: () => void;
  onViewTasks: () => void;
}

/**
 * Renders a single project row within a projects table.
 * 
 * @param {Object} props - Component props
 * @param {Project} props.project - The project data to display.
 * @param {() => void} props.onRequestDelete - Callback to request delete confirmation.
 * @param {() => void} props.onViewTasks - Callback to view the tasks related to the project.
 */
export default function ProjectRow(props: ProjectRowProps) {
  const { project, onRequestDelete, onViewTasks } = props;

  const [expanded, setExpanded] = useState(false);

  // description content: display limited amount of characters
  const maxPreviewChars = 150;
  const description = project.description || "";
  const isLong = description.length > maxPreviewChars;
  const displayedText = !expanded && isLong
    ? description.slice(0, maxPreviewChars) + "..."
    : description;

  // ============================
  // render
  // ============================
  return (
    <tr className="even:bg-white odd:bg-gray-50 hover:bg-blue-50">
      <td className="text-center">
        <button
          onClick={onRequestDelete}
          className="text-blue-800/50 cursor-pointer"
          aria-label={`Delete project ${project.title}`}
        >
          <X className="w-5 h-5" />
        </button>
      </td>
      <td className="p-3">{project.title}</td>
      {/* description (display limited amount of characters) */}
      <td className="p-3 ">
        <p
          className={`whitespace-pre-wrap ${!expanded ? "line-clamp-2 overflow-hidden" : ""
            }`}
        >
          {displayedText}
          {isLong && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="text-blue-600 underline ml-1 cursor-pointer"
            >
              more
            </button>
          )}
          {isLong && expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="text-blue-600 underline ml-1 cursor-pointer"
            >
              less
            </button>
          )}
        </p>
      </td>
      <td className="p-3 text-center">
        {new Date(project.creationDate).toLocaleDateString("en-GB")}
      </td>
      <td className="p-3 text-center whitespace-nowrap space-x-6">
        <button
          onClick={onViewTasks}
          className="text-blue-800/50 cursor-pointer"
          aria-label={`View tasks for project ${project.title}`}
        >
          <ListChecks className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}
