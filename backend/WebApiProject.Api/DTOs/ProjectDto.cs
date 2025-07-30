/// <summary>
/// Contains Data Transfer Objects (DTOs) used for project operations.
/// (Allowing better control over what data is received from user, and is exposed to user).
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
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
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