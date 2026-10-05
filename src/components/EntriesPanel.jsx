import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import SpaRoundedIcon from '@mui/icons-material/SpaRounded'
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded'
import MoodBadIcon from '@mui/icons-material/MoodBad'
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded'
import SentimentSatisfiedAltRoundedIcon from '@mui/icons-material/SentimentSatisfiedAltRounded'
import EntryList from './EntryList'
import EntrySearchFilter from './EntrySearchFilter'

const moodOptions = [
  { name: 'Happy', color: '#f0dc72', score: 5, icon: SentimentSatisfiedAltRoundedIcon },
  { name: 'Grateful', color: '#afd77a', score: 4, icon: VolunteerActivismRoundedIcon },
  { name: 'Calm', color: '#5caf78', score: 3, icon: SpaRoundedIcon },
  { name: 'Anxious', color: '#397650', score: 2, icon: MoodBadIcon },
  { name: 'Sad', color: '#687478', score: 1, icon: SentimentDissatisfiedRoundedIcon }
]

function MoodGraph({ entries }) {
  const moodCounts = moodOptions.map(({ name, color }) => ({
    name,
    color,
    count: entries.filter(entry => entry.mood === name).length
  }))
  const totalEntries = entries.length
  const chartEntries = [...entries]
    .filter(entry => moodOptions.some(mood => mood.name === entry.mood))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const chartPoints = chartEntries.map((entry, index) => {
    const mood = moodOptions.find(option => option.name === entry.mood)
    const x = chartEntries.length === 1 ? 300 : 24 + (index / (chartEntries.length - 1)) * 552
    const y = 154 - ((mood.score - 1) / 4) * 126
    return { x, y, color: mood.color }
  })
  const linePoints = chartPoints.map(point => `${point.x},${point.y}`).join(' ')

  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Mood flow</Typography>
      <Box sx={{ position: 'relative', height: 190, overflow: 'hidden' }}>
        <Stack spacing={0.5} sx={{ position: 'absolute', left: 0, top: 8, bottom: 18, justifyContent: 'space-between' }}>
          {moodOptions.map(({ name, icon: MoodIcon }) => <MoodIcon key={name} sx={{ fontSize: 20, color: 'text.secondary' }} />)}
        </Stack>
        <Box component="svg" viewBox="0 0 600 180" preserveAspectRatio="none" sx={{ width: '100%', height: '100%', pl: 3 }} aria-label="Mood flow graph">
          {[28, 60, 92, 123, 154].map(y => <line key={y} x1="24" y1={y} x2="576" y2={y} stroke="currentColor" opacity="0.1" />)}
          {chartPoints.length > 0 && <polyline points={linePoints} fill="none" stroke="#55a875" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}
          {chartPoints.map((point, index) => <circle key={`${point.x}-${index}`} cx={point.x} cy={point.y} r="5" fill={point.color} stroke="white" strokeWidth="2" />)}
        </Box>
        {chartPoints.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            Add entries to see your mood flow.
          </Typography>
        )}
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1.5 }}>Mood bar</Typography>
      <Box role="img" aria-label="Mood distribution bar" sx={{ display: 'flex', height: 28, overflow: 'hidden', borderRadius: 4, bgcolor: 'action.hover' }}>
        {moodCounts.map(mood => (
          <Box key={mood.name} sx={{ width: `${totalEntries ? (mood.count / totalEntries) * 100 : 0}%`, minWidth: mood.count ? 2 : 0, bgcolor: mood.color, transition: 'width 300ms ease' }} />
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, mt: 1.5 }}>
        {moodOptions.map(({ name, icon: MoodIcon, color }) => {
          const count = moodCounts.find(mood => mood.name === name).count
          const percentage = totalEntries ? Math.round((count / totalEntries) * 100) : 0
          return (
            <Stack key={name} spacing={0.25} alignItems="center">
              <MoodIcon sx={{ color, fontSize: 25 }} />
              <Typography variant="caption" color="text.secondary">{percentage}%</Typography>
            </Stack>
          )
        })}
      </Box>
    </Box>
  )
}

export default function EntriesPanel({
  open,
  onClose,
  entries,
  searchQuery,
  onSearchChange,
  selectedMood,
  onMoodChange,
  onDelete,
  totalResults,
  emptyMessage
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Journal entries</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <MoodGraph entries={entries} />
          <EntrySearchFilter
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            selectedMood={selectedMood}
            onMoodChange={onMoodChange}
            totalResults={totalResults}
          />
          <EntryList entries={entries} onDelete={onDelete} emptyMessage={emptyMessage} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
