namespace ECommerceApi.DTOs;

public record ProductDto(
    int Id,
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    string? ImageUrl,
    int CategoryId,
    string? CategoryName
);

public record CreateProductDto(
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    string? ImageUrl,
    int CategoryId
);

public record UpdateProductDto(
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    string? ImageUrl,
    int CategoryId
);

public record CategoryDto(int Id, string Name);
