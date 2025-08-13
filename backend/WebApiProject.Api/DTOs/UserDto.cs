/// <summary>
/// Contains Data Transfer Objects (DTOs) used for user authentication.
/// /// These DTOs include data annotations for server-side validation,
/// allowing better control over what data is received from the user and exposed to the client.
/// </summary>
using System.ComponentModel.DataAnnotations;

/// <summary>
/// The class represents the data required to register.
/// Sent by the client when submitting a registration request.
/// </summary>
public class UserRegisterDto
{
    [Required(ErrorMessage = "Username is required.")]
    [StringLength(20, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 20 characters.")]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [StringLength(30, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 30 characters.")]
    public string Password { get; set; } = string.Empty;

    [Compare("Password", ErrorMessage = "Passwords do not match.")]
    public string ConfirmPassword { get; set; } = string.Empty;
}

/// <summary>
/// The class represents the data required to log in.
/// Sent by the client when submitting a login request.
/// </summary>
public class UserLoginDto
{
    [Required(ErrorMessage = "Username is required.")]
    public string UserName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = string.Empty;
}