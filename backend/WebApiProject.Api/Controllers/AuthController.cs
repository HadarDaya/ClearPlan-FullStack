/// <summary>
/// This controller provides endpoints for user authentication.
/// Supports:
/// - Registering new users
/// - Logging in existing users
/// </summary>
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        // Dependency Injection
        _authService = authService;
    }

    /// <summary>
    /// API endpoint for user registration.
    /// </summary>
    /// <param name="dto">User registration data.</param>
    /// <returns>HTTP response with JWT token or error message.</returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto dto)
    {
        var result = await _authService.Register(dto);

        if (!result.Success)
            return Conflict(new { message = result.ErrorMessage });

        return Ok(new { token = result.Token });
    }

    /// <summary>
    /// API endpoint for user login.
    /// </summary>
    /// <param name="dto">User login data.</param>
    /// <returns>HTTP response with JWT token or error message.</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        var result = await _authService.Login(dto);

        if (!result.Success)
            return Unauthorized(new { message = result.ErrorMessage });

        return Ok(new { token = result.Token });
    }
}