#!/bin/bash

# Configuration
DOMAIN="gretal-app.paranjana.com"
PROXY_PORT=8007
PM2_NAME="ngrok-gretal"

# Colors for output
GREEN='\033[0-32m'
RED='\033[0-31m'
NC='\033[0m' # No Color

usage() {
    echo "Usage: $0 {start|stop|status|restart|pause|unpause|logs}"
    exit 1
}

if [ $# -lt 1 ]; then
    usage
fi

case "$1" in
    start)
        echo -e "${GREEN}Starting ngrok for $DOMAIN via Proxy...${NC}"
        pm2 start "ngrok http $PROXY_PORT --domain=$DOMAIN" --name "$PM2_NAME"
        ;;
    stop)
        echo -e "${RED}Stopping ngrok...${NC}"
        pm2 stop "$PM2_NAME"
        pm2 delete "$PM2_NAME"
        ;;
    restart)
        echo -e "${GREEN}Restarting ngrok...${NC}"
        pm2 restart "$PM2_NAME"
        ;;
    status)
        pm2 show "$PM2_NAME"
        ;;
    pause)
        echo -e "${RED}Pausing ngrok...${NC}"
        pm2 stop "$PM2_NAME"
        ;;
    unpause)
        echo -e "${GREEN}Resuming ngrok...${NC}"
        pm2 start "$PM2_NAME"
        ;;
    logs)
        pm2 logs "$PM2_NAME"
        ;;
    *)
        usage
        ;;
esac
