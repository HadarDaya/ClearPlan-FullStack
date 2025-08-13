/// <summary>
/// Implementation of the interface: <see cref="IProjectService"/>.
/// This service handles project-related operations.
/// Supports:
/// - Creating a new project
/// - Retrieving all projects that belong to the current user.
/// - Retrieving a specific project by its id
/// - Deleting a project by its id
/// </summary>
using Microsoft.EntityFrameworkCore;
using WebApiProject.Api.Data;
using WebApiProject.Api.Models;
using WebApiProject.Api.Interfaces;

namespace WebApiProject.Api.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;

        public ProjectService(AppDbContext context)
        {
            // Dependency injection
            _context = context;
        }

        /// <summary>
        /// The function creates a new project.
        /// Assumes that model validation was done prior to the call.
        /// </summary>
        /// <param name="dto">Object containing details for the new project.</param>
        /// <returns>The created project as a response DTO.</returns>
        public async Task<ProjectResponseDto> CreateProject(CreateProjectDto dto, int? userId)
        {
            if (userId == null)
                throw new ArgumentException("UserId must be provided.");

            var project = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                CreationDate = DateTime.UtcNow,
                UserId = userId.Value
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return MapToDto(project);
        }

        /// <summary>
        /// The function retrieves a specific project by its id.
        /// </summary>
        /// <param name="projectId">The id of the project to retrieve.</param>
        /// <returns>The project as a response DTO, or null if not found.</returns>
        public async Task<ProjectResponseDto?> GetProjectById(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) return null;

            return MapToDto(project);
        }

        /// <summary>
        /// The function retrieves all projects that belong to a given user.
        /// </summary>
        /// <param name="userId">The id of the user.</param>
        /// <returns>A list of project response DTOs belonging to the user.</returns>
        public async Task<IEnumerable<ProjectResponseDto>> GetProjectsByUserId(int? userId)
        {
            var projects = await _context.Projects
                .Where(p => p.UserId == userId)
                .ToListAsync();

            var result = new List<ProjectResponseDto>();
            foreach (var project in projects)
            {
                result.Add(MapToDto(project));
            }

            return result;
        }

        /// <summary>
        /// The function deletes a project by its id.
        /// </summary>
        /// <param name="projectId">The id of the project to delete.</param>
        /// <returns>True if deletion was successful, false if the project was not found.</returns>
        public async Task<bool> DeleteProjectById(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) return false;

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// The function maps a Project model (which includes all database fields)
        /// to a ProjectResponseDto (used in API responses).
        /// </summary>
        /// <param name="project">The project entity to map (containing all fields in db)</param>
        /// <returns>A ProjectResponseDto containing only selected project details.</returns>
        private ProjectResponseDto MapToDto(Project project)
        {
            return new ProjectResponseDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreationDate = project.CreationDate
            };
        }
    }
}