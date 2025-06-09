# My n8n Project with Venice Embeddings Integration

This project provides a custom n8n node integration for Venice Embeddings, packaged with Docker support for easy deployment.

## 📁 Directory Structure
```
my-n8n-project/
├── Dockerfile          # Docker configuration
├── package.json        # Main project dependencies
├── custom-nodes/
│   └── venice-embeddings/
│       ├── package.json
│       ├── nodes/        # Node implementation directory
│       └── credentials/  # Credential handlers
└── README.md           # This documentation
```

## 🐳 Docker Setup
1. Build the image:
   ```bash
   docker build -t my-n8n .
   ```

2. Run the container:
   ```bash
   docker run -d -p 5678:5678 --name my-n8n-container my-n8n
   ```

## 🧩 Venice Embeddings Node
The custom node implementation can be developed in the `custom-nodes/venice-embeddings` directory. The package includes base dependencies for n8n integration.

For development, use:
```bash
cd custom-nodes/venice-embeddings
npm run build