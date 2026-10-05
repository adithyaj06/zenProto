import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material'

export default function InsightsPanel({ open, onClose, entries }) {
  const moodCounts = entries.reduce((acc, entry) => {
    const mood = entry.mood || 'Calm'
    acc[mood] = (acc[mood] || 0) + 1
    return acc
  }, {})

  const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]
  const totalWords = entries.reduce((sum, entry) => {
    const text = `${entry.title || ''} ${entry.content || ''}`.trim()
    return sum + (text ? text.split(/\s+/).length : 0)
  }, 0)
  const averageWords = entries.length ? Math.round(totalWords / entries.length) : 0
  const longestEntry = entries.reduce((longest, entry) => {
    const wordCount = `${entry.content || ''}`.trim().split(/\s+/).filter(Boolean).length
    return wordCount > longest ? wordCount : longest
  }, 0)
  const latestEntry = entries.length ? new Date(entries[0].createdAt).toLocaleDateString() : 'No entries yet'

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Your journaling insights</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemText primary="Total entries" secondary={entries.length} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Most common mood"
              secondary={mostCommonMood ? `${mostCommonMood[0]} (${mostCommonMood[1]} entries)` : 'No entries yet'}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Average words per entry" secondary={averageWords} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Longest entry" secondary={`${longestEntry} words`} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Latest entry" secondary={latestEntry} />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
