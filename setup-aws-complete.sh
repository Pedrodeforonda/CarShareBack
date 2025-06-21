#!/bin/bash

# Script completo de instalación para AWS EC2

echo "🚀 Instalación completa de CarShare Backend en AWS"
echo "=================================================="

# 1. Actualizar el sistema
echo "📦 Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js 18 LTS
echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar Docker y Docker Compose
echo "🐳 Instalando Docker..."
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# 4. Instalar Git
echo "📦 Instalando Git..."
sudo apt-get install -y git

# 5. Verificar instalaciones
echo "✅ Verificando instalaciones..."
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Docker version: $(docker --version)"
echo "Docker Compose version: $(docker-compose --version)"
echo "Git version: $(git --version)"

echo ""
echo "✅ ¡Instalación completada!"
echo "💡 IMPORTANTE: Reinicia la sesión SSH para aplicar cambios de Docker"
echo "📝 Después ejecuta: git pull && ./deploy-aws-complete.sh"
echo "🌐 URLs finales: http://107.22.158.177:3001 y http://107.22.158.177:8081"
echo ""
