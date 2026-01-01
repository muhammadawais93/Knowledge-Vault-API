# Knowledge Vault API

[![CI - Test & Build](https://github.com/muhammadawais93/Knowledge-Vault-API/workflows/CI%20-%20Test%20%26%20Build/badge.svg)](https://github.com/muhammadawais93/Knowledge-Vault-API/actions)

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
- **Logging**: Pino structured logging
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest framework

## 📋 API Endpoints

- `/api/auth` - User authentication (register, login)
- `/api/knowledge` - Knowledge items CRUD operations
- `/api/collections` - Collections management
- `/api/search` - Full-text search functionality
- `/api/analytics` - User analytics and statistics

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

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/knowledge-vault
JWT_SECRET=your-super-secret-jwt-key
SALT_ROUNDS=12
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

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
├── utils/          # Utility functions
└── __tests__/      # Test files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Build TypeScript to JavaScript
- `npm run clean` - Remove build directory
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues
- `npm run format` - Format code with Prettier

## 📊 Data Models

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

- [ ] File upload support for attachments
- [ ] Advanced search filters
- [ ] Export functionality (JSON, Markdown)
- [ ] Real-time collaboration features
- [ ] Mobile app companion

---

Perfect for developers building personal knowledge management tools, note-taking applications, or learning management systems.
