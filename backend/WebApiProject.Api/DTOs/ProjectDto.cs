/// <summary>
/// Contains Data Transfer Objects (DTOs) used for project operations.
/// These DTOs include data annotations for server-side validation,
/// allowing better control over what data is received from the user and exposed to the client.
/// </summary>
using System.ComponentModel.DataAnnotations;

namespace WebApiProject.Api
{
    /// <summary>
    /// The class represents the data required to create a new project.
    /// Sent by the client when submitting a project creation request.
    /// </summary>
    public class CreateProjectDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters")]
        public string Title { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }
    }

    /// <summary>
    /// The class represents DTO used for returning project data in API responses.
    /// </summary>
    public class ProjectResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreationDate { get; set; }
    }
}