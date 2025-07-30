/// <summary>
/// This controller provides endpoints for tasks operations.
/// Supports:
/// - Adding a task to project
/// - Updating a task by its id
/// - Deleting a task by its id
/// </summary>
using Microsoft.AspNetCore.Mvc;
using WebApiProject.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace WebApiProject.Api.Controllers
{
    [ApiController]
    [Route("api")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            // Dependency injection
            _taskService = taskService;
        }

        /// <summary>
        /// The function adds a new task to the given project.
        /// </summary>
        /// <param name="projectId">The id of the project.</param>
        /// <param name="dto">Object containing details of a new task.</param>
        /// <returns>200 OK with the created task, or 404 if the project was not found.</returns>
        [HttpPost("projects/{projectId}/tasks")]
        [Authorize] // ensure only authorized user can access this method 
        public async Task<IActionResult> AddTaskToProject(int projectId, AddTaskDto dto)
        {
            int? userId = GetUserIdFromClaims();
            if (userId == null) return Unauthorized();

            var result = await _taskService.AddTaskToProject(projectId, dto);
            return result == null ? NotFound() : Ok(result);
        }

        /// <summary>
        /// The function updates an existing task identified by a given id.
        /// </summary>
        /// <param name="taskId">The id of the task to update.</param>
        /// <param name="dto">Object containing updated task details.</param>
        /// <returns>200 OK with the updated task, or 404 if the task was not found.</returns>
        [HttpPut("tasks/{taskId}")]
        [Authorize] // ensure only authorized user can access this method 
        public async Task<IActionResult> UpdateTaskById(int taskId, UpdateTaskDto dto)
        {
            int? userId = GetUserIdFromClaims();
            if (userId == null) return Unauthorized();

            var result = await _taskService.UpdateTaskById(taskId, dto);
            return result == null ? NotFound() : Ok(result);
        }

        /// <summary>
        /// The function deletes a task by its id.
        /// </summary>
        /// <param name="taskId">The id of the task to delete.</param>
        /// <returns>204 No Content if deletion succeeded, or 404 if the task was not found.</returns>
        [HttpDelete("tasks/{taskId}")]
        [Authorize] // ensure only authorized user can access this method 
        public async Task<IActionResult> DeleteTaskById(int taskId)
        {
            int? userId = GetUserIdFromClaims();
            if (userId == null) return Unauthorized();

            var deleted = await _taskService.DeleteTaskById(taskId);
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
