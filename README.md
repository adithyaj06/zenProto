# ZenProto — Mindful Journaling

A mindful journaling app with a React + Material UI frontend. Journal entries are stored in browser local storage, so they remain on the current browser and are not synced across devices. The Express API can still be run locally, but the deployed frontend does not depend on it.

Quick start

```bash
# install
npm install

# run the frontend and API together
npm run dev
```

Features

- User signup and login with JWT authentication
- Add, list, and delete browser-local journal entries
- Theme and font preferences saved in the browser

Authentication flow

- Sign up creates a hashed password and returns a JWT
- Login validates credentials and returns the same token
- All entry routes require the bearer token

Next steps

- Add entry editing and search
- Add refresh tokens and password reset
- Add real database and cloud sync
