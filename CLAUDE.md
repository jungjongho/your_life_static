# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"내 인생 통계" (My Life Stats) - An interactive web application that calculates and displays life statistics based on user's birthdate. Users can share results as images (optimized for SNS viral content). No login required - fully anonymous.

**Stack**:
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS
- Backend: FastAPI, Python 3.10+, SQLAlchemy, PostgreSQL
- Database: PostgreSQL
- Containerization: Docker, Docker Compose
- Deployment: Mac mini home server

## Architecture

### Directory Structure (Planned)

```
project/
├── frontend/src/
│   ├── app/                     # Next.js file-based routing
│   ├── components/              # Atomic Design structure
│   │   ├── atoms/               # 10-30 lines - single UI elements
│   │   ├── molecules/           # 30-80 lines - atom combinations
│   │   ├── organisms/           # 80-150 lines - complex UI sections
│   │   └── templates/           # layouts
│   ├── hooks/                   # 50-150 lines - business logic & state
│   ├── types/                   # TypeScript interfaces
│   ├── services/                # API calls
│   ├── utils/                   # helper functions
│   └── constants/               # constants
│
└── backend/app/
    ├── main.py                  # FastAPI entry point
    ├── routers/                 # HTTP layer
    ├── services/                # business logic
    ├── repositories/            # DB access
    ├── models/                  # SQLAlchemy models
    ├── schemas/                 # Pydantic schemas
    └── core/                    # config, DB, security
```

### Layer Responsibilities

**Frontend Flow**: Components → Hooks → Services
- **atoms**: UI primitives only (no API calls, no complex logic)
- **molecules**: atom combinations with simple logic (no API calls, no global state)
- **organisms**: complex UI sections using hooks (no direct API calls)
- **hooks**: business logic and state management (calls services)
- **services**: API communication only (no business logic)

**Backend Flow**: Router → Service → Repository
- **Router**: HTTP request/response, Pydantic validation (no business logic, no DB access)
- **Service**: business logic, transaction orchestration (no HTTP codes, no direct SQL)
- **Repository**: DB access via SQLAlchemy (no business logic)

**Critical Rule**: Never skip intermediate layers.

## Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| Python variables/functions | snake_case | `user_name`, `get_user()` |
| Python classes | PascalCase | `UserService` |
| Python files | snake_case.py | `user_service.py` |
| TypeScript variables/functions | camelCase | `userName`, `getUser()` |
| TypeScript components | PascalCase | `UserCard` |
| Component files | PascalCase.tsx | `UserCard.tsx` |
| Hook files | camelCase.ts | `useAuth.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY` |
| DB tables | snake_case (plural) | `users` |
| DB columns | snake_case | `created_at` |
| API endpoints | kebab-case | `/user-profiles` |

## Development Order

**Backend**:
1. models (DB schema)
2. schemas (Pydantic DTOs)
3. repositories (CRUD)
4. services (business logic)
5. routers (API endpoints)

**Frontend**:
1. types (interfaces)
2. services (API calls)
3. hooks (business logic)
4. atoms → molecules → organisms

## Code Standards

### Type Hints
All functions must include type hints:

**Python**:
```python
from typing import Optional, List

async def get_user(user_id: int) -> Optional[User]:
    pass
```

**TypeScript**:
```typescript
interface User {
  id: number;
  name: string;
}

function getUser(id: number): User | null {
  return null;
}
```

### Hard-coding Rules
- **Allowed**: 0, 1, -1, true, false
- **Forbidden**: repeated numbers, URLs, error messages

Always extract magic numbers to named constants:
```python
# Bad
if len(users) > 100:
    pass

# Good
MAX_USERS = 100
if len(users) > MAX_USERS:
    pass
```

### Function Size
- Target: ≤50 lines
- If exceeding, consider extracting smaller functions

## Feature Specifications

Core statistics to calculate:
- Total days/hours/minutes/seconds lived
- Heart beats (72 beats/min average)
- Breaths taken (15 breaths/min average)
- Sleep hours (8 hours/day basis)
- Meals eaten (3 meals/day basis)
- Days until next birthday
- Days until next 10,000-day milestone

Key features:
- Date input validation (no future dates, min year 1900)
- Number counting animations
- Image download (html2canvas)
- URL sharing with query parameters
- Gradient backgrounds with emoji icons

## Docker Deployment

### Development
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up backend
docker-compose up frontend

# Rebuild after code changes
docker-compose up --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Remove volumes (careful: deletes DB data)
docker-compose down -v
```

### Production
```bash
# Start with nginx reverse proxy
docker-compose --profile production up -d

# Check service health
docker-compose ps
docker-compose exec backend curl http://localhost:8000/health
docker-compose exec frontend curl http://localhost:3000

# Database backup
docker-compose exec db pg_dump -U postgres your_life_stats > backup.sql
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Update credentials in `.env` (especially `DB_PASSWORD` and `SECRET_KEY`)
3. For production, set `NEXT_PUBLIC_API_URL` to your backend domain

### Service URLs (Configurable)
- Frontend: http://localhost:3050 (host port 3050 → container port 3000)
- Backend API: http://localhost:8050 (host port 8050 → container port 8000)
- Backend API Docs: http://localhost:8050/docs
- PostgreSQL: localhost:5432

**Note**: Ports are configured in `docker-compose.yml` and can be changed to avoid conflicts with other projects on the same server.

### Troubleshooting
- **Port conflicts**: Change ports in `docker-compose.yml`
- **DB connection failed**: Wait for DB health check, check `DATABASE_URL`
- **Frontend can't reach backend**: Verify `NEXT_PUBLIC_API_URL` matches backend URL

## Documentation Pattern

For each feature, create `docs/{AREA}_{LAYER}_{FEATURE}.md`:

```markdown
# Feature Name

## Data Flow
Input → Processing → Output

## Input
- param: type - description

## Output
- return: type - description

## Dependencies
- modules used

## Related Files
- file paths
```
