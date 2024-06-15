FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Install Playwright browsers
RUN npx playwright install

# Bundle app source
COPY . .

# Expose port and start application
EXPOSE 3000
CMD [ "node", "index.js" ]
