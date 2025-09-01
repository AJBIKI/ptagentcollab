import { google } from 'googleapis'
import dotenv from 'dotenv'
import { join } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

dotenv.config()

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly'
]

const tokenPath = join(process.cwd(), 'google_token.json')

export function getOAuthClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env
  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
}

export async function loadTokens(oAuth2Client) {
  if (existsSync(tokenPath)) {
    const content = await readFile(tokenPath, 'utf-8')
    oAuth2Client.setCredentials(JSON.parse(content))
    return true
  }
  return false
}

export async function saveTokens(tokens) {
  await writeFile(tokenPath, JSON.stringify(tokens, null, 2), 'utf-8')
}

export function createAuthUrl(oAuth2Client) {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  })
}

export function calendar(oAuth2Client) {
  return google.calendar({ version: 'v3', auth: oAuth2Client })
}
