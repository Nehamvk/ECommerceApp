namespace ECommerceApi.DTOs;

public record RegisterDto(string FullName, string Email, string Password);

public record LoginDto(string Email, string Password);

public record AuthResponseDto(string Token, DateTime ExpiresAt, string Email, string FullName, IList<string> Roles);
