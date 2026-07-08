import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

type Config = {
  allowPermanent: boolean
  allowTemporary: boolean
  noticesUrl: string
  noticesTempUrl: string
  violatingStudents: string
}

const CONFIG_PATH = path.join(process.cwd(), 'public', 'images', 'config.json')

function readLocalConfig(): Config {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
  return JSON.parse(raw)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'GET') {
    try {
      return res.status(200).json(readLocalConfig())
    } catch (err: any) {
      return res.status(500).json({ error: err.message || String(err) })
    }
  }

  if (req.method === 'POST') {
    const auth = req.headers.authorization || ''
    const token = auth.replace(/^Bearer\s+/i, '').trim()
    const expected = (process.env.ADMIN_TOKEN || '').trim()
    if (!expected) {
      return res.status(500).json({ error: 'ADMIN_TOKEN is not set on the server (check Vercel env vars + redeploy)' })
    }
    if (token !== expected) {
      return res.status(401).json({ error: 'Unauthorized (token mismatch)' })
    }

    const current = readLocalConfig()
    const updates = req.body as Partial<Config>
    const next = { ...current, ...updates }

    try {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2))
      return res.status(200).json(next)
    } catch (err: any) {
      return res.status(500).json({
        error: 'Could not write config.json (read-only filesystem in production — this only works in local dev for now).',
      })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
