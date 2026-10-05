import React, { useState } from 'react'
import { Paper, TextField, Button, Stack, Typography, Link } from '@mui/material'

export default function AuthForm({ onSubmit, loading, error }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ mode, name, email, password })
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 460, mx: 'auto', mt: 8 }}>
      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" align="center">ZenProto</Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {mode === 'login' ? 'Welcome back. Journal with intention.' : 'Create your mindful space.'}
        </Typography>

        {mode === 'signup' && (
          <TextField label="Name" value={name} onChange={e => setName(e.target.value)} required />
        )}

        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        {error && (
          <Typography color="error" variant="body2">{error}</Typography>
        )}

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
        </Button>

        <Typography variant="body2" align="center">
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
          <Link component="button" type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </Link>
        </Typography>
      </Stack>
    </Paper>
  )
}
