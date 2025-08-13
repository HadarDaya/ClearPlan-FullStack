/// <summary>
/// This interface handles task-related operations.
/// Supports:
/// - Adding a task to project
/// - Updating a task by its id
/// - Deleting a task by its id
/// </summary>
namespace WebApiProject.Api.Interfaces
{
    public interface ITaskService
    {
        /// <summary>
        /// The function adds a new task to the given project.
        /// </summary>
        /// <param name="projectId">The id of the project.</param>
        /// <param name="dto">Object containing details of a new task.</param>
        /// <returns>The task as a response DTO, or null if the project doesn't exist.</returns>
        Task<TaskResponseDto?> AddTaskToProject(int projectId, AddTaskDto dto);

        /// <summary>
        /// The function retrieves all tasks related to the given project id.
        /// </summary>
        /// <param name="projectId">The id of the project.</param>
        /// <returns>A list of tasks as response DTOs.</returns>
        Task<IEnumerable<TaskResponseDto>> GetTasksByProjectId(int projectId);

        /// <summary>
        /// The function updates an existing task identified by a given id.
        /// </summary>
        /// <param name="taskId">The id of the task to update.</param>
        /// <param name="dto">Object containing updated task details.</param>
        /// <returns>The task as a response DTO, or null if task doesn't exist.</returns>
        Task<TaskResponseDto?> UpdateTaskById(int taskId, UpdateTaskDto dto);

        /// <summary>
        /// The function deletes a task by its id.
        /// </summary>
        /// <param name="taskId">The id of the task to delete.</param>
        /// <returns>True if deletion was successful, false if the task was not found.</returns>
        Task<bool> DeleteTaskById(int taskId);
    }
}