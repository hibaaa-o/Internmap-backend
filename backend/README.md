# InternMap Backend

This Express application includes a simple PostgreSQL-backed API with user authentication and role-based access control.

## Setup

1. Ensure PostgreSQL is running and create a database (e.g. `internmap`).
   ```sql
   CREATE DATABASE internmap;
   ```
2. Copy `.env.example` to `.env` and adjust values (especially `JWT_SECRET` and
   `DATABASE_URL` if you use a different connection string).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
5. The server will automatically create a `users` table if it doesn't exist.

## Authentication

### Endpoints

| Route            | Method | Description                             |
|------------------|--------|-----------------------------------------|
| `/auth/register` | POST   | Register a new user (body: username, password, optional role) |
| `/auth/login`    | POST   | Login and receive JWT (body: username, password) |

## Internships Module

An `internships` resource exposes basic CRUD operations.  Only **admin** users
can create, update or delete entries; fetching is public.

### Table schema

```sql
CREATE TABLE internships (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Endpoints

| Route                   | Method | Auth        | Description                          |
|-------------------------|--------|-------------|--------------------------------------|
| `/internships`          | GET    | none        | List all internships                 |
| `/internships/:id`      | GET    | none        | Get internship details by id         |
| `/internships`          | POST   | admin token | Create new internship                |
| `/internships/:id`      | PUT    | admin token | Update existing internship           |
| `/internships/:id`      | DELETE | admin token | Remove internship                    |

#### Filtering and search

The `/internships` GET endpoint supports the following query parameters (all optional):

- `title` – partial match on title
- `company` – partial match on company name
- `location` – partial match on location
- `start_date` – ISO date; return internships starting on/after this date
- `end_date` – ISO date; return internships ending on/before this date
- `q` – text search applied to title and description

Combine multiple parameters; they are ANDed together. Example:

```
GET /internships?company=TechCorp&location=Remote&q=frontend
```


For protected routes include `Authorization: Bearer <token>` header.

### Admin dashboard

An authenticated admin can query `/admin/stats` to retrieve simple counts:

```json
{
  "users": 10,
  "internships": 5,
  "applications": 12,
  "applicationsByStatus": [
    { "status": "pending", "count": 9 },
    { "status": "accepted", "count": 3 }
  ]
}
```

Requesting this endpoint without a valid admin token will return 401/403 accordingly.


#### Applications

Applicants can submit and view their own applications; admins manage all records.

| Route                    | Method | Auth        | Description                          |
|--------------------------|--------|-------------|--------------------------------------|
| `/applications`          | GET    | bearer      | List your applications (admin sees all) |
| `/applications/:id`      | GET    | bearer      | View specific application            |
| `/applications`          | POST   | bearer      | Create application (user_id from token) |
| `/applications/:id`      | PUT    | bearer      | Owner can edit cover letter; admin can change status |
| `/applications/:id`      | DELETE | bearer      | Owner or admin may delete            |

`status` defaults to `pending` and is free‑form text (e.g. "accepted").

On successful login/registration a JWT token is returned alongside user data.

### Protecting Routes

Two middleware helpers are available:

```js
const { authenticate, authorizeRoles } = require('./middleware/auth');
```

- `authenticate` – verifies a bearer token and attaches `req.user`.
- `authorizeRoles('admin', 'staff')` – allow only requests where `req.user.role` matches one of the provided roles.

Example route:

```js
app.get('/admin', authenticate, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin user!', user: req.user });
});
```

## Database schema

The `users` table structure:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Notes

- Passwords are hashed with `bcrypt`.
- JWT tokens expire after one hour by default.
- Make sure to never commit your real `.env` file (it's ignored by `.gitignore`).
