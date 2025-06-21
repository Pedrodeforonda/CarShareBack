# Dockerfile para el backend
FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer el puerto
EXPOSE 3001

# Comando para desarrollo (con hot reload)
CMD ["npm", "run", "dev"]
