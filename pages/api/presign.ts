import type { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

type Data = {
  url?: string
  publicUrl?: string
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = req.headers.authorization || ''
  const token = auth.replace(/^Bearer\s+/i, '')
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { key, contentType } = req.body as { key: string; contentType?: string }
  if (!key) return res.status(400).json({ error: 'Missing key' })

  const bucket = process.env.S3_BUCKET_NAME
  const region = process.env.AWS_REGION
  if (!bucket || !region) return res.status(500).json({ error: 'S3 not configured' })

  try {
    const client = new S3Client({ region })
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType || 'application/json',
      ACL: 'public-read',
    })

    const url = await getSignedUrl(client, command, { expiresIn: 3600 })
    const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`

    return res.status(200).json({ url, publicUrl })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
}
