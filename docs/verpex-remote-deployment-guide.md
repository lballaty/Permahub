# Verpex VPS Remote Deployment Guide

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/verpex-remote-deployment-guide.md

**Description:** How to connect to Verpex VPS from local machine and deploy WhatsApp notification service

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-16

---

## 🎯 Objective

Set up secure SSH access to your Verpex VPS and create deployment workflows to:
- ✅ Connect from this local machine to Verpex VPS
- ✅ Deploy code and services remotely
- ✅ Manage services without manual file uploads
- ✅ Automate deployments with scripts

---

## 📋 Prerequisites

### On Your Local Machine (macOS):
- ✅ Terminal access
- ✅ SSH client (built into macOS)
- ✅ This Permahub repository

### On Verpex VPS:
- ✅ SSH access enabled
- ✅ Root or sudo access
- ✅ Node.js installed (or ability to install)
- ✅ Git installed (or ability to install)

---

## 🔑 Step 1: Get Your Verpex SSH Credentials

### Find Your SSH Connection Details:

**Option A: From Verpex cPanel**
1. Log into Verpex cPanel
2. Go to "Terminal" or "SSH Access"
3. Note down:
   - **Hostname/IP**: e.g., `123.456.789.0` or `yoursite.verpex.com`
   - **Port**: Usually `22` (or custom like `2222`)
   - **Username**: Your cPanel username (e.g., `username`)
   - **Password**: Your cPanel password (or SSH key if set up)

**Option B: From Verpex Welcome Email**
- Look for email from Verpex with subject "Account Information"
- Contains server details and credentials

---

## 🔐 Step 2: Set Up SSH Key Authentication (Recommended)

SSH keys are more secure and convenient than passwords.

### Generate SSH Key (if you don't have one):

```bash
# Check if you already have an SSH key
ls -la ~/.ssh/id_rsa.pub

# If not, generate one
ssh-keygen -t rsa -b 4096 -C "libor@arionetworks.com"

# Press Enter to accept default location
# Optionally set a passphrase (or leave blank)
```

### Copy Your Public Key to Verpex VPS:

**Option A: Using ssh-copy-id (easiest):**
```bash
ssh-copy-id -p PORT username@your-vps-ip

# Example:
ssh-copy-id -p 22 username@123.456.789.0
# Enter your password when prompted
```

