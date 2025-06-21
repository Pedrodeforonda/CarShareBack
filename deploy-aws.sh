#!/bin/bash

# Script simple para levantar CarShare Backend en AWS
echo "🚀 Levantando CarShare Backend en AWS (Desarrollo)"
echo "================================================="

# Variables
PROJECT_DIR="/home/ubuntu/carshare-backend"
REPO_URL="git@github.com:Pedrodeforonda/CarShareBack.git"

# 1. Crear directorio del proyecto si no existe
echo "📁 Configurando directorio del proyecto..."
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR
cd $PROJECT_DIR

# 2. Clonar o actualizar el repositorio
if [ ! -d ".git" ]; then
    echo "📥 Clonando repositorio..."
    git clone $REPO_URL .
else
    echo "🔄 Actualizando repositorio..."
    git pull origin main
fi

# 3. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 4. Levantar MongoDB con Docker (versión simple)
echo "🐳 Iniciando MongoDB..."
docker-compose up -d

# 5. Esperar a que MongoDB esté listo
echo "⏳ Esperando que MongoDB esté listo..."
sleep 10

# 6. Verificar que MongoDB está funcionando
echo "✅ Verificando MongoDB..."
docker-compose ps

# 7. Iniciar la aplicación en modo desarrollo
echo "🚀 Iniciando aplicación en modo desarrollo..."
npm run dev &

echo ""
echo "✅ ¡Backend iniciado!"
echo "📊 URLs disponibles:"
echo "   - Backend: http://tu-ip-aws:3001"
echo "   - MongoDB Express: http://tu-ip-aws:8081"
echo ""
echo "📝 Para detener los servicios:"
echo "   - Detener backend: Ctrl+C o kill del proceso"
echo "   - Detener MongoDB: docker-compose down"
echo ""
echo "📝 Para ver logs:"
echo "   - Backend: Los verás en la terminal actual"
echo "   - MongoDB: docker-compose logs mongo"
echo ""
