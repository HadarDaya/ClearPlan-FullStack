/// <summary>
/// Implementation of the interface: <see cref="IAuthService"/>.
/// This service handles user authentication operations.
/// Supports:
/// - Registering new users
/// - Logging in existing users
/// - Generating JWT tokens for authenticated users
/// </summary>
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using WebApiProject.Api.Models;
using WebApiProject.Api.Data;
using Microsoft.EntityFrameworkCore;
using WebApiProject.Api.Interfaces;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    /// <summary>
    /// The function registers a new user and returns a JWT token if successful.
    /// </summary>
    /// <param name="dto">The user registration details.</param>
    /// <returns>
    /// RegisterResult containing either the generated token or an error message.
    /// </returns>
    public async Task<RegisterResult> Register(UserRegisterDto dto)
    {
        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.UserName.ToLower() == dto.UserName.ToLower()))
            return new RegisterResult { Success = false, ErrorMessage = "Username is already taken." };

        // Hash the user's password using BCrypt
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            UserName = dto.UserName,
            PasswordHash = passwordHash
        };

        // Add a new user to db
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Create JWT token for the current user login
        var token = CreateToken(user);

        return new RegisterResult { Success = true, Token = token };
    }

    /// <summary>
    /// The function logs in a user by validating their credentials and returns a JWT token if successful.
    /// </summary>
    /// <param name="dto">The user login details.</param>
    /// <returns>
    /// LoginResult containing either the generated token or an error message.
    /// </returns>
    public async Task<LoginResult> Login(UserLoginDto dto)
    {
        // check username
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName.ToLower() == dto.UserName.ToLower());

        // Verify the provided password by hashing and comparing it to the stored hash
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return new LoginResult { Success = false, ErrorMessage = "Invalid username or password." };

        // Create JWT token for the current user login
        var token = CreateToken(user);

        return new LoginResult { Success = true, Token = token };
    }

    /// <summary>
    /// The function creates a JWT token containing the user's ID and username.
    /// </summary>
    /// <param name="user">The user for whom the token is created.</param>
    /// <returns>A signed JWT token string.</returns>
    private string CreateToken(User user)
    {
        // Attach user details to the token
        // we will decode these details on client-side (authHelper.ts)
        var claims = new List<Claim>
        {
            new Claim(Constants.ClaimTypes.ClaimUserName, user.UserName),    // Atttach current username (for 'hello' message)
            new Claim(Constants.ClaimTypes.ClaimUserId, user.Id.ToString())  // Atttach current user id (to fetch relavant data)
        };

        // Read the secret key from appsettings.json
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

        // Sign on the token
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        // Create the JWT token 
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}

/// <summary>
/// The class represents the result of a registration attempt.
/// </summary>
public class RegisterResult
{
    public bool Success { get; set; }
    public string? Token { get; set; }
    public string? ErrorMessage { get; set; }
}

/// <summary>
/// Represents the result of a login attempt.
/// </summary>
public class LoginResult
{
    public bool Success { get; set; }
    public string? Token { get; set; }
    public string? ErrorMessage { get; set; }
}