/// <summary>
/// This class represents Project entity in the Database.
/// </summary>
using System.ComponentModel.DataAnnotations;

namespace WebApiProject.Api.Models;

public class Project
{
    public int Id { get; set; } // Primary key (auto-increment)

    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    public DateTime CreationDate { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// One project can be managed by a single user.
    /// </summary>
    public int UserId { get; set; }
    public User? User { get; set; }

     /// <summary>
    /// One project can have multiple tasks.
    /// </summary>
    public List<TaskItem> Tasks { get; set; } = new();
}
