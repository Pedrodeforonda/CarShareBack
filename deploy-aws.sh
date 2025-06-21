#!/bin/bash

echo "📁 Directorio # 3. Levantar MongoDB con Docker
echo "🐳 Iniciando MongoDB..."
docker-compose up -d

# 4. Esperar a que MongoDB esté listo
echo "⏳ Esperando que MongoDB esté listo..."
sleep 10

# 5. Verificar que MongoDB está funcionando
echo "✅ Verificando MongoDB..."
docker-compose ps

# 6. Iniciar la aplicación en modo desarrollo
echo "🚀 Iniciando aplicación en modo desarrollo..."
npm run dev &

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 2. Verificar que existe docker-compose.yml
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: No se encontró docker-compose.yml"
    exit 1
fi

# 3. Levantar MongoDB con Docker
echo "🐳 Iniciando MongoDB..."
docker-compose up -dsimple para levantar CarShare Backend en AWS
echo "🚀 Levantando CarShare Backend en AWS (Desarrollo)"
echo "================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json"
    echo "Asegúrate de estar en el directorio del proyecto CarShareBack"
    exit 1
fi

echo "� Directorio actual: $(pwd)"

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
