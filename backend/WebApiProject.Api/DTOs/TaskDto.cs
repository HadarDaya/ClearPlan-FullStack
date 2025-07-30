/// <summary>
/// Contains Data Transfer Objects (DTOs) used for task operations.
/// (Allowing better control over what data is received from user, and is exposed to user).
/// </summary>
namespace WebApiProject.Api
{
    /// <summary>
    /// The class represents the data required to create a new task.
    /// Sent by the client when submitting a task creation request.
    /// </summary>
    public class AddTaskDto
    {
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