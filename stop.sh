#!/bin/bash

# Script para detener CarShare Backend completo

echo "🛑 Deteniendo CarShare Backend completo..."

# Detener todos los servicios
docker-compose down

echo "✅ Todos los servicios detenidos"
echo ""
echo "📝 Comandos adicionales:"
echo "   - Para eliminar también los volúmenes: docker-compose down -v"
echo "   - Para volver a iniciar: ./start.sh"
echo "   - Para ver logs: docker-compose logs"
echo ""
