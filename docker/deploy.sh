#!/bin/bash
set -e  # Exit immediately if a command fails
set -x  # Print each command before executing it

DEPLOY_DIR="$HOME/GitHub/doxa_plc_main_website"

echo "📂 Changing directory to $DEPLOY_DIR"
cd "$DEPLOY_DIR" || { echo "❌ Failed to change directory"; exit 1; }

echo "🛠️ Copy all the ENV variables into the command line"
export $(grep -v '^#' .env | xargs)

echo "📡 pull image as GHCR package 'latest'"
docker pull ghcr.io/doxa-innovations/doxa_web:latest

echo "🐳 Updating Docker services with a rolling update..."
docker stack deploy -c docker-compose.yml doxa_stack --with-registry-auth || { echo "❌ Rolling update failed"; exit 1; }
docker service update --force --image ghcr.io/doxa-innovations/doxa_web:latest doxa_stack_nextjs || { echo "❌ Rolling update failed"; exit 1; }

echo "🐳 Clean up unused Docker system files to save space..."
docker system prune -f

echo "✅ Deployment completed successfully!"
