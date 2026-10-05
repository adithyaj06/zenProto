import React, { useEffect, useRef, useState } from 'react'
import { Paper, TextField, Button, Stack, Box, IconButton, Tooltip, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material'
import StopIcon from '@mui/icons-material/Stop'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SpaRoundedIcon from '@mui/icons-material/SpaRounded'
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded'
import MoodBadIcon from '@mui/icons-material/MoodBad'
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded'
import SentimentSatisfiedAltRoundedIcon from '@mui/icons-material/SentimentSatisfiedAltRounded'
import { ControlPointRounded, RadioButtonChecked } from '@mui/icons-material'

const moods = ['Calm', 'Grateful', 'Anxious', 'Sad', 'Happy']

const moodOptions = [
  { value: 'Calm', label: 'Calm', icon: SpaRoundedIcon },
  { value: 'Grateful', label: 'Grateful', icon: VolunteerActivismRoundedIcon },
  { value: 'Anxious', label: 'Anxious', icon: MoodBadIcon },
  { value: 'Sad', label: 'Sad', icon: SentimentDissatisfiedRoundedIcon },
  { value: 'Happy', label: 'Happy', icon: SentimentSatisfiedAltRoundedIcon }
]

const motivationalPrompts = [
  'What is one thing that made you feel grounded today?',
  'What is something you can appreciate about this moment?',
  'What small win are you proud of right now?',
  'What emotion is asking for a little more kindness?',
  'What does peace feel like in your body right now?',
  'What is one thing you are letting go of today?',
  'What part of your day deserves a little gentleness?',
  'What do you need more of in your life right now?',
  'What have you learned about yourself recently?',
  'What is one thing you can do to care for yourself today?',
  'What is something that feels hopeful to you?',
  'What is one truth you want to remember about today?',
  'What is your heart trying to say?',
  'What would make this day feel a little lighter?',
  'What are you grateful for in this very moment?',
  'What does joy look like for you today?',
  'What is something you are ready to release?',
  'What would kindness toward yourself sound like?',
  'What brings you a sense of calm and ease?',
  'What is one exciting possibility you want to explore?',
  'What are you noticing about your energy right now?',
  'What feels meaningful to you today?',
  'What would help you feel more present?',
  'What is one thing you can celebrate from today?',
  'What is your mind trying to process?',
  'What makes you feel most like yourself?',
  'What is a small act of self-care you can choose today?',
  'What are you curious about in your life right now?',
  'What do you want more of in the next chapter?',
  'What is something you are learning to trust?',
  'What does a restful, balanced day look like for you?'
]

export default function JournalEntryForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState(moods[0])
  const [isListening, setIsListening] = useState(false)
  const [promptIndex, setPromptIndex] = useState(0)
  const [showPrompt, setShowPrompt] = useState(true)
  const [image, setImage] = useState(null)
  const [imageError, setImageError] = useState('')
  const recognitionRef = useRef(null)
  const voiceBaseContentRef = useRef('')

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPrompt(false)
      setTimeout(() => {
        setPromptIndex(prev => {
          let nextIndex = prev
          while (nextIndex === prev) {
            nextIndex = Math.floor(Math.random() * motivationalPrompts.length)
          }
          return nextIndex
        })
        setShowPrompt(true)
      }, 180)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim() && !title.trim()) return
    onAdd({ title: title.trim(), content: content.trim(), mood, image, createdAt: new Date().toISOString() })
    setTitle('')
    setContent('')
    setMood(moods[0])
    setImage(null)
    setImageError('')
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.')
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setImageError('Please choose an image smaller than 4 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImage({ name: file.name, dataUrl: reader.result })
      setImageError('')
    }
    reader.onerror = () => setImageError('Could not read that image.')
    reader.readAsDataURL(file)
  }

  function toggleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.continuous = false
    voiceBaseContentRef.current = content.trim()

    recognition.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ')
      setContent([voiceBaseContentRef.current, transcript.trim()].filter(Boolean).join(' '))
    }

    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const promptVisible = showPrompt && !content.trim()

  return (
    <Paper sx={{ p: 2 }} component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
          <Box sx={{ position: 'relative', width: '100%' }}>
            <TextField
              multiline
              minRows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              fullWidth
              sx={{
                '& .MuiInputLabel-root': {
                  transition: 'opacity 0.3s ease, transform 0.3s ease'
                }
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                left: 14,
                right: 14,
                top: 14,
                pointerEvents: 'none',
                color: 'rgba(0,0,0,0.6)',
                fontSize: '1rem',
                lineHeight: 1.5,
                opacity: promptVisible ? 1 : 0,
                transform: promptVisible ? 'translateY(0)' : 'translateY(-6px)',
                transition: 'opacity 0.25s ease, transform 0.25s ease',
                whiteSpace: 'pre-wrap'
              }}
            >
              {motivationalPrompts[promptIndex]}
            </Box>
          </Box>
          <Stack spacing={1} sx={{ minWidth: { sm: 150 } }}>
            <Button
              type="button"
              variant={isListening ? 'contained' : 'outlined'}
              color={isListening ? 'error' : 'primary'}
              onClick={toggleVoiceInput}
              startIcon={isListening ? <StopIcon /> : <RadioButtonChecked />}
            >
              {isListening ? 'Stop' : 'Voice'}
            </Button>
            <Button component="label" variant="outlined" startIcon={<ControlPointRounded/>}>
              picture
              <input hidden type="file" accept="image/*" onChange={handleImageChange} />
            </Button>
          </Stack>
        </Stack>

        {image && (
          <Box sx={{ position: 'relative', width: 'fit-content' }}>
            <Box component="img" src={image.dataUrl} alt={image.name} sx={{ display: 'block', maxWidth: '100%', maxHeight: 220, borderRadius: 3 }} />
            <Tooltip title="Remove picture">
              <IconButton
                size="small"
                onClick={() => setImage(null)}
                aria-label="Remove picture"
                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        {imageError && <Typography color="error" variant="body2">{imageError}</Typography>}

        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">Mood</Typography>
          <ToggleButtonGroup
            exclusive
            value={mood}
            onChange={(_, nextMood) => nextMood && setMood(nextMood)}
            aria-label="Select mood"
            sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
          >
            {moodOptions.map(({ value, label, icon: MoodIcon }) => (
              <ToggleButton
                value={value}
                key={value}
                aria-label={label}
                sx={{ border: 1, borderColor: 'divider', borderRadius: '12px !important', minWidth: 58, py: 1 }}
              >
                <Tooltip title={label}>
                  <MoodIcon />
                </Tooltip>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
        <Button type="submit" variant="contained">Save</Button>
      </Stack>
    </Paper>
  )
}
