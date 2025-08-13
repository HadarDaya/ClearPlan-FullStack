/*
 * This file configures and starts the ASP.NET Core Web API application.
 * 
 * Key configurations:
 * - Entity Framework Core with SQLite database
 * - Dependency injection for services  by their interfaces (IAuthService, IProjectService, ITaskService)
 * - JWT Bearer Authentication using a secret key from appsettings.json
 * - CORS policy to allow requests from the frontend (configured in appsettings.json under "FrontendUrl")
 * - Swagger/OpenAPI documentation for development
 * - Middleware pipeline for:
 *     - HTTPS redirection
 *     - CORS
 *     - Logging each incoming request to the console
 *     - Authentication and Authorization
 * - Maps controller endpoints and starts the server
 */
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebApiProject.Api.Data;
using WebApiProject.Api.Services;
using WebApiProject.Api.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// EF Core + SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));

// Add Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITaskService, TaskService>();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            ),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// CORS
var frontendUrl = builder.Configuration["FrontendUrl"];
builder.Services.AddCors(options =>
{
    if (frontendUrl != null)
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins(frontendUrl) // Frontend address
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    }
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Controllers
builder.Services.AddControllers();

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// inform about each incoming request
app.Use(async (context, next) =>
{
    Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] Received request: {context.Request.Method} {context.Request.Path}");
    await next.Invoke();
});

// Auth middlewares
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
