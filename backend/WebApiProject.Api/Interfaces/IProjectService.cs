/// <summary>
/// This interface handles project-related operations.
/// Supports:
/// - Creating a new project
/// - Retrieving all projects that belong to the current user
/// - Retrieving a specific project by its id
/// - Deleting a project by its id
/// </summary>
namespace WebApiProject.Api.Interfaces
{
    public interface IProjectService
    {
        /// <summary>
        /// The function creates a new project.
        /// </summary>
        /// <param name="dto">Object containing details for the new project.</param>
        /// <returns>The created project as a response DTO.</returns>
        Task<ProjectResponseDto> CreateProject(CreateProjectDto dto, int? userId);

        /// <summary>
        /// The function retrieves a specific project by its id.
        /// </summary>
        /// <param name="projectId">The id of the project to retrieve.</param>
        /// <returns>The project as a response DTO, or null if not found.</returns>
        Task<ProjectResponseDto?> GetProjectById(int projectId);

        /// <summary>
        /// The function retrieves all projects that belong to a given user.
        /// </summary>
        /// <param name="userId">The id of the user.</param>
        /// <returns>A list of project response DTOs belonging to the user.</returns>
        Task<IEnumerable<ProjectResponseDto>> GetProjectsByUserId(int? userId);

         /// <summary>
        /// The function deletes a project by its id.
        /// </summary>
        /// <param name="projectId">The id of the project to delete.</param>
        /// <returns>True if deletion was successful, false if the project was not found.</returns>
        Task<bool> DeleteProjectById(int projectId);
    }
}