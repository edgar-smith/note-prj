#!/bin/bash
set -e

echo "🚀 Déploiement Note Manager..."

# Pull latest code
git pull origin main

# Build and restart containers
cd docker
docker compose pull db nginx
docker compose build app
docker compose up -d --remove-orphans

echo "✅ Déploiement terminé!"
echo "🌐 L'app est accessible sur http://$(hostname -I | awk '{print $1}')"
