#!/bin/bash

# Script para iniciar CarShare Backend completo con Docker

echo "🚀 Iniciando CarShare Backend completo..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json"
    echo "Asegúrate de estar en el directorio del proyecto"
    exit 1
fi

# Verificar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    echo "Inicia Docker y vuelve a intentar"
    exit 1
fi

# Construir e iniciar todos los servicios
echo "🐳 Construyendo e iniciando todos los servicios..."
docker-compose up --build -d

# Esperar un poco para que los servicios estén listos
echo "⏳ Esperando que los servicios estén listos..."
sleep 15

# Verificar que todos los servicios están corriendo
echo "✅ Verificando servicios..."
docker-compose ps

echo ""
echo "🎉 ¡CarShare Backend iniciado completamente!"
echo "📊 URLs disponibles:"
echo "   - Backend API: http://98.84.196.99:3001"
echo "   - MongoDB Express: http://98.84.196.99:8081"
echo ""
echo "� Comandos útiles:"
echo "   - Ver logs del backend: docker-compose logs backend"
echo "   - Ver logs de MongoDB: docker-compose logs mongo"
echo "   - Detener todo: ./stop.sh"
echo "   - Ver todos los logs: docker-compose logs -f"
echo ""
