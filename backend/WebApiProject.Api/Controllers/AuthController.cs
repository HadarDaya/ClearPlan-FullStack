/// <summary>
/// This controller provides endpoints for user authentication.
/// Supports:
/// - Registering new users
/// - Logging in existing users
/// Note: All input models are validated on the server, and invalid requests return 
/// 400 Bad Request with validation error details.
/// </summary>
using Microsoft.AspNetCore.Mvc;
using WebApiProject.Api.Interfaces;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        // Dependency Injection using interface for loose coupling
        _authService = authService;
    }

    /// <summary>
    /// API endpoint for user registration.
    /// Performs model validation on the provided <paramref name="dto"/> before processing.
    /// </summary>
    /// <param name="dto">User registration data.
    /// This input is validated according to data annotations.</param>
    /// <returns>
    /// HTTP response with JWT token, or
    /// 400 Bad Request with validation errors if the input model is invalid, or
    /// HTTP 409 Conflict if username taken.
    /// </returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto dto)
    {
        if (!ModelState.IsValid)
                return BadRequest(ModelState);

        var result = await _authService.Register(dto);

        if (!result.Success)
            return Conflict(new { message = result.ErrorMessage });

        return Ok(new { token = result.Token });
    }

    /// <summary>
    /// API endpoint for user login.
    /// Performs model validation on the provided <paramref name="dto"/> before processing.
    /// </summary>
    /// <param name="dto">User login data.
    /// This input is validated according to data annotations.</param>
    /// <returns>
    /// HTTP response with JWT token, or
    /// 400 Bad Request with validation errors if the input model is invalid, or
    /// HTTP 401 Unauthorized if credentials invalid.
    /// </returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        if (!ModelState.IsValid)
                return BadRequest(ModelState);

        var result = await _authService.Login(dto);

        if (!result.Success)
            return Unauthorized(new { message = result.ErrorMessage });

        return Ok(new { token = result.Token });
    }
}