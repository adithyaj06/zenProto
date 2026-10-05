import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

const TOPICS_API_URL = 'https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Mental_health&cmlimit=100&cmtype=page&format=json&origin=*'
const SUMMARY_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

const fallbackFacts = [
  {
    title: 'Mental health matters',
    text: 'Mental health includes our emotional, psychological, and social well-being and can change throughout life.'
  },
  {
    title: 'Small steps count',
    text: 'Regular sleep, supportive relationships, movement, and time for rest can all contribute to mental well-being.'
  },
  {
    title: 'Support is available',
    text: 'Talking with a trusted person or qualified mental health professional can be a useful step when things feel difficult.'
  }
]

function chooseRandom(items) {
  return items[Math.floor(Math.random() * items.length)]
}

export default function MentalHealthFact({ open, onClose }) {
  const [fact, setFact] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadFact = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const topicsResponse = await fetch(TOPICS_API_URL)
      if (!topicsResponse.ok) throw new Error('Could not load mental health topics')
      const topicsData = await topicsResponse.json()
      const topics = topicsData.query?.categorymembers || []
      if (!topics.length) throw new Error('No mental health topics were returned')

      const topic = chooseRandom(topics)
      const summaryResponse = await fetch(`${SUMMARY_API_URL}${encodeURIComponent(topic.title)}`)
      if (!summaryResponse.ok) throw new Error('Could not load the selected topic')
      const summary = await summaryResponse.json()
      if (!summary.extract) throw new Error('The selected topic had no summary')

      setFact({
        title: summary.title || topic.title,
        text: summary.extract,
        source: summary.content_urls?.desktop?.page
      })
    } catch (requestError) {
      setFact(chooseRandom(fallbackFacts))
      setError('Live facts are unavailable right now. Here is a gentle reminder instead.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFact()
  }, [loadFact])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle id="mental-health-fact-title">Fact</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ pt: 1 }}>
          {error && <Alert severity="info">{error}</Alert>}
          {loading ? (
            <Box
              key="loading"
              sx={{
                animation: 'factReveal 220ms ease-out',
                '@keyframes factReveal': {
                  from: { opacity: 0, transform: 'translateY(8px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              <Typography color="text.secondary">Finding your next fact...</Typography>
            </Box>
          ) : (
            <Box
              key={`${fact.title}-${fact.text}`}
              sx={{
                animation: 'factReveal 220ms ease-out',
                '@keyframes factReveal': {
                  from: { opacity: 0, transform: 'translateY(8px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              <Typography variant="subtitle1">{fact.title}</Typography>
              <Typography color="text.secondary">{fact.text}</Typography>
              {fact.source && (
                <Button href={fact.source} target="_blank" rel="noreferrer" size="small" sx={{ alignSelf: 'flex-start' }}>
                  Read more
                </Button>
              )}
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={loadFact}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
        >
          Next
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
