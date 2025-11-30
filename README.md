# TabDrop

**Share browser tabs instantly.** Drop links, sync in real-time, and launch them all at once.

TabDrop is a URL-based browser tab sharing application inspired by Dontpad.com. Simply navigate to any URL slug, drop your browser tabs, and share the collection with anyone. Perfect for research projects, team collaboration, reading lists, and daily workflows.

## Features

- **URL-Based Collections** - No sign-up required, just navigate to any slug
- **Drag & Drop** - Drop browser tabs directly onto the page
- **Mobile-Friendly** - Manual URL input for devices that don't support drag-and-drop
- **Real-Time Sync** - Changes sync instantly across all devices viewing the same collection
- **Bulk Launcher** - Open all saved tabs at once with a single click
- **Clean UI** - Modern design with dark mode support
- **Public & Collaborative** - Anyone with the URL can view, add, or remove links

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Backend/Database**: Supabase (PostgreSQL + Realtime)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL from `supabase-schema.sql` in the SQL Editor
4. Enable Realtime for the `collections` table (Database → Replication)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Secure the cleanup cron endpoint
CRON_SECRET=your-secret-key-here
 
# Optional: Change expiration months for collections (default is 12)
NEXT_PUBLIC_CLEANUP_MONTHS=12
```

Get these values from your Supabase dashboard (Settings → API). Generate `CRON_SECRET` with: `openssl rand -base64 32`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app in action!

## How It Works

1. **Create a Collection** - Navigate to `/your-collection-name`
2. **Drop Your Tabs** - Drag browser tabs onto the drop zone or paste URLs manually
3. **Share & Sync** - Share the URL with others; changes sync in real-time
4. **Launch All** - Click "Open All Tabs" to open every link at once

## Security Notes

**Important**: TabDrop is designed for public, collaborative use.

- Anyone with the collection URL can view, add, or delete links
- No authentication is required
- Links are stored in plain text
- **Do not** share sensitive or private URLs

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard (including `CRON_SECRET`)
4. Deploy!

**Note**: Vercel automatically configures the cleanup cron job from `vercel.json` on production deployments.

### Other Platforms

TabDrop can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Fly.io
- AWS Amplify

Make sure to configure environment variables for your Supabase connection.

## Automatic Cleanup

TabDrop automatically deletes collections older than an specified number of months using Vercel Cron Jobs (runs daily at midnight UTC). You can customize the age threshold in the Environment Variables.

**Configuration:**
- Schedule: Edit `schedule` in `vercel.json` (default: `0 0 * * *`)
- Age threshold: Edit `deleteOldCollections(2)` in `app/api/cron/cleanup/route.ts`
- Manual test: `curl http://localhost:3000/api/cron/cleanup`

## Use Cases

- **Research Projects** - Collect and organize research links
- **Team Collaboration** - Share resources with team members
- **Reading Lists** - Save articles to read later
- **Daily Workflows** - Quick access to frequently used tools
- **Event Planning** - Share relevant links with attendees
- **Learning Resources** - Curate educational content

## Troubleshooting

### Pop-ups are blocked
Allow pop-ups for your TabDrop domain in your browser settings.

### Real-time sync not working
- Verify Realtime is enabled in Supabase (Database → Replication)
- Check browser console for connection errors

### Links not saving
- Verify environment variables are correct
- Check that the database table was created with proper RLS policies
- Look for errors in the browser console and Network tab

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Acknowledgments

- Inspired by [Dontpad.com](https://dontpad.com)
- Built with [Next.js](https://nextjs.org)
- Powered by [Supabase](https://supabase.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons by [Lucide](https://lucide.dev)

---