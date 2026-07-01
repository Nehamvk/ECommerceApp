using Microsoft.AspNetCore.Identity;

namespace ECommerceApi.Models;

// Extends IdentityUser to add app-specific profile fields.
public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
}

public static class Roles
{
    public const string Admin = "Admin";
    public const string Customer = "Customer";
}
