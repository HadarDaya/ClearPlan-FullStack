/// <summary>
/// This interface handles user authentication operations.
/// Supports:
/// - Registering new users
/// - Logging in existing users
/// </summary>
namespace WebApiProject.Api.Interfaces
{
    public interface IAuthService
    {
        /// <summary>
        /// The function registers a new user and returns a JWT token if successful.
        /// </summary>
        /// <param name="dto">The user registration details.</param>
        /// <returns>
        /// RegisterResult containing either the generated token or an error message.
        /// </returns>
        Task<RegisterResult> Register(UserRegisterDto dto);

        /// <summary>
        /// The function logs in a user by validating their credentials and returns a JWT token if successful.
        /// </summary>
        /// <param name="dto">The user login details.</param>
        /// <returns>
        /// LoginResult containing either the generated token or an error message.
        /// </returns>
        Task<LoginResult> Login(UserLoginDto dto);
    }
}