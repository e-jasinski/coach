# AI Golf Coach MVP

A full-stack application that provides AI-powered golf coaching through journal entries and personalized feedback.

## Tech Stack

### Backend

- Node.js (v18+)
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- OpenAI API Integration
- SendGrid for Email

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS

## Prerequisites

- Node.js v18 or higher
- PostgreSQL
- Yarn package manager
- OpenAI API key
- SendGrid API key

## Environment Setup

1. Clone the repository:

```bash
git clone [repository-url]
cd coach
```

2. Install dependencies:

```bash
cd ai-golf-coach-mvp
yarn install
cd frontend/ai_golf_coach
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/coach
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
FRONTEND_BASE_URL=http://localhost:5173
NODE_ENV=development
```

## Database Setup

1. Create a PostgreSQL database:

```bash
createdb coach
```

2. Run migrations:

```bash
cd ai-golf-coach-mvp
npx sequelize-cli db:migrate
```

## Development

### Backend Development

1. Start the development server:

```bash
cd ai-golf-coach-mvp
yarn dev
```

The server will run on `http://localhost:4000`

### Frontend Development

1. Start the development server:

```bash
cd ai-golf-coach-mvp/frontend/ai_golf_coach
yarn dev
```

The frontend will run on `http://localhost:5173`

## Project Structure

```
ai-golf-coach-mvp/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── frontend/         # React frontend
│   └── ai_golf_coach/
│       ├── src/     # React source code
│       └── public/  # Static assets
├── middleware/       # Express middleware
├── migrations/       # Database migrations
├── models/          # Sequelize models
├── routes/          # API routes
└── server.js        # Main server file
```

## API Endpoints

- `/api/auth/*` - Authentication routes
- `/api/journal/*` - Journal entry management
- `/api/profile/*` - User profile management
- `/api/ai-coach/*` - AI coaching interactions

## Deployment

The application is configured for deployment on Railway. The deployment process is automated through the `Procfile` and `railway.toml` configuration.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests (if applicable)
4. Submit a pull request

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token generation
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `SENDGRID_API_KEY`: SendGrid API key for email functionality
- `FRONTEND_BASE_URL`: Frontend application URL
- `NODE_ENV`: Environment (development/production)

## Troubleshooting

1. Database Connection Issues:

   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env
   - Ensure migrations are up to date

2. Frontend Build Issues:

   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Verify Vite configuration

3. API Connection Issues:
   - Check CORS configuration
   - Verify environment variables
   - Ensure backend server is running

## License

[License information to be added]
