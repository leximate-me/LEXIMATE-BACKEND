FROM node:22-alpine

WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el código fuente
COPY . .

# Instala dependencias de desarrollo (necesario para nodemon)
RUN npm install --save-dev

# Expone el puerto
EXPOSE 8080

# Comando para desarrollo con nodemon y watch
CMD ["npm", "run", "start:dev"]