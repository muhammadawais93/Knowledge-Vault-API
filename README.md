# Knowledge Vault API

[![CI - Test & Build](https://github.com/muhammadawais93/Knowledge-Vault-API/workflows/CI%20-%20Test%20%26%20Build/badge.svg)](https://github.com/muhammadawais93/Knowledge-Vault-API/actions)

> The CI badge shows the status of automated tests and builds. Click it to see detailed workflow runs.

A robust RESTful API built with Node.js, TypeScript, and MongoDB for managing personal knowledge items including notes, bookmarks, and code snippets. Features full-text search, collections organization, user authentication, and analytics dashboard.

## 🚀 Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 📝 **Knowledge Management** - Create, read, update, delete notes, bookmarks, and code snippets
- 🔍 **Full-Text Search** - MongoDB text search with weighted relevance scoring
- 📁 **Collections** - Organize knowledge items into custom collections
- 📊 **Analytics** - Usage statistics and insights dashboard
- 🏷️ **Tagging System** - Categorize and filter content with tags
- 👤 **User Management** - Profile management with role-based access
- 🔒 **Privacy Controls** - Public/private content visibility settings

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **API Documentation**: Swagger/OpenAPI with swagger-ui-express
- **Logging**: Pino structured logging
- **Security**: Helmet.js, rate limiting, CORS
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest with ts-jest, Supertest
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## �� API Endpoints

- `/api/auth` - User authentication (register, login)
- `/api/knowledge` - Knowledge items CRUD operations
- `/api/collections` - Collections management
- `/api/search` - Full-text search functionality
- `/api/analytics` - User analytics and statistics
- `/docs` - Interactive API documentation (Swagger UI)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/knowledge-vault-api.git
cd knowledge-vault-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development          # development | production | test
PORT=3000                    # Server port

# Database
MONGO_URI=mongodb://localhost:27017/knowledge-vault

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SALT_ROUNDS=12               # bcrypt salt rounds (higher = more secure but slower)

# Logging (optional)
LOG_LEVEL=info              # silent | error | warn | info | debug
```

⚠️ **Never commit the `.env` file to version control!** Use `.env.example` as a template.

### Running the Application

#### Without Docker

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

#### With Docker (Recommended)

```bash
# Start API + MongoDB
docker compose up

# Run in detached mode
docker compose up -d

# Stop services
docker compose down

# Clean up volumes
docker compose down -v
```

For detailed Docker setup instructions, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md).

## 📁 Project Structure

```
src/
├── config/          # Database and app configuration
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/         # Mongoose schemas
├── routes/         # API route definitions
├── services/       # Business logic
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
tests/
├── unit/           # Unit tests
└── integration/    # Integration tests
```

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
npm run test:unit

# Run with watch mode
npm run test:unit:watch

# Generate coverage report
npm run coverage:unit
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration

# Run with watch mode
npm run test:integration:watch

# Generate coverage report
npm run coverage:integration
```

### Test Coverage
The project maintains **80% code coverage threshold** across:
- Branches
- Functions
- Lines
- Statements

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Build TypeScript to JavaScript
- `npm run clean` - Remove build directory

### Testing
- `npm run test:unit` - Run unit tests
- `npm run test:integration` - Run integration tests
- `npm run test:unit:watch` - Run unit tests in watch mode
- `npm run test:integration:watch` - Run integration tests in watch mode
- `npm run coverage:unit` - Generate unit test coverage
- `npm run coverage:integration` - Generate integration test coverage

### Code Quality
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues
- `npm run format` - Format code with Prettier

## � Security

- JWT token-based authentication
- Password hashing with bcrypt (configurable salt rounds)
- Rate limiting on all endpoints
- Stricter rate limiting on authentication endpoints
- Helmet.js for security headers
- CORS protection
- Environment-based configuration (no hardcoded secrets)
- Input validation and sanitization

## 💡 Development Tips

### MongoDB Connection
Ensure MongoDB is running before starting the server:
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### Debugging
The project uses Pino for structured logging. Set `LOG_LEVEL=debug` in your `.env` for detailed logs.

### Code Style
- ESLint and Prettier are configured - run `npm run lint:fix` and `npm run format` before committing
- Pre-commit hooks can be added with Husky (optional)

## �📊 Data Models

### Knowledge Item Types

- **Note**: Text-based content with markdown support
- **Bookmark**: URL links with metadata
- **Code Snippet**: Code blocks with language syntax highlighting

### Key Features

- Full-text search across all content
- Tagging and categorization
- Collections for organization
- User-specific privacy controls
- Rich metadata tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🚧 Roadmap

### Completed ✅
- ✅ Full-text search with MongoDB text indexes
- ✅ User analytics dashboard
- ✅ Docker containerization
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Comprehensive test coverage (unit + integration)
- ✅ Interactive API documentation

### Planned 🔄
- [ ] Rate limiting per user (not just per IP)
- [ ] Email verification for user registration
- [ ] Password reset functionality
- [ ] File upload support for attachments
- [ ] Advanced search filters (date ranges, relevance scoring)
- [ ] Export functionality (JSON, Markdown, PDF)
- [ ] Sharing and collaboration features
- [ ] WebSocket support for real-time updates
- [ ] GraphQL API alternative
- [ ] Mobile app companion (React Native)

---

Perfect for developers building personal knowledge management tools, note-taking applications, or learning management systems.
