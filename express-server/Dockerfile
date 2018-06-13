# Aplicacion basada en Node.js Version 8.11.1
FROM node:8.11.1
# Actualiza paquetes (seguridad)
RUN apt-get update && apt-get install -y \
    curl \
    gcc-4.9 \
    libxml2 \ 
    sensible-utils
# Setea el directorio de trabajo a /app
WORKDIR /app
# Copiar el compilado del proyecto a /app
ADD ./ /app
# Instala los modulos de npm
RUN (cd /app && npm install)
# Expone el puerto 8080 para acceder a la aplicacion
EXPOSE 3001
# Variables de entorno
ENV SERVER_PORT=3001
ENV DB_HOST=45.55.55.181
ENV DB_PORT=28015
ENV DB_NAME=ormigga
# Ejecutar el comando node app.js
CMD npm start