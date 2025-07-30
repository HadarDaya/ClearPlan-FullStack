/**
 * Type representing possible validation errors regarding to fields in the login form.
 */
export type LoginFormErrors = {
  username?: string;
  password?: string;
};

/**
 * Validates the login form fields (client-side).
 * @param username - The username input value.
 * @param password - The password input value.
 * @returns An object with possible validation errors for each invalid field, if any.
 */
export function validateLoginForm(username: string, password: string): LoginFormErrors {
  const errors: LoginFormErrors = {};

  // Username validations
  if (!username.trim()) {
    errors.username = "Username is required.";
  }

  // Password validations
  if (!password.trim()) {
    errors.password = "Password is required.";
  }

  return errors;
}