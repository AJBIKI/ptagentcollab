import { JSONFilePreset } from 'lowdb/node'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = new URL('.', import.meta.url).pathname
const dbFile = join(__dirname, '../data.json')

export const db = await JSONFilePreset(dbFile, { tasks: [], users: [] })
