# Authentication & Security Implementation Guide

---

## 1. Authentication Architecture

### 1.1 Authentication Flow Overview

**User Registration:**
1. User enters email on registration form
2. System checks if user exists
3. If new, sends magic link to email (user can also set password)
4. User clicks magic link or enters password
5. Session created, user redirected to dashboard
6. User completes profile (name, skills, interests, location)

**User Login:**
1. User chooses: Magic Link OR Password
2. **Magic Link:** Enter email → Receives link → Clicks link → Authenticated
3. **Password:** Enter email + password → Authenticated
4. Session stored in browser localStorage or sessionStorage
5. Subsequent requests include auth token

**Password Reset:**
1. User clicks "Forgot Password" on login
2. Enters email
3. Receives reset link
4. Clicks link, sets new password
5. Redirected to login or auto-authenticated

**Session Management:**
- Access tokens stored in client (httpOnly cookies preferred)
- Refresh token for long-lived sessions
- Auto-logout after inactivity
- Manual logout clears tokens

---

## 2. Supabase Auth Configuration

### 2.1 Enable Authentication in Supabase

**Settings needed in Supabase Dashboard:**

1. **Authentication > Providers**
   - Enable "Email" provider
   - Settings:
     - ✓ Enable email confirmations (optional but recommended)
     - ✓ Double confirm change email
     - ✓ Enable passwordless sign-in (magic links)
     - Password requirements: Min 6 characters (adjust as needed)
     - SMTP configuration for custom emails (optional)

2. **Authentication > URL Configuration**
   - Site URL: `http://localhost:5173` (dev) or your domain (prod)
   - Redirect URLs:
     - `http://localhost:5173/auth/callback`
     - `http://localhost:5173/auth/reset-password`
     - Your production domain equivalents

3. **Authentication > Email Templates**
   - Customize confirmation, password reset, and magic link emails
   - Include your platform branding and links

### 2.2 Supabase Auth Tables (Automatic)

Supabase creates these automatically:

```sql
-- auth.users - Created automatically by Supabase
-- Fields include: id, email, encrypted_password, email_confirmed_at, 
-- created_at, updated_at, last_sign_in_at, raw_user_meta_data, etc.

-- Link your users table to auth:
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  country TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  looking_for TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_public_profile BOOLEAN DEFAULT true,
  website TEXT,
  social_media JSONB DEFAULT '{}',
  profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Row Level Security (RLS) Policies

### 3.1 Enable RLS on All Tables

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
```

### 3.2 Users Table Policies

```sql
-- Anyone can view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.users
  FOR SELECT
  USING (is_public_profile = true);

-- Users can view their own profile (private or public)
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Prevent deletion (optional)
CREATE POLICY "Users cannot delete profiles"
  ON public.users
  FOR DELETE
  USING (false);
```

### 3.3 Projects Table Policies

```sql
-- Everyone can view active projects
CREATE POLICY "Active projects are viewable by everyone"
  ON public.projects
  FOR SELECT
  USING (status = 'active');

-- Users can view their own projects (including planned/archived)
CREATE POLICY "Users can view their own projects"
  ON public.projects
  FOR SELECT
  USING (auth.uid() = created_by);

-- Users can create projects
CREATE POLICY "Authenticated users can create projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own projects
CREATE POLICY "Users can update their own projects"
  ON public.projects
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Users can delete their own projects
CREATE POLICY "Users can delete their own projects"
  ON public.projects
  FOR DELETE
  USING (auth.uid() = created_by);
```

### 3.4 Resources Table Policies

```sql
-- Everyone can view available resources
CREATE POLICY "Available resources are viewable by everyone"
  ON public.resources
  FOR SELECT
  USING (availability != 'archived');

-- Users can view their own resources
CREATE POLICY "Users can view their own resources"
  ON public.resources
  FOR SELECT
  USING (auth.uid() = created_by);

-- Users can create resources
CREATE POLICY "Authenticated users can create resources"
  ON public.resources
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own resources
CREATE POLICY "Users can update their own resources"
  ON public.resources
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Users can delete their own resources
CREATE POLICY "Users can delete their own resources"
  ON public.resources
  FOR DELETE
  USING (auth.uid() = created_by);
```

### 3.5 Project-User Connections Policies

```sql
-- Everyone can view project connections
CREATE POLICY "Project connections are viewable by everyone"
  ON public.project_user_connections
  FOR SELECT
  USING (true);

-- Only project creator or users can create connections
CREATE POLICY "Users can create project connections"
  ON public.project_user_connections
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT created_by FROM projects WHERE id = project_id
    ) OR auth.uid() = user_id
  );

-- Only project creator or the user can delete
CREATE POLICY "Users can delete own project connections"
  ON public.project_user_connections
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT created_by FROM projects WHERE id = project_id
    ) OR auth.uid() = user_id
  );
```

### 3.6 Favorites Table Policies

```sql
-- Users can only view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON public.favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own favorites
CREATE POLICY "Users can create their own favorites"
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON public.favorites
  FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 4. Password Security Best Practices

### 4.1 Requirements

- Minimum 6 characters (Supabase default)
- Recommend: 8+ characters
- Allow special characters, numbers, uppercase/lowercase
- No password expiration unless high-security context
- Rate limiting on login attempts (Supabase handles this)

### 4.2 Hash Storage

- **Supabase handles all hashing** (bcrypt with 10 rounds)
- Passwords never stored in plain text
- Never transmit passwords in URLs or logs
- Use HTTPS only (enforced in production)

### 4.3 Session Security

```javascript
// Best practices for client-side session handling:

