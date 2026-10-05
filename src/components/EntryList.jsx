import React from 'react'
import { List, ListItem, ListItemText, IconButton, Paper, Typography, Stack, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export default function EntryList({ entries, onDelete, emptyMessage = 'No entries yet — start by writing a short reflection.' }) {
  if (!entries || entries.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Paper>
    )
  }

  return (
    <Paper>
      <List>
        {entries.map(entry => (
          <ListItem key={entry.id} alignItems="flex-start" secondaryAction={
            <IconButton edge="end" onClick={() => onDelete(entry.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText
              primary={<Stack direction="row" justifyContent="space-between"><span>{entry.title || '(No title)'}</span><span style={{fontSize:12,color:'#666'}}>{new Date(entry.createdAt).toLocaleString()}</span></Stack>}
              secondary={
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>{entry.content}</Typography>
                  {entry.image?.dataUrl && (
                    <Box
                      component="img"
                      src={entry.image.dataUrl}
                      alt={entry.image.name || 'Journal attachment'}
                      sx={{ maxWidth: '100%', maxHeight: 220, width: 'fit-content', borderRadius: 3 }}
                    />
                  )}
                </Stack>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
