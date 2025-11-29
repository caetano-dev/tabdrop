# Automatic Cleanup of Old Collections

This document explains how the automatic cleanup of old tab collections works in TabDrop.

## Overview

TabDrop uses Vercel Cron Jobs to automatically delete collections that are older than 2 months. This keeps your database clean without impacting user-facing performance.

## How It Works

1. **Scheduled Job**: Every day at midnight (UTC), Vercel triggers the cleanup endpoint
2. **API Route**: The `/api/cron/cleanup` route is called
3. **Cleanup Function**: Deletes all collections where `created_at` is older than 2 months
4. **Logging**: Results are logged to Vercel's function logs

## Files Involved

- **`vercel.json`**: Configures the cron schedule
- **`app/api/cron/cleanup/route.ts`**: API endpoint that performs the cleanup
- **`lib/supabaseClient.ts`**: Contains the `deleteOldCollections()` function

## Configuration

### Cron Schedule

The cleanup runs daily at midnight UTC. To change the schedule, edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"  // Cron expression
    }
  ]
}
```

**Common Cron Schedules:**
- `0 0 * * *` - Daily at midnight
- `0 2 * * *` - Daily at 2 AM
- `0 0 * * 0` - Weekly on Sunday at midnight
- `0 0 1 * *` - Monthly on the 1st at midnight

### Cleanup Age

By default, collections older than 2 months are deleted. To change this, edit the `deleteOldCollections()` call in `app/api/cron/cleanup/route.ts`:

```typescript
const deletedCount = await deleteOldCollections(3); // Change to 3 months
```

## Security

### CRON_SECRET (Recommended)

To prevent unauthorized access to your cleanup endpoint, add a `CRON_SECRET` environment variable:

1. **Generate a secret:**
   ```bash
   openssl rand -base64 32
   ```

2. **Add to Vercel:**
   - Go to your project settings in Vercel
   - Navigate to Environment Variables
   - Add: `CRON_SECRET` = `your-generated-secret`

3. **Add to local `.env.local` for testing:**
   ```
   CRON_SECRET=your-generated-secret
   ```

If `CRON_SECRET` is not set, the endpoint will still work but won't be protected. This is fine for development but **strongly recommended for production**.

## Testing

### Test Locally

You can test the cleanup endpoint locally:

```bash
# Without CRON_SECRET
curl http://localhost:3000/api/cron/cleanup

# With CRON_SECRET
curl -H "Authorization: Bearer your-secret-key" http://localhost:3000/api/cron/cleanup
```

### Test in Production

After deploying to Vercel, you can manually trigger the endpoint:

```bash
curl -H "Authorization: Bearer your-secret-key" https://your-domain.vercel.app/api/cron/cleanup
```

### View Logs

To see cleanup results:
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Deployments" → Click your deployment
4. Go to "Functions" tab
5. Find the `/api/cron/cleanup` function and view logs

## Deployment

Vercel Cron Jobs are automatically configured when you deploy if you have a `vercel.json` file with cron configuration.

**Important:** Cron jobs only work on **Production** deployments, not Preview deployments.

### Steps:
1. Commit your changes including `vercel.json`
2. Push to your main branch (or the branch connected to production)
3. Vercel will automatically detect and configure the cron job
4. Verify in Vercel Dashboard → Settings → Cron Jobs

## Monitoring

### Check if it's working

After the first scheduled run, check:

1. **Vercel Logs**: Look for the cleanup function execution
2. **Response**: Should show `{ success: true, deletedCount: X }`
3. **Supabase**: Verify old collections are being deleted

### Manual Monitoring Query

Run this in your Supabase SQL Editor to see how many collections would be deleted:

```sql
-- Count collections older than 2 months
SELECT COUNT(*) as old_collections
FROM collections
WHERE created_at < NOW() - INTERVAL '2 months';

-- See the oldest collections
SELECT slug, created_at, updated_at
FROM collections
ORDER BY created_at ASC
LIMIT 10;
```

## Troubleshooting

### Cron job not running

- **Ensure you're on a production deployment** (not preview)
- Check Vercel Dashboard → Settings → Cron Jobs to see if it's listed
- Verify `vercel.json` is in the root of your project
- Check that the `path` in `vercel.json` matches your API route

### Unauthorized errors

- Ensure `CRON_SECRET` is set correctly in Vercel Environment Variables
- Make sure there are no extra spaces or quotes around the secret
- Redeploy after adding the environment variable

### Nothing being deleted

- Run the monitoring query above to see if there are any old collections
- Check the function logs in Vercel to see what `deletedCount` was returned
- Verify your Supabase RLS policies allow DELETE operations

### Want to run cleanup more/less frequently?

Edit the `schedule` in `vercel.json`. Use [crontab.guru](https://crontab.guru/) to help create cron expressions.

## Alternative: Manual Cleanup

If you don't want to use Vercel Cron, you can manually run cleanup by calling the API endpoint periodically using:

- GitHub Actions
- External cron services (like cron-job.org)
- Manual API calls
- Or run the SQL directly in Supabase:
  ```sql
  DELETE FROM collections WHERE created_at < NOW() - INTERVAL '2 months';
  ```

## Cost

Vercel Cron Jobs are included in all Vercel plans (including Hobby/Free). Each execution counts as a serverless function invocation.