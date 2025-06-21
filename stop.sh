#!/bin/bash

# Script simple para detener CarShare Backend

echo "🛑 Deteniendo CarShare Backend..."

# Detener MongoDB
echo "🐳 Deteniendo MongoDB..."
docker-compose down

echo "✅ Servicios detenidos"
echo "📝 Para volver a iniciar: ./start.sh"
