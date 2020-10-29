FROM node:14.15.0

# Creamos el directorio en la carpeta
RUN mkdir -p /usr/backend/
WORKDIR /usr/backend/

# Copiar los archivos json
COPY package*.json ./
COPY . ./

# Ejecutamos los comandos necesarios para instalar las dependencias
RUN npm install

#PUERTO
EXPOSE 8080

# Ejecucion de comandos cuando se crea el contenedor, este es por defecto
CMD [ "npm", "start" ]
