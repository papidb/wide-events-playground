import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import getDatabase from '../../../src/db'

export const Route = createAPIFileRoute('/api/all')({
  GET: async ({ request, params }) => {
    const db = await getDatabase()
    const tables = await db.all('SELECT * FROM http_logs limit 1000;')
    return json(tables)
  },
})
