/// <summary>
/// This class represents TaskItem entity in the Database.
/// </summary>
using System.ComponentModel.DataAnnotations;

namespace WebApiProject.Api.Models;

public class TaskItem
{
    public int Id { get; set; } // Primary key (auto-increment)

    [Required]
    public string Title { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }

    public bool IsCompleted { get; set; } = false;

    /// <summary>
    /// One task can be associated with a single project.
    /// </summary>
    public int ProjectId { get; set; }
    public Project? Project { get; set; }
}