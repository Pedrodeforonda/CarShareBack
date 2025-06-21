#!/bin/bash

# Guía de instalación simple para AWS EC2 (Desarrollo)

echo "🚀 Configuración simple del backend CarShare en AWS"
echo "==================================================="

# 1. Actualizar el sistema
echo "📦 Actualizando el sistema..."
sudo apt update && sudo apt upgrade -y
# Para Amazon Linux usar: sudo yum update -y

# 2. Instalar Node.js (versión 18 LTS)
echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
# Para Amazon Linux:
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# source ~/.bashrc
# nvm install 18
# nvm use 18

# 3. Verificar instalación
echo "✅ Verificando instalaciones..."
node --version
npm --version

# 4. Instalar Docker (para MongoDB)
echo "🐳 Instalando Docker..."
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
# Para Amazon Linux:
# sudo yum install -y docker
# sudo service docker start
# sudo chkconfig docker on

# 5. Instalar Docker Compose
echo "🐳 Instalando Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 6. Instalar Git (si no está instalado)
echo "📦 Instalando Git..."
sudo apt-get install -y git
# Para Amazon Linux: sudo yum install -y git

echo "✅ ¡Instalación completada!"
echo "💡 Reinicia la sesión para aplicar los cambios de Docker"
echo "📝 Después ejecuta: ./deploy-aws.sh"
