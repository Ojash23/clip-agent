FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
# install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*
EXPOSE 5000
CMD ["node","server.js"]
