const express = require('express')
const fs = require('fs').promises
const path = require('path')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cors())
app.use(express.json({ limit: '8mb' }))

const DATA_PATH = path.join(__dirname, 'data.json')
const JWT_SECRET = process.env.JWT_SECRET || 'zenproto-dev-secret'

async function loadStore() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      entries: parsed.entries && typeof parsed.entries === 'object' ? parsed.entries : {}
    }
  } catch (e) {
    return { users: [], entries: {} }
  }
}

async function saveStore(store) {
  await fs.writeFile(DATA_PATH, JSON.stringify(store, null, 2), 'utf8')
}

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
}

function getAuthUser(req) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return { id: 'guest', email: 'guest@zenproto.local', name: 'Guest' }
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (e) {
    return { id: 'guest', email: 'guest@zenproto.local', name: 'Guest' }
  }
}

async function requireAuth(req, res, next) {
  req.user = getAuthUser(req)
  next()
}

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body || {}
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }

  const store = await loadStore()
  const existing = store.users.find(user => user.email.toLowerCase() === email.toLowerCase())
  if (existing) {
    return res.status(409).json({ error: 'User already exists' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash
  }

  store.users.push(user)
  store.entries[user.id] = []
  await saveStore(store)

  const token = createToken(user)
  return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const store = await loadStore()
  const user = store.users.find(entry => entry.email.toLowerCase() === String(email).trim().toLowerCase())
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = createToken(user)
  return res.json({ user: { id: user.id, name: user.name, email: user.email }, token })
})

app.get('/api/auth/me', requireAuth, async (req, res) => {
  const store = await loadStore()
  const user = store.users.find(entry => entry.id === req.user.id) || req.user
  return res.json({ user: { id: user.id, name: user.name, email: user.email } })
})

app.get('/api/entries', requireAuth, async (req, res) => {
  const store = await loadStore()
  const entries = store.entries[req.user.id] || []
  return res.json(entries)
})

app.post('/api/entries', requireAuth, async (req, res) => {
  const entry = req.body || {}
  if (!entry.content && !entry.title) {
    return res.status(400).json({ error: 'Entry content is required' })
  }

  const store = await loadStore()
  const newEntry = {
    id: Date.now(),
    title: entry.title || '',
    content: entry.content || '',
    mood: entry.mood || 'Calm',
    image: entry.image && typeof entry.image.dataUrl === 'string'
      ? { name: String(entry.image.name || 'Journal image'), dataUrl: entry.image.dataUrl }
      : null,
    createdAt: new Date().toISOString()
  }

  const entryList = store.entries[req.user.id] || []
  entryList.unshift(newEntry)
  store.entries[req.user.id] = entryList
  await saveStore(store)

  return res.status(201).json(newEntry)
})

app.delete('/api/entries/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  const store = await loadStore()
  const list = store.entries[req.user.id] || []
  const filtered = list.filter(entry => entry.id !== id)
  store.entries[req.user.id] = filtered
  await saveStore(store)
  return res.json({ deleted: list.length - filtered.length })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`ZenProto API listening on ${port}`))
