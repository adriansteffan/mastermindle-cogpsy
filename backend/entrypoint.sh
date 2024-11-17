#!/bin/sh

# Set ownership and permissions for the data directory
chown -R node:node /srv/backend/data
chmod -R 777 /srv/backend/data

# Execute the main command (PM2)
npx pm2-runtime ./dist/server.js