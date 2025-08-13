/// <summary>
/// This class represents access to the database.
/// </summary>
using Microsoft.EntityFrameworkCore;
using WebApiProject.Api.Models;

namespace WebApiProject.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<User> Users => Set<User>(); // Represents the 'Users' table in the database
    public DbSet<Project> Projects => Set<Project>(); // Represents the 'Projects' table in the database
    public DbSet<TaskItem> Tasks => Set<TaskItem>(); // Represents the 'Tasks' table in the database
}