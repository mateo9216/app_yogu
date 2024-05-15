# Usa una imagen base oficial de Node.js
FROM node

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el resto del código de la aplicación
COPY . .

RUN npm init -y 

# Instalar dependencias
RUN npm install express mysql2 dotenv

# Expone el puerto en el que la aplicación escuchará
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]
