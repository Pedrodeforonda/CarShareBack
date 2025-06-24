#!/bin/bash

# Script simple para levantar CarShare Backend completo en AWS
echo "🚀 Levantando CarShare Backend completo en AWS"
echo "=============================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json"
    echo "Asegúrate de estar en el directorio del proyecto CarShareBack"
    exit 1
fi

echo "📁 Directorio actual: $(pwd)"

# 1. Detener servicios existentes si los hay
echo "🛑 Deteniendo servicios existentes..."
docker-compose down 2>/dev/null || true

# 2. Construir e iniciar todos los servicios
echo "🐳 Construyendo e iniciando todos los servicios..."
docker-compose up --build -d

# 3. Esperar a que todos los servicios estén listos
echo "⏳ Esperando que los servicios estén listos..."
sleep 20

# 4. Verificar que todos los servicios están funcionando
echo "✅ Verificando servicios..."
docker-compose ps

echo ""
echo "🎉 ¡Backend desplegado completamente!"
echo "📊 URLs disponibles:"
echo "   - Backend: http://98.84.196.99:3001"
echo "   - MongoDB Express: http://98.84.196.99:8081"
echo ""
echo "📝 Para gestionar:"
echo "   - Ver logs: docker-compose logs -f"
echo "   - Detener: docker-compose down"
echo "   - Reiniciar: docker-compose restart"
echo ""
