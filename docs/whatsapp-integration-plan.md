# WhatsApp Group Notification Integration Plan

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/whatsapp-integration-plan.md

**Description:** Complete plan for free WhatsApp group notifications when wiki content is added

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-16

---

## 🎯 Objective

Send automatic notifications to a WhatsApp group when new content is published in the Permahub wiki:
- ✅ New guides published
- ✅ New events added
- ✅ New locations/places added

**Requirements:**
- 100% Free solution
- Self-hosted on your Verpex VPS
- Real-time or near real-time notifications
- Easy to configure and maintain

---

## 🏗️ Architecture Overview

```
┌─────────────────────┐
│  Supabase Database  │
│                     │
│  - wiki_guides      │
│  - wiki_events      │
│  - wiki_locations   │
└──────────┬──────────┘
           │
           │ (INSERT/UPDATE triggers)
           │
           ▼
┌─────────────────────┐
│  Notification Queue │
│  (Database Table)   │
└──────────┬──────────┘
           │
           │ (Polled every 1-5 minutes)
           │
           ▼
┌─────────────────────┐
│   Node.js Service   │
│   (On Verpex VPS)   │
│                     │
│  - Checks queue     │
│  - Formats messages │
│  - Sends to WAHA    │
└──────────┬──────────┘
           │
           │ (HTTP API call)
           │
           ▼
┌─────────────────────┐
│   WAHA Container    │
│   (Docker on VPS)   │
│                     │
│  - WhatsApp Web.js  │
│  - HTTP API         │
└──────────┬──────────┘
           │
           │ (WhatsApp Protocol)
           │
           ▼
┌─────────────────────┐
│  WhatsApp Group     │
│  (Your Community)   │
└─────────────────────┘
```

---

## 📦 Components

### 1. **Database Layer (Supabase)**

#### Tables to Create:

**a) `whatsapp_group_settings`** - Configuration table
```sql
- group_id (TEXT): WhatsApp group ID (e.g., "1234567890-1234567890@g.us")
- group_name (TEXT): Human-readable name
- notify_new_guides (BOOLEAN): Enable guide notifications
- notify_new_events (BOOLEAN): Enable event notifications
- notify_new_locations (BOOLEAN): Enable location notifications
- waha_endpoint (TEXT): URL to WAHA API (e.g., "http://localhost:3000")
- is_active (BOOLEAN): Master on/off switch
```

**b) `whatsapp_notification_queue`** - Pending notifications
```sql
- content_type (TEXT): 'guide', 'event', or 'location'
- content_id (UUID): Reference to wiki_guides/events/locations
- content_title (TEXT): Cached title for quick access
- content_slug (TEXT): For building URL
- content_data (JSONB): Full record snapshot
- status (TEXT): 'pending', 'processing', 'completed', 'failed'
- attempts (INTEGER): Retry counter
- created_at (TIMESTAMP): When queued
```

**c) `whatsapp_notifications`** - History/logs
```sql
- content_type, content_id: What was sent
- group_id: Where it was sent
- message_text (TEXT): Actual message sent
- status (TEXT): 'sent', 'failed', 'skipped'
- error_message (TEXT): If failed, why
- sent_at (TIMESTAMP): When sent
```

#### Triggers to Create:

**Database triggers on:**
- `wiki_guides` → When `status` changes to 'published' (INSERT or UPDATE)
- `wiki_events` → When `status` changes to 'published' (INSERT or UPDATE)
- `wiki_locations` → When `status` changes to 'published' (INSERT or UPDATE)

**Trigger action:**
- Insert record into `whatsapp_notification_queue`
- Store content snapshot (title, slug, description, etc.)
- Set status to 'pending'

---

### 2. **WAHA (WhatsApp HTTP API)**

#### What is WAHA?
- Open-source WhatsApp API wrapper
- Uses WhatsApp Web protocol (whatsapp-web.js)
- Provides REST API for sending messages
- Runs in Docker container
- 100% free

#### Installation on Verpex VPS:

