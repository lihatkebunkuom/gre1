#!/bin/bash

# Configuration
WEB_NAME="gretal-web"
API_NAME="gretal-api"
PROXY_NAME="gretal-proxy"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Go to project root directory
cd "$(dirname "$0")/.." || exit 1

usage() {
    echo "Usage: $0 {start|stop|status|restart|pause|unpause|logs}"
    exit 1
}

if [ $# -lt 1 ]; then
    usage
fi

case "$1" in
    start)
        echo -e "${GREEN}Starting Backend (API)...${NC}"
        pm2 start "pnpm dev:api" --name "$API_NAME"
        
        echo -e "${GREEN}Starting Frontend (Web)...${NC}"
        pm2 start "pnpm dev:web" --name "$WEB_NAME"

        echo -e "${GREEN}Starting Proxy Server...${NC}"
        pm2 start "node scripts/proxy.js" --name "$PROXY_NAME"
        ;;
    stop)
        echo -e "${RED}Stopping Apps...${NC}"
        pm2 stop "$API_NAME" "$WEB_NAME" "$PROXY_NAME"
        pm2 delete "$API_NAME" "$WEB_NAME" "$PROXY_NAME"
        ;;
    restart)
        echo -e "${GREEN}Restarting Apps...${NC}"
        pm2 restart "$API_NAME" "$WEB_NAME" "$PROXY_NAME"
        ;;
    status)
        pm2 status
        ;;
    pause)
        echo -e "${RED}Pausing Apps...${NC}"
        pm2 stop "$API_NAME" "$WEB_NAME" "$PROXY_NAME"
        ;;
    unpause)
        echo -e "${GREEN}Resuming Apps...${NC}"
        # using restart to resume from stopped state in pm2
        pm2 restart "$API_NAME" "$WEB_NAME" "$PROXY_NAME"
        ;;
    logs)
        pm2 logs
        ;;
    *)
        usage
        ;;
esac
