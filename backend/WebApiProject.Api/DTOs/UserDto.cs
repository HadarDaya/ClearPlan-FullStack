/// <summary>
/// Contains Data Transfer Objects (DTOs) used for user authentication.
/// (Allowing better control over what data is received from user, and is exposed to user).
/// </summary>

/// <summary>
/// The class represents the data required to register.
/// Sent by the client when submitting a registration request.
/// </summary>
public class UserRegisterDto
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// The class represents the data required to log in.
/// Sent by the client when submitting a login request.
/// </summary>
public class UserLoginDto
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}