FROM n8nio/n8n:latest

# Switch to root to install packages
USER root

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm

# Copy custom node directory
COPY custom-nodes/venice-embeddings /custom-nodes/venice-embeddings

# Install TypeScript globally first
RUN npm install -g typescript

# Install dependencies and build
WORKDIR /custom-nodes/venice-embeddings
RUN npm install && npm run build

# Install the package globally
RUN npm install -g /custom-nodes/venice-embeddings

# Switch back to node user
USER node