**Option A: Docker (Recommended)**
```bash
docker run -d \
  --name waha \
  -p 3000:3000 \
  -e WAHA_PRINT_QR=true \
  -v ~/.waha:/app/.sessions \
  --restart unless-stopped \
  devlikeapro/waha
```

**Option B: Docker Compose** (for easier management)
```yaml
version: '3'
services:
  waha:
    image: devlikeapro/waha
    container_name: waha
    ports:
      - "3000:3000"
    environment:
      - WAHA_PRINT_QR=true
    volumes:
      - ~/.waha:/app/.sessions
    restart: unless-stopped
```

#### First-time Setup:
1. Run WAHA container
2. Check logs for QR code: `docker logs waha`
3. Scan QR code with your WhatsApp mobile app (Link a Device)
4. WAHA connects to WhatsApp Web
5. Session saved in `~/.waha` directory (persists across restarts)

#### API Endpoints:
- `GET /api/sessions` - Check connection status
- `POST /api/sendText` - Send text message
- `GET /api/groups` - List all groups (to get group IDs)

---

### 3. **Node.js Notification Service**

#### Purpose:
- Polls Supabase for pending notifications
- Formats messages based on content type
- Calls WAHA API to send WhatsApp messages
- Updates queue status and logs results

#### Installation Location:
`/home/yourusername/permahub-whatsapp-service/`

#### File Structure:
```
permahub-whatsapp-service/
├── package.json
├── index.js              (Main service)
├── config.js             (Supabase credentials)
├── message-formatter.js  (Format messages)
├── .env                  (Environment variables)
└── logs/
    └── service.log
```

#### Key Dependencies:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "node-fetch": "^3.x",
    "dotenv": "^16.x"
  }
}
```

#### Service Logic:
1. **Every 1-5 minutes** (cron job):
   - Query Supabase for pending notifications
   - Fetch active WhatsApp group settings
   - For each pending item:
     - Format message based on content type
     - Send to WAHA API
     - Log result
     - Mark as completed/failed

2. **Message Formatting:**
   - **Guide**: `📚 New Guide: {title}\n{summary}\n🔗 {url}`
   - **Event**: `📅 New Event: {title}\n📍 {location}\n🗓️ {date}\n🔗 {url}`
   - **Location**: `📍 New Location: {name}\n{type}\n{address}\n🔗 {url}`

3. **Error Handling:**
   - Retry up to 3 times if WAHA API fails
   - Log errors to database
   - Continue processing other items

#### Running the Service:

**Option A: Cron Job** (Simplest)
```bash
# crontab -e
*/5 * * * * cd /home/yourusername/permahub-whatsapp-service && node index.js >> logs/service.log 2>&1
```

**Option B: PM2** (Recommended - process manager)
```bash
pm2 start index.js --name permahub-whatsapp
pm2 startup  # Auto-start on boot
pm2 save
```

**Option C: Systemd Service** (Most robust)
```ini
[Unit]
Description=Permahub WhatsApp Notification Service
After=network.target

[Service]
Type=simple
User=yourusername
WorkingDirectory=/home/yourusername/permahub-whatsapp-service
ExecStart=/usr/bin/node index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

---

### 4. **Admin Configuration UI**

#### Purpose:
Allow you to configure WhatsApp settings via web interface

#### Location:
`/src/wiki/wiki-whatsapp-admin.html`

#### Features:
- View current WhatsApp group configuration
- Enable/disable notifications by type (guides, events, locations)
- Test connection to WAHA
- View notification history/logs
- Manual retry failed notifications

#### Access Control:
- Only accessible to admin users
- Could add to existing wiki admin panel

---

## 🚀 Implementation Steps

### Phase 1: Database Setup (15 minutes)

