import React from 'react'
import { Stack, TextField, Typography, MenuItem } from '@mui/material'

const moodFilterOptions = ['All', 'Calm', 'Grateful', 'Anxious', 'Sad', 'Happy']

export default function EntrySearchFilter({
  searchQuery,
  onSearchChange,
  selectedMood,
  onMoodChange,
  totalResults
}) {
  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Search entries"
        value={searchQuery}
        onChange={event => onSearchChange(event.target.value)}
        placeholder="Search by title or reflection"
      />

      <TextField
        select
        label="Mood filter"
        value={selectedMood}
        onChange={event => onMoodChange(event.target.value)}
      >
        {moodFilterOptions.map(mood => (
          <MenuItem key={mood} value={mood}>
            {mood}
          </MenuItem>
        ))}
      </TextField>

      <Typography variant="body2" color="text.secondary">
        {totalResults} {totalResults === 1 ? 'entry' : 'entries'} found
      </Typography>
    </Stack>
  )
}