**Option B: Manual copy (if ssh-copy-id doesn't work):**
```bash
# Display your public key
cat ~/.ssh/id_rsa.pub

# Copy the output (starts with "ssh-rsa ...")

# SSH into VPS with password
ssh username@your-vps-ip

# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your public key
echo "paste-your-public-key-here" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Exit
exit
```

**Option C: Via cPanel:**
1. cPanel → SSH Access → Manage SSH Keys
2. Click "Import Key"
3. Paste your public key (from `cat ~/.ssh/id_rsa.pub`)

---

## 🌐 Step 3: Test SSH Connection

```bash
# Test connection
ssh username@your-vps-ip

# If using custom port
ssh -p 2222 username@your-vps-ip

# If successful, you should see:
# Welcome to VPS!
# username@hostname:~$
```

### Troubleshooting Connection Issues:

**"Connection refused":**
```bash
# Check if SSH is running on the server
# Contact Verpex support to enable SSH access
```

**"Permission denied (publickey)":**
```bash
# Try with password authentication
ssh -o PubkeyAuthentication=no username@your-vps-ip
```

**"Host key verification failed":**
```bash
# Remove old host key
ssh-keygen -R your-vps-ip
# Then try connecting again
```

---

## 📝 Step 4: Create SSH Config for Easy Access

Create a config file to simplify SSH connections:

```bash
# Edit SSH config
nano ~/.ssh/config

# Add this configuration:
Host verpex
    HostName your-vps-ip
    Port 22
    User username
    IdentityFile ~/.ssh/id_rsa
    ServerAliveInterval 60
    ServerAliveCountMax 3

# Save: Ctrl+O, Enter, Ctrl+X
```

**Now you can connect simply with:**
```bash
ssh verpex
# Instead of: ssh -p 22 username@123.456.789.0
```

---

## 🚀 Step 5: Set Up Remote Deployment Directory

```bash
# Connect to VPS
ssh verpex

# Create directory for Permahub services
mkdir -p ~/permahub-services
cd ~/permahub-services

# Check Node.js version
node --version
# If not installed, install it (instructions below)

# Check Git
git --version
# If not installed, install it (instructions below)
```

### Install Node.js (if needed):

**Using Node Version Manager (nvm) - Recommended:**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install latest LTS Node.js
nvm install --lts

# Verify
node --version
npm --version
```

**Or via package manager (if you have sudo):**
```bash
# For Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# For CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs
```

### Install Git (if needed):

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install git

# CentOS/RHEL
sudo yum install git

# Verify
git --version
```

---

## 📦 Step 6: Deploy Files from Local to VPS

### Option A: Using SCP (Secure Copy)

**Copy entire directory:**
```bash
# From your local machine, in Permahub repo root:
scp -r ./server/whatsapp-service verpex:~/permahub-services/

# Explanation:
# -r = recursive (copy directory)
# ./server/whatsapp-service = local directory to copy
# verpex:~/permahub-services/ = remote destination
```

**Copy single file:**
```bash
scp ./config.env verpex:~/permahub-services/whatsapp-service/.env
```

### Option B: Using rsync (Smarter - only copies changes)

```bash
# Install rsync locally (macOS has it built-in)
# Sync directory to VPS
rsync -avz --progress ./server/whatsapp-service/ verpex:~/permahub-services/whatsapp-service/

# Explanation:
# -a = archive mode (preserves permissions, timestamps)
# -v = verbose (show files being copied)
# -z = compress during transfer
# --progress = show progress bar
```

**Exclude node_modules (if present locally):**
```bash
rsync -avz --progress --exclude 'node_modules' ./server/whatsapp-service/ verpex:~/permahub-services/whatsapp-service/
```

### Option C: Using Git (Best for version control)

**On VPS:**
```bash
ssh verpex

cd ~/permahub-services

# Clone repository
git clone https://github.com/yourusername/Permahub.git

# Or if private repo, use SSH URL
git clone git@github.com:yourusername/Permahub.git

# Navigate to service directory
cd Permahub/server/whatsapp-service

# Install dependencies
npm install
```

**Update code later:**
```bash
ssh verpex
cd ~/permahub-services/Permahub
git pull origin main
cd server/whatsapp-service
npm install  # Install any new dependencies
pm2 restart whatsapp-service  # Restart service
```

---

## 🛠️ Step 7: Deploy WhatsApp Service (Example)

Let's deploy the WhatsApp notification service as an example:

### From Local Machine:

```bash
# Navigate to Permahub repo
cd /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub

# Deploy using rsync
rsync -avz --progress --exclude 'node_modules' \
  ./server/whatsapp-service/ \
  verpex:~/permahub-services/whatsapp-service/

# Deploy environment variables separately (don't commit .env to git!)
scp ./server/whatsapp-service/.env verpex:~/permahub-services/whatsapp-service/
```

### On VPS (via SSH):

```bash
ssh verpex

cd ~/permahub-services/whatsapp-service

# Install dependencies
npm install

# Test run (foreground - for debugging)
node index.js

# If working, set up with PM2 (process manager)
npm install -g pm2

# Start service
pm2 start index.js --name whatsapp-service

# Auto-start on reboot
pm2 startup
pm2 save

# View logs
pm2 logs whatsapp-service

# Stop service
pm2 stop whatsapp-service

# Restart service
pm2 restart whatsapp-service
```

---

## 🔄 Step 8: Create Deployment Script (Automate Everything)

Create a script on your local machine to automate deployment:

**File: `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/deploy-whatsapp.sh`**

```bash
#!/bin/bash

# Deployment script for WhatsApp notification service
# Usage: ./scripts/deploy-whatsapp.sh

set -e  # Exit on error

echo "🚀 Deploying WhatsApp Notification Service to Verpex VPS..."

# Configuration
REMOTE_HOST="verpex"
REMOTE_DIR="~/permahub-services/whatsapp-service"
LOCAL_DIR="./server/whatsapp-service"

# Step 1: Sync files
echo "📦 Syncing files..."
rsync -avz --progress --exclude 'node_modules' --exclude '.env' \
  "$LOCAL_DIR/" \
  "$REMOTE_HOST:$REMOTE_DIR/"

# Step 2: Install dependencies on remote
echo "📥 Installing dependencies..."
ssh "$REMOTE_HOST" << 'EOF'
  cd ~/permahub-services/whatsapp-service
  npm install --production
EOF

# Step 3: Restart service
echo "🔄 Restarting service..."
ssh "$REMOTE_HOST" << 'EOF'
  pm2 restart whatsapp-service || pm2 start ~/permahub-services/whatsapp-service/index.js --name whatsapp-service
EOF

# Step 4: Check status
echo "✅ Checking service status..."
ssh "$REMOTE_HOST" << 'EOF'
  pm2 status whatsapp-service
EOF

echo "✅ Deployment complete!"
echo "📊 View logs with: ssh verpex 'pm2 logs whatsapp-service'"
```

**Make it executable:**
```bash
chmod +x scripts/deploy-whatsapp.sh
```

**Deploy with one command:**
```bash
./scripts/deploy-whatsapp.sh
```

---

## 🔐 Step 9: Secure Environment Variables

**Never commit `.env` files to Git!**

### Create `.env` on VPS:

**Option A: Create directly on VPS:**
```bash
ssh verpex

cd ~/permahub-services/whatsapp-service

nano .env

# Add content:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
WAHA_ENDPOINT=http://localhost:3000
WAHA_SESSION=default

# Save: Ctrl+O, Enter, Ctrl+X

# Secure permissions
chmod 600 .env
```

**Option B: Copy from local (one-time):**
```bash
# From local machine
scp ./server/whatsapp-service/.env.production verpex:~/permahub-services/whatsapp-service/.env

# Then secure it
ssh verpex 'chmod 600 ~/permahub-services/whatsapp-service/.env'
```

**Option C: Use environment variables in PM2:**
```bash
pm2 start index.js --name whatsapp-service \
  --env SUPABASE_URL=https://your-project.supabase.co \
  --env SUPABASE_SERVICE_ROLE_KEY=your-key
```

---

## 📊 Step 10: Monitor and Manage Services Remotely

### View Logs:
```bash
# From local machine
ssh verpex 'pm2 logs whatsapp-service --lines 50'

# Or connect and view
ssh verpex
pm2 logs whatsapp-service
```

### Check Status:
```bash
ssh verpex 'pm2 status'
```

### Restart Service:
```bash
ssh verpex 'pm2 restart whatsapp-service'
```

### View Real-time Monitoring:
```bash
ssh verpex
pm2 monit
```

---

## 🗂️ Recommended Directory Structure on VPS

```
/home/username/
├── permahub-services/           # All Permahub backend services
│   ├── whatsapp-service/        # WhatsApp notification service
│   │   ├── index.js
│   │   ├── config.js
│   │   ├── message-formatter.js
│   │   ├── package.json
│   │   ├── .env                 # Environment variables (secure)
│   │   └── logs/
│   │       └── service.log
│   ├── waha/                    # WAHA (WhatsApp API) - if not using Docker
│   │   └── ...
│   └── backups/                 # Backup scripts and data
└── .ssh/
    ├── authorized_keys          # Your SSH public key
    └── config
```

---

## 🔄 Workflow Summary

### One-Time Setup:
1. ✅ Set up SSH key authentication
2. ✅ Create SSH config for easy access
3. ✅ Install Node.js and Git on VPS
4. ✅ Create deployment directories

### Regular Deployment:
1. ✅ Make changes locally in `/Users/liborballaty/.../Permahub`
2. ✅ Test locally
3. ✅ Run deployment script: `./scripts/deploy-whatsapp.sh`
4. ✅ Verify on VPS: `ssh verpex 'pm2 logs whatsapp-service'`

### Monitoring:
1. ✅ Check status: `ssh verpex 'pm2 status'`
2. ✅ View logs: `ssh verpex 'pm2 logs whatsapp-service --lines 100'`
3. ✅ Restart if needed: `ssh verpex 'pm2 restart whatsapp-service'`

---

## 🛡️ Security Best Practices

### 1. SSH Key Permissions:
```bash
# On local machine
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 600 ~/.ssh/config
```

### 2. VPS Firewall:
```bash
# Only allow SSH, HTTP, HTTPS
ssh verpex

# Check firewall status
sudo ufw status

# If needed, configure:
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Disable Password Authentication (after SSH keys work):
```bash
ssh verpex

sudo nano /etc/ssh/sshd_config

# Change this line:
PasswordAuthentication no

# Restart SSH
sudo systemctl restart sshd
```

### 4. Regular Updates:
```bash
ssh verpex

# Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# Update Node.js packages
cd ~/permahub-services/whatsapp-service
npm update
```

---

## 📝 Deployment Checklist

Before deploying to production:

- [ ] SSH key authentication working
- [ ] SSH config created for easy access
- [ ] Node.js installed on VPS
- [ ] Git installed on VPS (if using Git deployment)
- [ ] PM2 installed globally on VPS
- [ ] Deployment script created and tested
- [ ] `.env` file created on VPS (not in Git)
- [ ] File permissions secured (`.env` = 600)
- [ ] Service starts successfully: `pm2 start index.js`
- [ ] Service auto-starts on reboot: `pm2 startup && pm2 save`
- [ ] Logs accessible: `pm2 logs whatsapp-service`
- [ ] Firewall configured (if applicable)

---

## 🆘 Troubleshooting

### Can't connect via SSH:
```bash
# Verbose output to see errors
ssh -v verpex

# Try with password (if key fails)
ssh -o PubkeyAuthentication=no username@your-vps-ip
```

### Permission denied on VPS:
```bash
# Check file ownership
ssh verpex 'ls -la ~/permahub-services/whatsapp-service'

# Fix ownership
ssh verpex 'chown -R username:username ~/permahub-services'
```

### PM2 command not found:
```bash
# Install PM2 globally
ssh verpex 'npm install -g pm2'

# Or use npx
ssh verpex 'npx pm2 status'
```

### Service won't start:
```bash
# Check logs
ssh verpex 'pm2 logs whatsapp-service --err --lines 100'

# Try running manually to see errors
ssh verpex
cd ~/permahub-services/whatsapp-service
node index.js
```

---

## 📚 Additional Resources

### SSH Documentation:
- OpenSSH Manual: https://www.openssh.com/manual.html
- SSH Key Setup: https://www.ssh.com/academy/ssh/keygen

### PM2 Documentation:
- PM2 Quick Start: https://pm2.keymetrics.io/docs/usage/quick-start/
- PM2 Process Management: https://pm2.keymetrics.io/docs/usage/process-management/

### Rsync Documentation:
- Rsync Tutorial: https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories

---

## 🎯 Next Steps

Once SSH access is configured:

1. ✅ Test connection: `ssh verpex`
2. ✅ Create deployment script
3. ✅ Deploy WAHA (WhatsApp API)
4. ✅ Deploy WhatsApp notification service
5. ✅ Set up monitoring

---

**Last Updated:** 2025-11-16

**Status:** Ready for implementation
