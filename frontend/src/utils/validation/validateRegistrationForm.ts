/**
 * Type representing possible validation errors regarding to fields in the registration form.
 */
export type FormErrors = {
  username?: string;
  password?: string;
  confirmPassword?: string;
};

/**
 *  Validates the registration form inputs. (client-side only).
 *
 * @param username - The username input value.
 * @param password - The password input value.
 * @param confirmPassword - The confirm password input value.
 * @returns An object containing error messages for each invalid field, if any.
 */
export function validateRegistrationForm(
  username: string,
  password: string,
  confirmPassword: string
): FormErrors {
  const errors: FormErrors = {};

  // Username validations
  if (!username.trim()) {
    errors.username = "Username is required.";
  } else if (username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters.";
  } else if (username.trim().length > 20) {
    errors.username = "Username cannot exceed 20 characters.";
  }

  // Password validations
  if (password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters.";
  } else if (password.trim().length > 30) {
    errors.password = "Password cannot exceed 30 characters.";
  }

  // Confirm password validation
  if (password.trim() !== confirmPassword.trim()) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}