// 1. Store in httpOnly cookie (if using custom backend)
// 2. OR use sessionStorage (cleared when browser closes)
// 3. Avoid localStorage for sensitive auth tokens (vulnerable to XSS)
// 4. Implement token refresh before expiry
// 5. Clear tokens on logout
// 6. Include CSRF tokens for state-changing operations
```

---

## 5. Magic Link Implementation

### 5.1 How Magic Links Work

```
1. User enters email
2. Supabase sends email with unique link:
   https://yourapp.com/auth/callback?token=xxx&type=magiclink
3. User clicks link
4. App validates token with Supabase
5. User authenticated, session created
6. Redirected to dashboard
```

### 5.2 Email Configuration

In Supabase, customize the magic link email template:

```
Subject: Your magic link for [App Name]

Click the link below to sign in:
{{ .ConfirmationURL }}

This link expires in 24 hours.

If you didn't request this, ignore this email.
```

---

## 6. Frontend Security Measures

### 6.1 XSS Prevention

```javascript
// ✓ DO: Use textContent for user-generated content
element.textContent = userInput;

// ✗ DON'T: Use innerHTML with user input
element.innerHTML = userInput; // Dangerous!

// ✓ DO: Use data attributes for sensitive info
const token = element.dataset.token; // Not visible in HTML

// ✓ DO: Sanitize and validate all inputs
```

### 6.2 CSRF Protection

```javascript
// Supabase handles CSRF tokens automatically
// For custom API calls, include:
const headers = {
  'Content-Type': 'application/json',
  'X-CSRF-Token': getCsrfToken() // From Supabase session
};
```

### 6.3 Content Security Policy (CSP)

Add to your HTML head:

```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
           script-src 'self' 'unsafe-inline'; 
           style-src 'self' 'unsafe-inline'; 
           img-src 'self' data: https:; 
           connect-src 'self' localhost:54321 https://supabase.com">
```

### 6.4 Token Expiry & Refresh

```javascript
// Implement auto-refresh before token expires
// Supabase tokens expire in 1 hour by default
// Refresh tokens expire in 7 days

// Check token expiry:
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  // Token expired, redirect to login
}

// Refresh session:
const { data, error } = await supabase.auth.refreshSession();
```

---

## 7. Backend Security (Node.js/Supabase Functions - Optional)

### 7.1 Secure Admin Operations

```javascript
// Use service role key ONLY on backend
// Never expose service role key to frontend

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Keep secret!
);

// Example: Reset password as admin
const { data, error } = await supabaseAdmin.auth.admin
  .updateUserById(userId, { password: newPassword });
```

### 7.2 Rate Limiting

- Implement rate limiting on auth endpoints
- Limit login attempts: 5 failed attempts → 15 min lockout
- Limit password reset requests: 3 per hour per email
- Supabase has built-in rate limiting (customizable)

---

## 8. Audit Logging

### 8.1 Log Important Events

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT, -- 'login', 'logout', 'password_changed', 'project_created', etc.
  resource_type TEXT, -- 'user', 'project', 'resource'
  resource_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Log login
INSERT INTO audit_logs (user_id, action, ip_address, user_agent) 
VALUES (auth.uid(), 'login', '192.168.1.1', request.headers['user-agent']);

-- Log password change
INSERT INTO audit_logs (user_id, action) 
VALUES (auth.uid(), 'password_changed');
```

---

## 9. Two-Factor Authentication (Optional Future Feature)

For enhanced security:

```javascript
// Supabase supports TOTP (Time-based One-Time Password)
// Can be added later if needed

const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp'
});

// User scans QR code with authenticator app
// Then confirms with generated code
```

---

## 10. Compliance & Privacy

### 10.1 GDPR Considerations

- ✓ Allow users to download their data
- ✓ Allow users to delete their account (cascade delete)
- ✓ Clear audit logs after 90 days
- ✓ Transparent privacy policy
- ✓ Get consent for data processing

### 10.2 Data Retention

```sql
-- Auto-delete audit logs older than 90 days
CREATE OR REPLACE FUNCTION delete_old_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule with cron job (via pg_cron extension if available)
```

### 10.3 Account Deletion

```javascript
// User requests account deletion
// Steps:
// 1. Verify identity (password or magic link)
// 2. Delete user from auth.users (cascades to public.users)
// 3. Anonymize their projects/resources (optional)
// 4. Log deletion for compliance
```

---

## 11. Security Checklist

- [ ] Enable RLS on all tables
- [ ] Configure RLS policies for each table
- [ ] Set up email provider in Supabase
- [ ] Configure redirect URLs
- [ ] Implement HTTPS everywhere (production)
- [ ] Set Content-Security-Policy headers
- [ ] Implement input validation (frontend & backend)
- [ ] Sanitize all user-generated content
- [ ] Implement rate limiting
- [ ] Add audit logging
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Regular security audits
- [ ] Dependency scanning (npm audit)
- [ ] Never commit .env files
- [ ] Use strong, unique environment variables
- [ ] Test password reset flow
- [ ] Test magic link flow
- [ ] Test account deletion cascade

---

## 12. Environment Variables (.env.local)

```
# Supabase
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Authentication
VITE_AUTH_REDIRECT_URL=http://localhost:5173/auth/callback
VITE_AUTH_RESET_PASSWORD_URL=http://localhost:5173/auth/reset-password

# Session
VITE_SESSION_TIMEOUT_MINUTES=60
VITE_SESSION_STORAGE_KEY=auth_session

# Security
VITE_ENABLE_AUDIT_LOGGING=true
VITE_LOGIN_ATTEMPT_LIMIT=5
VITE_LOGIN_ATTEMPT_LOCKOUT_MINUTES=15
```

---

## 13. Testing Credentials (Local Development Only)

```
Email: test@example.com
Password: TestPassword123

Email: demo@example.com
Password: DemoPassword456
```

Create these test users in Supabase Studio for local testing.

