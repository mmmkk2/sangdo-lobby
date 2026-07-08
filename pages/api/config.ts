import type { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'

type Config = {
  allowPermanent: boolean
  allowTemporary: boolean
  noticesUrl: string
  noticesTempUrl: string
  violatingStudents: string
}

const CONFIG_KEY = 'config.json'

function s3Client() {
  const bucket = process.env.S3_BUCKET_NAME
  const region = process.env.AWS_REGION
  if (!bucket || !region) return null
  return { client: new S3Client({ region }), bucket }
}

function readLocalConfig(): Config {
  const filePath = path.join(process.cwd(), 'public', 'images', 'config.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

async function streamToString(stream: any): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf-8')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'GET') {
    const s3 = s3Client()
    if (s3) {
      try {
        const result = await s3.client.send(new GetObjectCommand({ Bucket: s3.bucket, Key: CONFIG_KEY }))
        const body = await streamToString(result.Body)
        return res.status(200).json(JSON.parse(body))
      } catch {
        // S3 object not found yet or S3 error — fall back to local default below
      }
    }
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

    const s3 = s3Client()
    if (!s3) return res.status(500).json({ error: 'S3 not configured' })

    let current: Config
    try {
      const result = await s3.client.send(new GetObjectCommand({ Bucket: s3.bucket, Key: CONFIG_KEY }))
      current = JSON.parse(await streamToString(result.Body))
    } catch {
      current = readLocalConfig()
    }

    const updates = req.body as Partial<Config>
    const next = { ...current, ...updates }

    try {
      await s3.client.send(new PutObjectCommand({
        Bucket: s3.bucket,
        Key: CONFIG_KEY,
        Body: JSON.stringify(next, null, 2),
        ContentType: 'application/json',
        ACL: 'public-read',
      }))
      return res.status(200).json(next)
    } catch (err: any) {
      return res.status(500).json({ error: err.message || String(err) })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
