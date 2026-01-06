FROM node:20-bullseye

WORKDIR /app

# Prisma cần OpenSSL (glibc)
RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 4000
CMD ["npm", "run", "dev"]
