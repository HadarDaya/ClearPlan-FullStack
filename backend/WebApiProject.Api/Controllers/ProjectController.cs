/// <summary>
/// This controller provides endpoints for project operations.
/// Supports:
/// - Creating a new project
/// - Retrieving all projects that belong to the current user.
/// - Retrieving a specific project by its id
/// - Deleting a project by its id
/// Note: All input models are validated on the server, and invalid requests return 
/// 400 Bad Request with validation error details.
/// </summary>
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WebApiProject.Api.Interfaces;

namespace WebApiProject.Api.Controllers
{
    [ApiController]
    [Route("api/projects")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly ITaskService _taskService;

        public ProjectController(IProjectService projectService, ITaskService taskService)
        {
            // Dependency injection using interface for loose coupling
            _projectService = projectService;
            _taskService = taskService;
        }

        /// <summary>
        /// The function creates a new project.
        /// Performs model validation on the provided <paramref name="dto"/> before processing.
        /// </summary>
        /// <param name="dto">Object containing details of the new project.
        /// This input is validated according to data annotations.</param>
        /// <returns>
        /// 201 Created with the created project DTO if the input is valid and the user is authorized.
        /// 400 Bad Request with validation errors if the input model is invalid.
        /// 401 Unauthorized if the user is not authenticated.
        /// </returns>
        [HttpPost]
        [Authorize] // ensure only authorized user can access this method 
        public async Task<IActionResult> CreateProject(CreateProjectDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int? userId = GetUserIdFromClaims();
            if (userId == null) return Unauthorized();

            var project = await _projectService.CreateProject(dto, userId);

            return Created("", project);
        }

        /// <summary>
        /// The function retrieves all tasks related to the given project id.
        /// </summary>
        /// <param name="id">The id of the project.</param>
        /// <returns>200 OK with the project DTO, or 404 if not found.</returns>
        [HttpGet("{id}")]
        [Authorize] // ensure only authorized user can access this method 
        public async Task<IActionResult> GetProjectTasks(int id)
        {
            int? userId = GetUserIdFromClaims();
            if (userId == null) return Unauthorized();

            var project = await _taskService.GetTasksByProjectId(id);
            if (project == null) return NotFound();

            return Ok(project);
        }

        /// <summary>
        /// The function retrieves all projects that belong to the current user.
        /// </summary>
        /// <returns>200 OK with a list of project DTOs.</returns>
        [HttpGet]
        [Authorize] // ensure only authorized user can access this method 
        public async Task<IActionResult> GetCurrentUserProjects()
        {
            int? userId = GetUserIdFromClaims();
            if (userId == null) return Unauthorized();

            var projects = await _projectService.GetProjectsByUserId(userId);

            return Ok(projects);
        }

        /// <summary>
        /// The function deletes a project by its id.
        /// </summary>
        /// <param name="id">The id of the project to delete.</param>
        /// <returns>204 No Content if deletion succeeded, or 404 if the project was not found.</returns>
        [HttpDelete("{id}")]
        [Authorize] // ensure only authorized user can access this method 
        public async Task<IActionResult> DeleteProjectById(int id)
        {
            int? userId = GetUserIdFromClaims();
            if (userId == null) return Unauthorized();

            var deleted = await _projectService.DeleteProjectById(id);
            return deleted ? NoContent() : NotFound();
        }

        /// <summary>
        /// Retrieves the current user's ID from the JWT claims.
        /// </summary>
        /// <returns>
        /// The user ID if found and valid; otherwise, null.
        /// </returns>
        private int? GetUserIdFromClaims()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == Constants.ClaimTypes.ClaimUserId);
            if (userIdClaim == null)
                return null;

            if (int.TryParse(userIdClaim.Value, out int userId))
                return userId;

            return null;
        }

    }
}
