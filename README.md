# ZenProto — Mindful Journaling

A full-stack journaling app with a React + Material UI frontend and a Node.js + Express backend.

Quick start

```bash
# install
npm install

# run frontend dev server (terminal 1)
npm run dev

# run backend API server (terminal 2)
npm run start:server
```

Features

- User signup and login with JWT authentication
- Per-user synced journal entries
- Add, list, and delete entries from the backend
- Persistent storage in `server/data.json`

Authentication flow

- Sign up creates a hashed password and returns a JWT
- Login validates credentials and returns the same token
- All entry routes require the bearer token

Next steps

- Add entry editing and search
- Add refresh tokens and password reset
- Add real database and cloud sync