**⚠️ IMPORTANT: All migrations are NON-DESTRUCTIVE**
- Uses `CREATE TABLE IF NOT EXISTS` (won't overwrite existing tables)
- Uses `CREATE OR REPLACE FUNCTION` (safe to re-run)
- Uses `DROP TRIGGER IF EXISTS` then `CREATE TRIGGER` (safe to re-run)
- NO `DROP TABLE`, `DELETE`, `TRUNCATE`, or destructive operations
- Safe to run multiple times without data loss

1. **Run database migration:**
   - Create `017_whatsapp_notifications.sql`
   - Execute in Supabase SQL Editor
   - Creates 3 NEW tables + triggers (doesn't modify existing data)

2. **Verify tables created:**
   ```sql
   SELECT * FROM whatsapp_group_settings;
   SELECT * FROM whatsapp_notification_queue;
   SELECT * FROM whatsapp_notifications;
   ```

---

### Phase 2: WAHA Setup (30 minutes)

**🐳 WHAT IS DOCKER?**
- Docker is like a "mini virtual machine" that runs applications in isolated containers
- Think of it as a portable app package that runs the same way on any server
- WAHA (WhatsApp HTTP API) is packaged as a Docker container for easy installation

**WHY DOCKER FOR WAHA?**
- ✅ One-command installation (no complex dependencies)
- ✅ WAHA pre-configured and ready to use
- ✅ Automatically restarts if server reboots
- ✅ Easy to update (just pull new image)
- ✅ Isolated from your other VPS applications

**SIMPLIFIED EXPLANATION:**
Instead of manually installing Node.js, WhatsApp Web libraries, and configuring everything, Docker downloads a pre-built "package" that contains everything WAHA needs and runs it in a safe, isolated environment.

---

**SETUP STEPS:**

1. **SSH into Verpex VPS:**
   ```bash
   ssh username@your-vps-ip
   ```

2. **Check if Docker is already installed:**
   ```bash
   docker --version
   ```

   **If not installed, install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```
   Then log out and back in for permissions to take effect.

3. **Run WAHA container** (one command does everything):
   ```bash
   docker run -d \
     --name waha \
     -p 3000:3000 \
     -e WAHA_PRINT_QR=true \
     -v ~/.waha:/app/.sessions \
     --restart unless-stopped \
     devlikeapro/waha
   ```

   **What this command does:**
   - `docker run` = Start a new container
   - `-d` = Run in background (daemon mode)
   - `--name waha` = Give it a friendly name "waha"
   - `-p 3000:3000` = Make it accessible on port 3000 (only on localhost)
   - `-e WAHA_PRINT_QR=true` = Show QR code in logs for setup
   - `-v ~/.waha:/app/.sessions` = Save WhatsApp session so it persists
   - `--restart unless-stopped` = Auto-start if server reboots
   - `devlikeapro/waha` = Download and run WAHA app

4. **Connect WhatsApp (First time only):**
   ```bash
   docker logs waha
   ```
   This shows the QR code. Open WhatsApp on your phone → Settings → Linked Devices → Link a Device → Scan the QR code.

   Wait for message: "Session authenticated!"

5. **Get your WhatsApp group ID:**
   ```bash
   curl http://localhost:3000/api/groups
   ```
   This lists all your WhatsApp groups. Find your target group and copy the "id" field (looks like: "1234567890-1234567890@g.us")

---

**ALTERNATIVE: If you don't want to use Docker**

You can run WAHA directly with Node.js, but it's more complex:
```bash
git clone https://github.com/devlikeapro/waha.git
cd waha
npm install
npm run start
```

Docker is **highly recommended** because it's much simpler and more reliable.

---

### Phase 3: Node.js Service Setup (20 minutes)

1. **Create service directory:**
   ```bash
   mkdir -p ~/permahub-whatsapp-service
   cd ~/permahub-whatsapp-service
   ```

2. **Create package.json and install dependencies:**
   ```bash
   npm init -y
   npm install @supabase/supabase-js node-fetch dotenv
   ```

3. **Create .env file:**
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   WAHA_ENDPOINT=http://localhost:3000
   WAHA_SESSION=default
   ```

4. **Copy service files:**
   - `index.js` - Main service logic
   - `config.js` - Configuration
   - `message-formatter.js` - Message templates

5. **Test manually:**
   ```bash
   node index.js
   # Should check queue and process any pending items
   ```

6. **Set up cron job:**
   ```bash
   crontab -e
   # Add: */5 * * * * cd ~/permahub-whatsapp-service && node index.js >> logs/service.log 2>&1
   ```

---

### Phase 4: Configuration (10 minutes)

1. **Insert WhatsApp group config in Supabase:**
   ```sql
   INSERT INTO whatsapp_group_settings (
     group_id,
     group_name,
     notify_new_guides,
     notify_new_events,
     notify_new_locations,
     waha_endpoint,
     is_active
   ) VALUES (
     '1234567890-1234567890@g.us',  -- Your actual group ID from WAHA
     'Permahub Community',
     true,
     true,
     true,
     'http://localhost:3000',
     true
   );
   ```

---

### Phase 5: Testing (15 minutes)

1. **Create test guide:**
   ```sql
   INSERT INTO wiki_guides (
     title,
     slug,
     summary,
     content,
     status,
     author_id
   ) VALUES (
     'Test Guide for WhatsApp',
     'test-whatsapp-notification',
     'This is a test to verify WhatsApp notifications work.',
     'Test content here.',
     'published',
     (SELECT id FROM auth.users LIMIT 1)
   );
   ```

2. **Check queue:**
   ```sql
   SELECT * FROM whatsapp_notification_queue WHERE status = 'pending';
   ```

3. **Run service manually:**
   ```bash
   cd ~/permahub-whatsapp-service
   node index.js
   ```

4. **Check WhatsApp group for message!**

5. **Verify logs:**
   ```sql
   SELECT * FROM whatsapp_notifications ORDER BY created_at DESC LIMIT 5;
   ```

---

## 💰 Cost Breakdown

| Component | Cost | Notes |
|-----------|------|-------|
| WAHA (Docker) | **FREE** | Open-source, self-hosted |
| Node.js Service | **FREE** | Runs on your VPS |
| Supabase Database | **FREE** | Within free tier limits |
| Verpex VPS | **$0 extra** | Already have account |
| WhatsApp Account | **FREE** | Your personal WhatsApp |
| **TOTAL** | **$0/month** | 100% Free! |

---

## 🔒 Security Considerations

1. **WAHA Access:**
   - WAHA runs on `localhost:3000` (not exposed to internet)
   - Only Node.js service can access it
   - Consider adding authentication if exposing publicly

2. **Database Credentials:**
   - Store in `.env` file (not committed to git)
   - Use Supabase service role key (has full database access)
   - Restrict file permissions: `chmod 600 .env`

3. **WhatsApp Session:**
   - Session stored in `~/.waha/` directory
   - Backup this directory regularly
   - If session lost, re-scan QR code

4. **Rate Limiting:**
   - WhatsApp may rate-limit if too many messages sent
   - Current design: Max ~300 notifications/day (very safe)
   - Monitor for "Message failed" errors

---

## 🛠️ Maintenance

### Daily:
- **Nothing!** System runs automatically

### Weekly:
- Check notification logs for errors
- Verify WAHA container is running: `docker ps | grep waha`

### Monthly:
- Review failed notifications
- Update WAHA Docker image: `docker pull devlikeapro/waha && docker restart waha`
- Backup `~/.waha` session directory

### If WhatsApp Session Expires:
```bash
docker logs waha  # Look for QR code
# Scan with WhatsApp app
```

---

## 📊 Monitoring & Debugging

### Check WAHA Status:
```bash
# Container running?
docker ps | grep waha

# View logs
docker logs waha --tail 50

# Test API
curl http://localhost:3000/api/sessions
```

### Check Notification Queue:
```sql
-- Pending notifications
SELECT * FROM whatsapp_notification_queue WHERE status = 'pending';

-- Failed notifications
SELECT * FROM whatsapp_notification_queue WHERE status = 'failed';

-- Recent sent notifications
SELECT * FROM whatsapp_notifications ORDER BY created_at DESC LIMIT 10;
```

### Check Cron Job:
```bash
# View cron jobs
crontab -l

# View cron execution log
tail -f ~/permahub-whatsapp-service/logs/service.log
```

---

## 🎨 Message Templates

### Guide Notification:
```
📚 *New Guide Published!*

*{title}*

{summary}

🔗 Read more: https://permahub.app/wiki/guides/{slug}
```

### Event Notification:
```
📅 *New Event Added!*

*{title}*
📍 {location_name}
🗓️ {event_date}
🕐 {start_time}

{description}

🔗 Details: https://permahub.app/wiki/events/{slug}
```

### Location Notification:
```
📍 *New Location Added!*

*{name}*
{location_type}

{address}

{description}

🔗 View on map: https://permahub.app/wiki/map/{slug}
```

---

## 🔄 Future Enhancements (Optional)

### Phase 2 Features:
1. **Rich Media:**
   - Send featured images with notifications
   - Requires WAHA media API support

2. **Multiple Groups:**
   - Support different groups for different content types
   - E.g., Events → Events Group, Guides → Learning Group

3. **User Preferences:**
   - Allow users to subscribe/unsubscribe
   - Per-user notification preferences

4. **Analytics:**
   - Track notification open rates
   - WhatsApp read receipts

5. **Admin UI:**
   - Web dashboard to manage settings
   - View notification history
   - Retry failed notifications

6. **Telegram/Discord Integration:**
   - Same architecture can support other platforms
   - Just add different API endpoints

---

## ⚠️ Limitations & Risks

### WhatsApp Web Limitations:
1. **Not officially supported by WhatsApp:**
   - WhatsApp may block accounts using unofficial clients
   - Risk is LOW for personal/small group use
   - Use a separate WhatsApp account (not your main one) if concerned

2. **Session can expire:**
   - If you log out on phone, WAHA disconnects
   - If phone is offline for 14+ days, session may expire
   - Solution: Keep phone connected to internet

3. **Rate limits:**
   - WhatsApp may limit message frequency
   - Current design sends max 1 message per new content item (very safe)

### Technical Dependencies:
1. **Verpex VPS must be running:**
   - If VPS is down, notifications don't send
   - Queued in database, will send when VPS restarts

2. **Docker container must stay running:**
   - Use `--restart unless-stopped` flag
   - Monitor with `docker ps`

---

## 📚 Resources

### WAHA Documentation:
- GitHub: https://github.com/devlikeapro/waha
- Docs: https://waha.devlike.pro/
- API Reference: https://waha.devlike.pro/docs/api/

### WhatsApp Web.js:
- GitHub: https://github.com/pedroslopez/whatsapp-web.js
- Docs: https://docs.wwebjs.dev/

### Alternative Solutions (if WAHA doesn't work):
1. **Evolution API:** https://github.com/EvolutionAPI/evolution-api
2. **Baileys:** https://github.com/WhiskeySockets/Baileys
3. **WPPConnect:** https://github.com/wppconnect-team/wppconnect

---

## ✅ Success Criteria

System is working correctly when:

1. ✅ WAHA container running and connected to WhatsApp
2. ✅ Database triggers inserting into queue when content published
3. ✅ Cron job running every 5 minutes
4. ✅ Node.js service processing queue successfully
5. ✅ WhatsApp messages appearing in group within 5 minutes of publishing
6. ✅ No errors in notification logs
7. ✅ Failed notifications retry automatically

---

## 🎯 Next Steps

**Ready to proceed?**

If you approve this plan, I will create:

1. ✅ **Database migration file** (`017_whatsapp_notifications.sql`)
2. ✅ **Node.js service files** (`index.js`, `config.js`, `message-formatter.js`)
3. ✅ **Docker Compose file** (for easy WAHA setup)
4. ✅ **Installation script** (automates setup)
5. ✅ **Admin UI page** (configure settings via web)
6. ✅ **Step-by-step setup guide** (detailed instructions)

**Estimated total setup time: 90 minutes**

Let me know if you want to proceed, or if you'd like any changes to this plan!

---

**Last Updated:** 2025-11-16
