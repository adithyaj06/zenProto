# ZenProto — Mindful Journaling

A mindful journaling app with a React + Material UI frontend and a separate Express API in `backend/`. The Vite development server proxies `/api` requests to Express on port `4001`.

Quick start

```bash
# install
npm install

# run the frontend and API together
npm run dev
```

For a deployed frontend, set `VITE_API_URL` to the origin of the separately hosted Express API, for example `https://api.example.com`. The API must allow requests from the frontend's origin. The frontend defaults to relative `/api` URLs when this variable is unset, which is intended for local Vite development.

The API currently stores data in `server/data.json` to preserve the existing local journal data. This JSON-file storage is suitable for local development only; use a persistent database and configure `JWT_SECRET` when deploying the API.

Features

- User signup and login with JWT authentication
- Add, list, and delete journal entries through the Express API
- Theme and font preferences saved in the browser

Authentication flow

- Sign up creates a hashed password and returns a JWT
- Login validates credentials and returns the same token
- All entry routes require the bearer token

Next steps

- Add entry editing and search
- Add refresh tokens and password reset
- Replace local JSON storage with a persistent database
