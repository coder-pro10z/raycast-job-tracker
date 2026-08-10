# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["NextApply.Api.csproj", "./"]
RUN dotnet restore "NextApply.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/"
RUN dotnet publish "NextApply.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Serve Stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port 8080 (Render's default port for web services)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "NextApply.Api.dll"]
