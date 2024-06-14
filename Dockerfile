FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Install necessary dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    hicolor-icon-theme \
    libcanberra-gtk* \
    libgl1-mesa-dri \
    libgl1-mesa-glx \
    libpango1.0-0 \
    fonts-symbola \
    --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN npm install puppeteer

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
