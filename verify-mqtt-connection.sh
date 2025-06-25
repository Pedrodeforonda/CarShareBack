#!/bin/bash

# Script de verificación completa para MQTT y backend en AWS
# Ejecutar en la instancia AWS donde está corriendo el backend

echo "🔍 VERIFICACIÓN COMPLETA DEL SISTEMA CARSHARE"
echo "=============================================="
echo ""

# Obtener IP pública de la instancia
echo "📍 Obteniendo IP pública de la instancia..."
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
if [ $? -eq 0 ]; then
    echo "✅ IP pública: $PUBLIC_IP"
else
    echo "⚠️ No se pudo obtener IP pública. Usando localhost."
    PUBLIC_IP="localhost"
fi
echo ""

# 1. Verificar que el backend esté corriendo
echo "🚀 1. Verificando que el backend esté corriendo en puerto 3001..."
if netstat -tlnp | grep -q ":3001"; then
    echo "✅ Backend está corriendo en puerto 3001"
else
    echo "❌ Backend NO está corriendo en puerto 3001"
    echo "   Ejecuta: npm run dev o ./start.sh"
    exit 1
fi
echo ""

# 2. Verificar health check
echo "🏥 2. Verificando health check del backend..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/health)
if [ $? -eq 0 ]; then
    echo "✅ Health check exitoso:"
    echo "$HEALTH_RESPONSE" | jq '.' 2>/dev/null || echo "$HEALTH_RESPONSE"
    
    # Verificar específicamente el estado MQTT
    MQTT_CONNECTED=$(echo "$HEALTH_RESPONSE" | jq -r '.data.mqttConnected' 2>/dev/null)
    if [ "$MQTT_CONNECTED" = "true" ]; then
        echo "✅ MQTT está conectado según el backend"
    else
        echo "❌ MQTT NO está conectado según el backend"
    fi
else
    echo "❌ No se pudo conectar al health check"
fi
echo ""

# 3. Verificar sesión activa
echo "📊 3. Verificando sesión activa..."
ACTIVE_SESSION=$(curl -s http://localhost:3001/user/sessions/active)
if [ $? -eq 0 ]; then
    echo "✅ Consulta de sesión activa exitosa:"
    echo "$ACTIVE_SESSION" | jq '.' 2>/dev/null || echo "$ACTIVE_SESSION"
else
    echo "❌ No se pudo consultar sesión activa"
fi
echo ""

# 4. Verificar conectividad MQTT
echo "📡 4. Verificando conectividad MQTT al broker 98.84.196.99:1883..."

# Verificar si mosquitto-clients está instalado
if ! command -v mosquitto_pub &> /dev/null; then
    echo "⚠️ mosquitto-clients no está instalado. Instalando..."
    sudo apt update && sudo apt install -y mosquitto-clients
fi

# Probar conexión MQTT
echo "   Probando conexión MQTT..."
timeout 5 mosquitto_pub -h 98.84.196.99 -p 1883 -t 'test/connection' -m 'test from verification script'
if [ $? -eq 0 ]; then
    echo "✅ Conexión MQTT exitosa al broker"
else
    echo "❌ No se pudo conectar al broker MQTT"
fi
echo ""

# 5. Verificar logs del backend para mensajes MQTT
echo "📋 5. Verificando logs recientes del backend para mensajes MQTT..."
if [ -f "backend.log" ]; then
    echo "   Últimos mensajes MQTT en logs:"
    grep -i mqtt backend.log | tail -5
elif command -v pm2 &> /dev/null; then
    echo "   Últimos logs de PM2:"
    pm2 logs --lines 10 | grep -i mqtt || echo "   No hay logs MQTT recientes en PM2"
else
    echo "   ⚠️ No se encontraron logs específicos. El backend debería mostrar mensajes como:"
    echo "   '🔗 Connecting to MQTT broker: mqtt://98.84.196.99:1883'"
    echo "   '✅ MQTT client connected successfully'"
    echo "   '📡 Subscribed to topic: carshare/inel00/session/#'"
fi
echo ""

# 6. Probar envío de mensaje de prueba
echo "🧪 6. Enviando mensaje de prueba para verificar que el backend lo reciba..."
echo "   Enviando mensaje de inicio de sesión de prueba..."
mosquitto_pub -h 98.84.196.99 -p 1883 -t 'carshare/inel00/session/start' -m '507f1f77bcf86cd799439011'
echo "   ✅ Mensaje enviado. Verifica los logs del backend para confirmar recepción."
echo ""

echo "🎯 RESUMEN DE VERIFICACIONES:"
echo "=============================="
echo "• Backend corriendo: ✅"
echo "• Health check: Verificar arriba"
echo "• MQTT conectado: Verificar arriba"
echo "• Broker MQTT accesible: Verificar arriba"
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo "=================="
echo "1. Si MQTT no está conectado, revisar logs del backend"
echo "2. Si el frontend muestra 'sin conexión', verificar que consulte:"
echo "   http://$PUBLIC_IP:3001/health"
echo "3. Para ESP32, usar estos topics:"
echo "   - Inicio: carshare/inel00/session/start"
echo "   - Datos GPS: carshare/inel00/01/data/live"
echo "   - Fin: carshare/inel00/session/stop"
echo ""
echo "🌐 URLs para probar desde el frontend:"
echo "======================================"
echo "Health check: http://$PUBLIC_IP:3001/health"
echo "Sesión activa: http://$PUBLIC_IP:3001/user/sessions/active"
echo "Todas las sesiones: http://$PUBLIC_IP:3001/user/sessions"
