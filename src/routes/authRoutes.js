import { Router } from 'express'
import { createAuthUrl, getOAuthClient, loadTokens, saveTokens } from '../config/google.js'

const router = Router()

router.get('/google', async (_req, res) => {
  const client = getOAuthClient()
  const url = createAuthUrl(client)
  res.redirect(url)
})

router.get('/google/callback', async (req, res) => {
  try {
    const client = getOAuthClient()
    const { code } = req.query
    const { tokens } = await client.getToken(code)
    await saveTokens(tokens)
    res.send('Google Calendar connected.')
  } catch (err) {
    res.status(500).send('OAuth error')
  }
})

export default router
