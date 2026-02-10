# Utilise l'image Node.js officielle version Alpine (légère)
FROM node:18-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
# Cela permet de profiter du cache Docker pour les dépendances
COPY package*.json ./

# Installe les dépendances de production uniquement
RUN npm install --production

# Copie le reste du code de l'application
COPY . .

# Expose le port sur lequel l'application écoute
EXPOSE 3000

# Définit la commande pour démarrer l'application
CMD ["npm", "start"]

# Pour un environnement de production, vous pourriez utiliser :
# CMD ["node", "app.js"]
