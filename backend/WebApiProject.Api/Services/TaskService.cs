/// <summary>
/// This service handles task-related operations.
/// Supports:
/// - Adding a task to project
/// - Updating a task by its id
/// - Deleting a task by its id
/// </summary>
using Microsoft.EntityFrameworkCore;
using WebApiProject.Api.Data;
using WebApiProject.Api.Models;

namespace WebApiProject.Api.Services
{
    public class TaskService 
    {
        private readonly AppDbContext _context;

        public TaskService(AppDbContext context)
        {
            // Dependency injection
            _context = context;
        }

        /// <summary>
        /// The function adds a new task to the given project.
        /// </summary>
        /// <param name="projectId">The id of the project.</param>
        /// <param name="dto">Object containing details of a new task.</param>
        /// <returns>The task as a response DTO, or null if the project doesn't exist.</returns>
        public async Task<TaskResponseDto?> AddTaskToProject(int projectId, AddTaskDto dto)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) return null;

            var task = new TaskItem
            {
                Title = dto.Title,
                DueDate = dto.DueDate,
                ProjectId = projectId,
                IsCompleted = dto.IsCompleted
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return MapToDto(task);
        }

        /// <summary>
        /// The function retrieves all tasks related to the given project id.
        /// </summary>
        /// <param name="projectId">The id of the project.</param>
        /// <returns>A list of tasks as response DTOs.</returns>
        public async Task<IEnumerable<TaskResponseDto>> GetTasksByProjectId(int projectId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .ToListAsync();

            var result = new List<TaskResponseDto>();

            foreach (var task in tasks)
            {
                var dto = MapToDto(task);
                result.Add(dto);
            }

            return result;
        }

        /// <summary>
        /// The function updates an existing task identified by a given id.
        /// </summary>
        /// <param name="taskId">The id of the task to update.</param>
        /// <param name="dto">Object containing updated task details.</param>
        /// <returns>The task as a response DTO, or null if task doesn't exist.</returns>
        public async Task<TaskResponseDto?> UpdateTaskById(int taskId, UpdateTaskDto dto)
        {
            var task = await _context.Tasks.FindAsync(taskId);
            if (task == null) return null;

            task.Title = dto.Title;
            task.DueDate = dto.DueDate;
            task.IsCompleted = dto.IsCompleted;

            await _context.SaveChangesAsync();
            return MapToDto(task);
        }

        /// <summary>
        /// The function deletes a task by its id.
        /// </summary>
        /// <param name="taskId">The id of the task to delete.</param>
        /// <returns>True if deletion was successful, false if the task was not found.</returns>
        public async Task<bool> DeleteTaskById(int taskId)
        {
            var task = await _context.Tasks.FindAsync(taskId);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// The function maps a TaskItem model (which includes all database fields)
        /// to a TaskResponseDto (used in API responses).
        /// </summary>
        /// <param name="task">The task model to map (containing all fields in db) </param>
        /// <returns>A TaskResponseDto containing only selected task details.</returns>
        private TaskResponseDto MapToDto(TaskItem task)
        {
            return new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId
            };
        }
    }
}