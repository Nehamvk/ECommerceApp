# ECommerceApi (ASP.NET Core backend)

## Stack
- ASP.NET Core 8 Web API
- EF Core 8 + SQL Server
- ASP.NET Identity for users/roles
- JWT bearer authentication
- FluentValidation for request validation
- Swagger for API docs/testing

## Setup

1. Update the connection string in `appsettings.json` if you're not using LocalDB.
2. Update `Jwt:Key` to a real secret (32+ random characters) before any real deployment.
3. Install the EF Core CLI tool if you don't have it:
   ```
   dotnet tool install --global dotnet-ef
   ```
4. Create the initial migration:
   ```
   cd ECommerceApi
   dotnet ef migrations add InitialCreate
   ```
5. Run the API (migrations apply automatically on startup):
   ```
   dotnet run
   ```
   Swagger UI will be available at `https://localhost:<port>/swagger`.

## Auth model
- `POST /api/auth/register` — creates an account. The **first user ever registered becomes Admin**; everyone after that is a Customer. (For a real app, replace this with an explicit admin-seeding step.)
- `POST /api/auth/login` — returns a JWT plus the user's roles.
- The frontend sends the JWT as `Authorization: Bearer <token>`.

## Authorization model
- Anyone (including anonymous visitors) can browse products and categories (`GET` endpoints).
- Only users with the `Admin` role can create, update, or delete products/categories.
- Authorization is enforced server-side via `[Authorize(Roles = "Admin")]` — the frontend only hides UI, it never relies on the UI alone for security.

## Validation
- All write DTOs (`RegisterDto`, `LoginDto`, `CreateProductDto`, `UpdateProductDto`) are validated server-side with FluentValidation before touching the database, in addition to client-side Zod validation in the React app.
