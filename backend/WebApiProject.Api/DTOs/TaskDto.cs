/// <summary>
/// Contains Data Transfer Objects (DTOs) used for task operations.
/// These DTOs include data annotations for server-side validation,
/// allowing better control over what data is received from the user and exposed to the client.
/// </summary>
using System.ComponentModel.DataAnnotations; 
namespace WebApiProject.Api
{
    /// <summary>
    /// The class represents the data required to create a new task.
    /// Sent by the client when submitting a task creation request.
    /// </summary>
    public class AddTaskDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters")]
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
    }

    /// <summary>
    /// The class represents the data required to update a task.
    /// Sent by the client when submitting a task modification request.
    /// </summary>
    public class UpdateTaskDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters")]
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
    }

    /// <summary>
    /// The class represents DTO used for returning task data in API responses.
    /// </summary>
    public class TaskResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public int ProjectId { get; set; }
    }
}