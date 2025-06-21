# Comandos útiles para CarShare Backend en AWS (Desarrollo)

## Iniciar/Detener servicios
```bash
# Iniciar todo (MongoDB + Backend)
./start.sh

# Detener todo
./stop.sh

# Solo MongoDB
docker-compose up -d     # Iniciar
docker-compose down      # Detener
```

## Logs y monitoreo
```bash
# Ver logs de MongoDB
docker-compose logs mongo

# Ver logs del backend (aparecen en la terminal donde corriste ./start.sh)
# O si lo corriste en background:
npm run dev

# Ver contenedores corriendo
docker ps

# Ver uso de recursos
htop
```

## Desarrollo
```bash
# Instalar nuevas dependencias
npm install paquete-nuevo

# Reiniciar el backend (Ctrl+C y luego):
npm run dev

# Ver estructura de la base de datos
# Ir a: http://tu-ip-aws:8081
```

## Sistema
```bash
# Ver puertos abiertos
netstat -tlnp

# Verificar espacio en disco
df -h

# Ver memoria disponible
free -h
```

## Git
```bash
# Actualizar código
git pull

# Ver cambios
git status

# Subir cambios
git add .
git commit -m "mensaje"
git push
```
