/// <summary>
/// This class represents User entity in the Database.
/// </summary>
namespace WebApiProject.Api.Models;

public class User
{
    public int Id { get; set; } // Primary key (auto-increment)
    public string UserName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty; // After encryption

    /// <summary>
    /// One user can manage multiple projects.
    /// </summary>
    public List<Project> Projects { get; set; } = new();
}