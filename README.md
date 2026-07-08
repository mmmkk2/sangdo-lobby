Sangdo Lobby - Notices hosting (S3)

This project loads `notices` JSON files from configurable URLs. You can host `notices.json` and `notices_temp.json` on S3 (or another public file host) so changes take effect immediately without redeploying the site.

Steps to host on S3 (example):

1. Create an S3 bucket (public-read) or configure a CloudFront distribution in front of it.
2. Upload these files to the bucket root (or a folder):
   - `notices.json` (permanent notices)
   - `notices_temp.json` (temporary/urgent notices)
3. Make each file publicly readable (or use signed URLs).
4. Update `public/images/config.json` (or your config on the server) to point to the S3 URLs. Example:

{
  "allowPermanent": true,
  "allowTemporary": true,
  "noticesUrl": "https://your-bucket.s3.amazonaws.com/notices.json",
  "noticesTempUrl": "https://your-bucket.s3.amazonaws.com/notices_temp.json"
}

5. The client polls the configured URLs every 60s. When you replace the files in S3, the page will pick up the changes automatically (within the polling interval).

Quick CLI example (AWS CLI):

```bash
aws s3 cp notices.json s3://your-bucket/notices.json --acl public-read
aws s3 cp notices_temp.json s3://your-bucket/notices_temp.json --acl public-read
```

Notes:
- If you prefer immediate push updates, consider adding a small admin page that uploads new JSON to S3 via signed requests.
- For restricted upload, use presigned PUT URLs or an authenticated admin service.
