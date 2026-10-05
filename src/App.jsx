import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Container, AppBar, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem, Tooltip, ListSubheader, Divider } from '@mui/material'
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded'
import JoinFullRoundedIcon from '@mui/icons-material/JoinFullRounded'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import LogoutIcon from '@mui/icons-material/Logout'
import JournalEntryForm from './components/JournalEntryForm'
import InsightsPanel from './components/InsightsPanel'
import MentalHealthFact from './components/MentalHealthFact'
import EntriesPanel from './components/EntriesPanel'
import MeditationPanel from './components/MeditationPanel'
import { TOKEN_KEY, THEME_MODE_KEY, THEME_FONT_KEY, themeOptions, fontOptions, getInitialTheme, createAppTheme } from './lib/theme'
import { getTimeGreeting, getJournalStreak, readApiResponse } from './lib/journal'

export default function App() {
  const [user, setUser] = useState({ id: 'guest', name: 'Guest', email: 'guest@zenproto.local' })
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '')
  const [entries, setEntries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMood, setSelectedMood] = useState('All')
  const [insightsOpen, setInsightsOpen] = useState(false)
  const [factsOpen, setFactsOpen] = useState(false)
  const [entriesOpen, setEntriesOpen] = useState(false)
  const [meditationOpen, setMeditationOpen] = useState(false)
  const [themeKey, setThemeKey] = useState(getInitialTheme)
  const [fontKey, setFontKey] = useState(() => localStorage.getItem(THEME_FONT_KEY) || 'system')
  const [themeMenuAnchor, setThemeMenuAnchor] = useState(null)
  const selectedTheme = themeOptions[themeKey]
  const selectedFont = fontOptions[fontKey] || fontOptions.system
  const displayDate = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long' })
  const theme = createAppTheme(themeKey, fontKey)
  const journalStreak = getJournalStreak(entries)

  function selectTheme(nextThemeKey) {
    setThemeKey(nextThemeKey)
    localStorage.setItem(THEME_MODE_KEY, nextThemeKey)
    setThemeMenuAnchor(null)
  }

  function selectFont(nextFontKey) {
    setFontKey(nextFontKey)
    localStorage.setItem(THEME_FONT_KEY, nextFontKey)
    setThemeMenuAnchor(null)
  }

  useEffect(() => {
    loadEntries(token)
  }, [token])

  async function loadEntries(currentToken) {
    try {
      const headers = {}
      if (currentToken) {
        headers.Authorization = `Bearer ${currentToken}`
      }

      const res = await fetch('/api/entries', {
        headers
      })
      if (!res.ok) throw new Error('Failed to load entries')
      const data = await readApiResponse(res)
      setEntries(data)
    } catch (e) {
      console.error('Failed to load entries', e)
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setUser({ id: 'guest', name: 'Guest', email: 'guest@zenproto.local' })
    setEntries([])
  }

  async function addEntry(entry) {
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(entry)
      })
      const created = await res.json()
      if (!res.ok) throw new Error(created.error || 'Could not save entry')
      setEntries(prev => [created, ...prev])
    } catch (e) {
      console.error('Failed to save entry', e)
    }
  }

  async function removeEntry(id) {
    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Could not delete entry')
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch (e) {
      console.error('Failed to delete entry', e)
    }
  }

  const filteredEntries = entries.filter(entry => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    const combinedText = `${entry.title || ''} ${entry.content || ''}`.toLowerCase()
    const matchesSearch = !normalizedSearch || combinedText.includes(normalizedSearch)
    const matchesMood = selectedMood === 'All' || entry.mood === selectedMood
    return matchesSearch && matchesMood
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <JoinFullRoundedIcon />
            <Typography variant="h6">ZenProto</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, ml: 0.5 }}>
              {displayDate}
            </Typography>
            <Tooltip title={`${journalStreak} day journal streak`}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.35,
                  ml: 0.5,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 2,
                  color: journalStreak ? 'warning.light' : 'inherit'
                }}
                aria-label={`${journalStreak} day journal streak`}
              >
                <LocalFireDepartmentRoundedIcon sx={{ fontSize: 18 }} />
                <Typography variant="caption" fontWeight={700}>{journalStreak}</Typography>
              </Box>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" onClick={() => setMeditationOpen(true)}>Meditate</Button>
            <Button color="inherit" onClick={() => setFactsOpen(true)}>Facts</Button>
            <Button color="inherit" onClick={() => setEntriesOpen(true)}>Entries</Button>
            <Button color="inherit" onClick={() => setInsightsOpen(true)}>Insights</Button>
            <Tooltip title={`Theme: ${selectedTheme.label}, Font: ${selectedFont.label}`}>
              <IconButton color="inherit" onClick={event => setThemeMenuAnchor(event.currentTarget)} aria-label="Choose theme">
                <PaletteRoundedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={logout} aria-label="Logout">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box my={3}>
          <Typography variant="h5">
            Hey {user.name}, <Typography component="span" variant="h5" color="text.secondary">{getTimeGreeting()}</Typography>
          </Typography>
        </Box>
        <Box my={4}>
          <JournalEntryForm onAdd={addEntry} />
        </Box>
      </Container>

      <MentalHealthFact open={factsOpen} onClose={() => setFactsOpen(false)} />
      <MeditationPanel open={meditationOpen} onClose={() => setMeditationOpen(false)} />
      <InsightsPanel open={insightsOpen} onClose={() => setInsightsOpen(false)} entries={entries} />
      <Menu
        anchorEl={themeMenuAnchor}
        open={Boolean(themeMenuAnchor)}
        onClose={() => setThemeMenuAnchor(null)}
        MenuListProps={{ 'aria-label': 'Choose theme' }}
      >
        {Object.entries(themeOptions).map(([key, option]) => (
          <MenuItem selected={key === themeKey} onClick={() => selectTheme(key)} key={key}>
            <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: option.swatch, mr: 1.5, border: '1px solid', borderColor: 'divider' }} />
            {option.label}
          </MenuItem>
        ))}
        <Divider />
        <ListSubheader>Font</ListSubheader>
        {Object.entries(fontOptions).map(([key, option]) => (
          <MenuItem selected={key === fontKey} onClick={() => selectFont(key)} key={key}>
            <Typography sx={{ fontFamily: option.family }}>{option.label}</Typography>
          </MenuItem>
        ))}
      </Menu>

      <EntriesPanel
        open={entriesOpen}
        onClose={() => setEntriesOpen(false)}
        entries={filteredEntries}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedMood={selectedMood}
        onMoodChange={setSelectedMood}
        onDelete={removeEntry}
        totalResults={filteredEntries.length}
        emptyMessage={entries.length === 0 ? 'No entries yet — start by writing a short reflection.' : 'No entries match your current search or mood filter.'}
      />
    </ThemeProvider>
  )
}
