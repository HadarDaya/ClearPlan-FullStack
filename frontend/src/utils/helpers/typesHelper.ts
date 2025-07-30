/**
 * Represents a type of single project.
 *
 * @property id - Unique identifier for the project.
 * @property title - Title or name of the project.
 * @property description - (Optional) Short description of the project.
 */
export interface Project {
  id: number;
  title: string;
  description?: string;
  creationDate: Date;
}

/**
 * Represents a type of single task within a project.
 *
 * @property id - Unique identifier for the task.
 * @property title - Title or name of the task.
 * @property dueDate - (Optional) Due date for the task in ISO format (e.g., "2025-08-01").
 * @property isCompleted - (Optional) Indicates whether the task has been completed.
 */
export interface Task {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted?: boolean;
}