# 📝 Notes App: Authenticated Full-Stack MERN App

A full-stack notes app built across an internship: a REST API on **Node.js,
Express, and MongoDB**, a **React** frontend, and now a full **JWT-based
authentication system** including signup, login, logout, and per-user private notes.

## Project structure

```
notes-app/
├── server.js                     # Entry point: creates app, middleware, starts server
├── routes/
│   ├── notes.js                  # Notes routes — all protected by JWT
│   └── auth.js                   # /api/auth/register, /login, /me
├── controllers/
│   ├── notesController.js        # CRUD logic, scoped to the logged-in user
│   └── authController.js         # register / login / getMe logic
├── middleware/
│   └── auth.js                   # protect() — verifies the JWT on every request
├── models/
│   ├── Note.js                   # Mongoose schema (now includes `user` owner field)
│   └── User.js                   # Mongoose schema — hashed password, unique email
├── utils/
│   └── generateToken.js          # Signs a JWT for a given user id
├── config/
│   └── db.js                     # MongoDB connection
├── frontend/                     # React app (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js         # Shared fetch wrapper: attaches JWT, handles 401s
│   │   │   ├── notes.js          # Notes API calls
│   │   │   └── auth.js           # signup / login / logout / fetchCurrentUser
│   │   ├── hooks/
│   │   │   ├── useAuth.js        # Auth state + actions
│   │   │   └── useNotes.js       # Notes state + actions
│   │   ├── components/
│   │   │   ├── AuthPage.jsx      # Toggles between login and signup
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   ├── Header.jsx        # Now shows username + logout button
│   │   │   ├── ComposeCard.jsx / NoteCard.jsx / NotesGrid.jsx / ...
│   │   ├── App.jsx                # Gatekeeper: shows AuthPage or the notes app
│   │   └── App.css
│   └── package.json
├── package.json
└── README.md
```

## 1. Run the backend

```bash
npm install
npm start          # or: npm run dev  (auto-restarts on file changes)
```

Create a `.env` file in the project root (gitignored, never committed):

```
MONGO_URI=your-mongodb-connection-string
PORT=3000
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d
```

Generate a strong `JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Server runs at `http://localhost:3000`.

### API endpoints

| Method | URL                | Auth required | Body                                                  | Description                    |
|--------|--------------------|:--:|--------------------------------------------------------|---------------------------------|
| POST   | /api/auth/register | No  | `{ username, email, password }`                        | Create an account, returns a JWT |
| POST   | /api/auth/login    | No  | `{ email, password }`                                   | Log in, returns a JWT            |
| GET    | /api/auth/me        | Yes | —                                                       | Get the logged-in user           |
| GET    | /api/notes          | Yes | —                                                       | Get **your** notes               |
| GET    | /api/notes/:id      | Yes | —                                                       | Get one of your notes by id      |
| POST   | /api/notes          | Yes | `{ title, content }`                                    | Create a note                    |
| PUT    | /api/notes/:id      | Yes | `{ title?, content? }`                                  | Update one of your notes         |
| DELETE | /api/notes/:id      | Yes | —                                                       | Delete one of your notes         |

"Auth required" means the request needs an `Authorization: Bearer <token>`
header. Notes are scoped per user — you'll only ever see and modify notes
you created; the API returns `404` for another user's note id, not `403`,
so it doesn't reveal that the note exists at all.

### Testing with curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"noor","email":"noor@example.com","password":"secret123"}'
# → { success: true, token: "...", user: { id, username, email } }

# Log in
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"noor@example.com","password":"secret123"}'

# Use the token for a protected route
curl http://localhost:3000/api/notes \
  -H "Authorization: Bearer <paste token here>"
```

## 2. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env    # only needed if your API isn't on localhost:3000
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). You'll land on
a login/signup screen; create an account, and you're in.

To build a production bundle: `npm run build` (output in `frontend/dist`).

## How authentication works

**Backend**
- Passwords are hashed with **bcryptjs** (`bcrypt.hash` with a generated
  salt) before they're ever written to MongoDB — the plaintext password is
  never stored. `bcryptjs` is a pure-JavaScript implementation of the same
  bcrypt algorithm as the native `bcrypt` package; it's a drop-in swap that
  avoids native-module build issues (common on Windows without build
  tools) while hashing exactly the same way.
- On successful register/login, `utils/generateToken.js` signs a **JWT**
  containing the user's id, using `JWT_SECRET` from the environment.
- `middleware/auth.js` (`protect`) reads the `Authorization: Bearer <token>`
  header on every request to a protected route, verifies the JWT, looks the
  user up fresh in the database, and attaches it as `req.user`. If the
  header is missing, malformed, or the token is invalid/expired, it
  responds `401` before the request ever reaches a controller.
- `routes/notes.js` applies `protect` to the whole router with
  `router.use(protect)`, so every notes endpoint requires a valid token.
  `models/Note.js` now has a `user` field, and every query in
  `notesController.js` filters or matches on `req.user.id`, so one user's
  notes are never visible or editable by another.

**Frontend**
- `src/api/client.js` is the single place that knows the JWT's storage key
  (`localStorage`) and attaches it as an `Authorization` header on every
  request. If a response comes back `401`, it clears the stored token and
  throws a flagged error — `useNotes` and `useAuth` catch that flag and log
  the user out automatically, rather than leaving them looking at a broken
  screen.
- `src/hooks/useAuth.js` holds the current user and auth status
  (`checking` / `signed-out` / `signed-in`). On first load, if a token is
  already stored from a previous session, it calls `GET /api/auth/me` to
  confirm it's still valid before deciding whether to show the notes app or
  the login screen.
- `App.jsx` is the gatekeeper: `checking` → a loading line, `signed-out` →
  `AuthPage` (login/signup toggle), `signed-in` → the notes app, now with
  the username and a **Log out** button in the header.

## Status codes used

- `200 OK` — successful GET / PUT / DELETE / login
- `201 Created` — successful register / note creation
- `400 Bad Request` — validation failed (e.g. empty title, short password)
- `401 Unauthorized` — missing/invalid/expired token, or wrong credentials
- `404 Not Found` — note id doesn't exist (or belongs to someone else) / unknown route
- `409 Conflict` — email already registered
- `500 Internal Server Error` — unexpected server error

## Security notes

- `.env` is gitignored in both the root and `frontend/` — never commit real
  secrets. Only `.env.example` (placeholder values) is tracked.
- Passwords are never returned by the API; the `User` schema marks the
  field `select: false`.
- Change `JWT_SECRET` for any real deployment — don't reuse the example
  value or commit a real one to the repo.
