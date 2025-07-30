/**
 * Type representing possible validation errors regarding to fields in the project creation form.
 */
export type FormErrors = {
    title?: string;
    description?: string;
};

/**
 * Validates the create project form inputs. (client-side only).
 *
 * @param title - The title input value.
 * @param description - The description input value.
 * @returns An object containing error messages for each invalid field, if any.
 */
export function validateCreateProjectForm(
    title: string,
    description: string
): FormErrors {
    const errors: FormErrors = {};

    // Title validations
    if (!title.trim()) {
        errors.title = "Title is required";
    } else if (title.trim().length > 100) {
        errors.title = "Title cannot exceed 100 characters";
    } else if (title.trim().length < 3) {
        errors.title = "Title must be at least 3 characters.";
    }

    // Description validations
    if (description.trim().length > 500) {
        errors.description = "Description cannot exceed 500 characters";
    }
    return errors;
}