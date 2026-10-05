import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material'
import SelfImprovementRoundedIcon from '@mui/icons-material/SelfImprovementRounded'

const meditationTypes = [
  { value: 'breathing', label: 'Breathing reset' },
  { value: 'grounding', label: 'Grounding pause' },
  { value: 'self-compassion', label: 'Self-compassion' }
]

const durations = [
  { value: 120, label: '2 minutes' },
  { value: 300, label: '5 minutes' },
  { value: 600, label: '10 minutes' },
  { value: 1200, label: '20 minutes' }
]

const breathingPhases = [
  { label: 'Breathe in', duration: 6 },
  { label: 'Hold', duration: 3 },
  { label: 'Breathe out', duration: 6 }
]

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

function getBreathingPhase(elapsedSeconds) {
  const cycleLength = breathingPhases.reduce((sum, phase) => sum + phase.duration, 0)
  let position = elapsedSeconds % cycleLength

  for (const phase of breathingPhases) {
    if (position < phase.duration) return phase.label
    position -= phase.duration
  }

  return breathingPhases[0].label
}

export default function MeditationPanel({ open, onClose }) {
  const [meditationType, setMeditationType] = useState('breathing')
  const [duration, setDuration] = useState(300)
  const [remaining, setRemaining] = useState(300)
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!running) return undefined

    const timer = setInterval(() => {
      setRemaining(currentRemaining => {
        if (currentRemaining <= 1) {
          setRunning(false)
          setCompleted(true)
          return 0
        }
        return currentRemaining - 1
      })
      setElapsed(currentElapsed => currentElapsed + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [running])

  function handleDurationChange(event) {
    const nextDuration = Number(event.target.value)
    setDuration(nextDuration)
    setRemaining(nextDuration)
    setElapsed(0)
    setRunning(false)
    setCompleted(false)
  }

  function startOrResume() {
    if (completed) {
      setRemaining(duration)
      setElapsed(0)
      setCompleted(false)
    }
    setRunning(true)
  }

  function reset() {
    setRunning(false)
    setCompleted(false)
    setRemaining(duration)
    setElapsed(0)
  }

  function handleClose() {
    setRunning(false)
    onClose()
  }

  const phase = getBreathingPhase(elapsed)
  const progress = ((duration - remaining) / duration) * 100
  const phaseScale = phase === 'Breathe in' ? 1.22 : phase === 'Hold' ? 1.22 : 0.82
  const phaseTransition = phase === 'Hold' ? '3s ease-in-out' : '6s ease-in-out'

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Meditation</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1, alignItems: 'center' }}>
          {!running && !completed && (
            <>
              <FormControl fullWidth>
                <InputLabel id="meditation-type-label">Practice</InputLabel>
                <Select
                  labelId="meditation-type-label"
                  value={meditationType}
                  label="Practice"
                  onChange={event => setMeditationType(event.target.value)}
                >
                  {meditationTypes.map(type => (
                    <MenuItem value={type.value} key={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="meditation-duration-label">Duration</InputLabel>
                <Select
                  labelId="meditation-duration-label"
                  value={duration}
                  label="Duration"
                  onChange={handleDurationChange}
                >
                  {durations.map(option => (
                    <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {completed ? (
            <Stack spacing={1} alignItems="center" sx={{ py: 4 }}>
              <SelfImprovementRoundedIcon color="success" sx={{ fontSize: 56 }} />
              <Typography variant="h5">Well done</Typography>
              <Typography color="text.secondary" align="center">
                You completed a {formatTime(duration)} {meditationTypes.find(type => type.value === meditationType)?.label.toLowerCase()}.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                  border: 4,
                  borderColor: 'primary.light',
                  transform: running && meditationType === 'breathing' ? `scale(${phaseScale})` : 'scale(1)',
                  transition: running && meditationType === 'breathing' ? `transform ${phaseTransition}` : 'transform 0.5s ease-in-out',
                  boxShadow: running && meditationType === 'breathing' && phase === 'Breathe in'
                    ? '0 0 30px rgba(25, 118, 210, 0.25)'
                    : running && meditationType === 'breathing' && phase === 'Breathe out'
                      ? '0 0 18px rgba(25, 118, 210, 0.18)'
                      : 'none'
                }}
              >
                <Stack alignItems="center" spacing={0.5}>
                  <SelfImprovementRoundedIcon color="primary" sx={{ fontSize: 34 }} />
                  <Typography variant="h4" component="div">{formatTime(remaining)}</Typography>
                </Stack>
              </Box>
              <Typography variant="h6">
                {running && meditationType === 'breathing' ? phase : 'Ready when you are'}
              </Typography>
              {running && (
                <Box sx={{ width: '100%', maxWidth: 340, height: 5, bgcolor: 'action.hover', borderRadius: 3 }}>
                  <Box sx={{ width: `${progress}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 3, transition: 'width 1s linear' }} />
                </Box>
              )}
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        {completed ? (
          <Button onClick={startOrResume} variant="contained">Start again</Button>
        ) : (
          <>
            <Button onClick={reset} disabled={!running && remaining === duration}>Reset</Button>
            <Button onClick={() => setRunning(false)} disabled={!running}>Pause</Button>
            <Button onClick={startOrResume} variant="contained">{remaining < duration ? 'Resume' : 'Start'}</Button>
          </>
        )}
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
