#!/bin/bash

#
# File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/deploy-whatsapp.sh
# Description: Deploy WhatsApp notification service to Verpex VPS
# Author: Libor Ballaty <libor@arionetworks.com>
# Created: 2025-11-16
#
# Usage: ./scripts/deploy-whatsapp.sh
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REMOTE_HOST="verpex"  # Must match your SSH config
REMOTE_DIR="~/permahub-services/whatsapp-service"
LOCAL_DIR="./server/whatsapp-service"

echo -e "${BLUE}🚀 Deploying WhatsApp Notification Service to Verpex VPS...${NC}\n"

# Step 0: Verify local directory exists
if [ ! -d "$LOCAL_DIR" ]; then
  echo -e "${RED}❌ Error: Local directory not found: $LOCAL_DIR${NC}"
  echo -e "${YELLOW}💡 Create it first or check if you're in the Permahub root directory${NC}"
  exit 1
fi

# Step 1: Test SSH connection
echo -e "${BLUE}🔐 Testing SSH connection...${NC}"
if ! ssh -o BatchMode=yes -o ConnectTimeout=5 "$REMOTE_HOST" echo "Connected" &>/dev/null; then
  echo -e "${RED}❌ Error: Cannot connect to $REMOTE_HOST${NC}"
  echo -e "${YELLOW}💡 Check your SSH configuration in ~/.ssh/config${NC}"
  echo -e "${YELLOW}   Or run: ssh $REMOTE_HOST${NC}"
  exit 1
fi
echo -e "${GREEN}✅ SSH connection successful${NC}\n"

# Step 2: Create remote directory if it doesn't exist
echo -e "${BLUE}📁 Creating remote directory structure...${NC}"
ssh "$REMOTE_HOST" << 'EOF'
  mkdir -p ~/permahub-services/whatsapp-service/logs
  echo "✅ Directory created"
EOF

# Step 3: Sync files
echo -e "\n${BLUE}📦 Syncing files to VPS...${NC}"
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.env' \
  --exclude '.git' \
  --exclude '*.log' \
  --exclude 'logs/*' \
  "$LOCAL_DIR/" \
  "$REMOTE_HOST:$REMOTE_DIR/"

if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}✅ Files synced successfully${NC}\n"
else
  echo -e "\n${RED}❌ Error syncing files${NC}"
  exit 1
fi

# Step 4: Install dependencies on remote
echo -e "${BLUE}📥 Installing dependencies on VPS...${NC}"
ssh "$REMOTE_HOST" << 'EOF'
  cd ~/permahub-services/whatsapp-service

  # Check if package.json exists
  if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
  fi

  # Install dependencies
  echo "Installing npm packages..."
  npm install --production

  if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
  else
    echo "❌ Failed to install dependencies"
    exit 1
  fi
EOF

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Dependencies installed successfully${NC}\n"
else
  echo -e "${RED}❌ Error installing dependencies${NC}"
  exit 1
fi

# Step 5: Check if .env exists (warn if not)
echo -e "${BLUE}🔍 Checking for .env file on VPS...${NC}"
ssh "$REMOTE_HOST" << 'EOF'
  if [ -f ~/permahub-services/whatsapp-service/.env ]; then
    echo "✅ .env file found"
  else
    echo "⚠️  WARNING: .env file not found!"
    echo "   Create it manually on VPS: ssh verpex 'nano ~/permahub-services/whatsapp-service/.env'"
    echo "   Required variables:"
    echo "     - SUPABASE_URL"
    echo "     - SUPABASE_SERVICE_ROLE_KEY"
    echo "     - WAHA_ENDPOINT"
    echo "     - WAHA_SESSION"
  fi
EOF

# Step 6: Restart service with PM2
echo -e "\n${BLUE}🔄 Managing service with PM2...${NC}"
ssh "$REMOTE_HOST" << 'EOF'
  cd ~/permahub-services/whatsapp-service

  # Check if PM2 is installed
  if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 not found. Installing globally..."
    npm install -g pm2
  fi

  # Check if service is already running
  if pm2 describe whatsapp-service &>/dev/null; then
    echo "🔄 Service exists, restarting..."
    pm2 restart whatsapp-service
  else
    echo "▶️  Starting new service..."
    pm2 start index.js --name whatsapp-service
    pm2 save
  fi

  # Auto-start on reboot (only needs to run once, but safe to run multiple times)
  pm2 startup | grep -v "PM2" | bash || true
  pm2 save
EOF

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Service managed successfully${NC}\n"
else
  echo -e "${RED}❌ Error managing service${NC}"
  exit 1
fi

# Step 7: Check service status
echo -e "${BLUE}📊 Checking service status...${NC}"
ssh "$REMOTE_HOST" << 'EOF'
  pm2 status whatsapp-service
EOF

echo -e "\n${GREEN}✅ Deployment complete!${NC}\n"
echo -e "${BLUE}📝 Useful commands:${NC}"
echo -e "  View logs:    ${YELLOW}ssh $REMOTE_HOST 'pm2 logs whatsapp-service'${NC}"
echo -e "  Stop service: ${YELLOW}ssh $REMOTE_HOST 'pm2 stop whatsapp-service'${NC}"
echo -e "  Start service:${YELLOW}ssh $REMOTE_HOST 'pm2 start whatsapp-service'${NC}"
echo -e "  Monitor:      ${YELLOW}ssh $REMOTE_HOST 'pm2 monit'${NC}"
echo -e ""
