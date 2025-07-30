/**
 * Type representing possible validation errors in the task creation/updating form.
 */
export type FormErrors = {
  title?: string;
};

/**
 * Validates the tasks form inputs- Add task, modify Task. (client-side only).
 *
 * @param title - The title of the task.
 * @returns An object containing error messages for each invalid field, if any.
 */
export function validateAddTaskForms(title: string): FormErrors {
  const errors: FormErrors = {};

  // Title validations
  if (!title.trim()) {
    errors.title = "Title is required";
  } else if (title.trim().length > 100) {
    errors.title = "Title cannot exceed 100 characters";
  } else if (title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }

  return errors;
}
