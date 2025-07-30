/// <summary>
/// This class represents access to the database.
/// </summary>
using Microsoft.EntityFrameworkCore;
using WebApiProject.Api.Models;

namespace WebApiProject.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<User> Users => Set<User>(); // Create 'Users' table in db
    public DbSet<Project> Projects => Set<Project>(); // Create 'Projects' table in db
    public DbSet<TaskItem> Tasks => Set<TaskItem>(); // Create 'Tasks' table in db
}