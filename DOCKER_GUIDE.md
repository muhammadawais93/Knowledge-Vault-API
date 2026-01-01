# Docker & CI/CD Testing Guide

## Local Testing Commands

### 1. Test Docker Build (Basic)
```bash
# Build the image
docker build -t knowledge-vault-api:test .

# Check if image was created
docker images | grep knowledge-vault-api
```

### 2. Test Docker Run (With Environment Variables)
```bash
# Run the container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGO_URI="your-mongodb-connection-string" \
  -e JWT_SECRET="your-secret-key" \
  -e SALT_ROUNDS=12 \
  knowledge-vault-api:test

# Test the API
curl http://localhost:3000/health
```

### 3. Test Docker Compose (Easiest!)
```bash
# Start everything (API + MongoDB)
docker compose up

# Run in background (detached mode)
docker compose up -d

# View logs
docker compose logs -f api

# Stop everything
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v
```

### 4. Test CI Locally (Using act)
```bash
# Install act (GitHub Actions local runner)
# macOS:
brew install act

# Run CI workflow locally
act push
```

### 5. Common Docker Commands
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop <container-id>

# Remove a container
docker rm <container-id>

# View container logs
docker logs <container-id>

# Execute commands inside container
docker exec -it <container-id> sh

# Clean up everything (BE CAREFUL!)
docker system prune -a
```

## Troubleshooting

### Issue: Port already in use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Issue: Cannot connect to Docker daemon
```bash
# Start Docker Desktop (macOS)
open -a Docker
```

### Issue: Build fails - module not found
```bash
# Clear Docker cache and rebuild
docker build --no-cache -t knowledge-vault-api:test .
```

### Issue: MongoDB connection fails
```bash
# Check if MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongo
```

## After Testing - Push to GitHub

Once everything works locally:

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: add Docker and CI/CD setup"

# Push to GitHub (triggers CI/CD!)
git push origin main
```

## Monitor GitHub Actions

1. Go to: https://github.com/muhammadawais93/Knowledge-Vault-API/actions
2. Watch the workflow run
3. Click on a workflow to see details
4. Check each step for errors

## CI/CD Flow Diagram

```
Developer pushes code
         ↓
GitHub receives push
         ↓
    CI STARTS (ci.yml)
         ↓
    ├─ Checkout code
    ├─ Install Node.js
    ├─ Install dependencies
    ├─ Run linter ✓
    ├─ Run unit tests ✓
    ├─ Run integration tests ✓
    ├─ Generate coverage ✓
    └─ Build Docker image ✓
         ↓
   CD STARTS (cd.yml)
   (Only on main branch)
         ↓
    ├─ Checkout code
    ├─ Login to Docker Hub
    ├─ Build Docker image
    └─ Push to Docker Hub ✓
         ↓
    Image is available!
    Anyone can: docker pull <username>/knowledge-vault-api
```

## Next Steps

1. ✅ Test Docker build locally
2. ✅ Test Docker Compose locally
3. ✅ Set up GitHub Secrets
4. ✅ Push to GitHub
5. ✅ Monitor CI/CD workflows
6. 🎉 Celebrate your first CI/CD pipeline!
