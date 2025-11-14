# Mailpit Setup for Local Email Testing

This guide explains how to set up Mailpit for testing email functionality in the Permahub Wiki application, particularly for magic link authentication.

## What is Mailpit?

Mailpit is a lightweight email testing tool that acts as both an SMTP server and provides a web UI to view emails sent by your application. It's perfect for local development as it captures all emails without actually sending them.

## Setup Instructions

### 1. Start Mailpit

```bash
# Start Mailpit using Docker Compose
docker-compose up -d

# Verify it's running
docker ps | grep mailpit
```

### 2. Access Mailpit

- **Web UI**: http://localhost:8025
- **SMTP Server**: localhost:1025

### 3. Supabase Configuration

The `supabase/config.toml` has been updated with the following settings:

```toml
[auth.smtp]
host = "host.docker.internal"  # Points to host machine from Docker
port = 1025
user = ""
pass = ""
sender = "noreply@permahub.local"
```

### 4. Restart Supabase

After configuration changes:

```bash
# Stop Supabase
supabase stop

# Start Supabase
supabase start
```

## Testing Email Functionality

### Magic Link Authentication

1. Go to the wiki homepage
2. Click "Login" or "Sign Up"
3. Enter your email address
4. Click "Send Magic Link"
5. Open Mailpit UI at http://localhost:8025
6. You'll see the email with the magic link
7. Click the link to authenticate

### Newsletter Subscription

1. Subscribe to the newsletter on any wiki page
2. Check Mailpit for the confirmation email

## Features

- **No External Dependencies**: All emails stay local
- **Instant Delivery**: Emails appear immediately in Mailpit
- **Full Email Preview**: View HTML and plain text versions
- **API Access**: Retrieve emails programmatically for testing
- **Persistent Storage**: Emails are saved to disk

## Troubleshooting

### Mailpit Not Receiving Emails

1. Check if Mailpit is running:
   ```bash
   docker ps | grep mailpit
   ```

2. Check Supabase logs:
   ```bash
   supabase logs --auth
   ```

3. Verify SMTP settings in `supabase/config.toml`

### Connection Refused

If you get connection errors, try:
- Using `127.0.0.1` instead of `localhost`
- Using `172.17.0.1` (Docker bridge IP) on Linux
- Ensuring ports 1025 and 8025 are not in use

### Clearing Emails

To clear all captured emails:
```bash
# Stop and remove the container
docker-compose down

# Remove the volume
docker volume rm permahub_mailpit-data

# Start fresh
docker-compose up -d
```

## Production Considerations

**Important**: Mailpit is for development only. In production, configure real SMTP settings:
- SendGrid
- AWS SES
- Mailgun
- Or any other SMTP provider

## Additional Resources

- [Mailpit Documentation](https://github.com/axllent/mailpit)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Magic Link Authentication Guide](https://supabase.com/docs/guides/auth/auth-magic-link)