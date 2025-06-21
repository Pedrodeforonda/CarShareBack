#!/bin/bash

# Script simple para iniciar CarShare Backend

echo "🚀 Iniciando CarShare Backend..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json"
    echo "Asegúrate de estar en el directorio del proyecto"
    exit 1
fi

# Iniciar MongoDB
echo "🐳 Iniciando MongoDB..."
docker-compose up -d

# Esperar un poco
echo "⏳ Esperando que MongoDB esté listo..."
sleep 5

# Verificar que MongoDB está corriendo
if docker-compose ps | grep -q "Up"; then
    echo "✅ MongoDB iniciado correctamente"
else
    echo "❌ Error iniciando MongoDB"
    exit 1
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Iniciar el backend
echo "🚀 Iniciando backend en modo desarrollo..."
echo "📊 URLs disponibles:"
echo "   - Backend: http://localhost:3001"
echo "   - MongoDB Express: http://localhost:8081"
echo ""
echo "🛑 Para detener: Ctrl+C y luego ejecuta ./stop.sh"
echo ""

npm run dev
