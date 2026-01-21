# FloatChat - AI-Powered Ocean Data Discovery System



## 🌊 Features

### Core Capabilities
- **Natural Language Queries**: Ask questions like "Show me salinity profiles near the equator in March 2023"
- **AI-Powered Data Discovery**: RAG pipeline with LLM integration for semantic search
- **Interactive Visualizations**: Geospatial maps with Leaflet and scientific plots with Plotly.js
- **Multi-Modal Input**: Text, map interactions, and voice queries
- **Context-Aware Chat**: Remembers conversation history for refined queries

### Advanced Features
- **Explainable AI**: Shows retrieved documents, SQL queries, and visualization specs
- **Confidence Scoring**: AI responses include reliability indicators
- **Cross-Dataset Fusion**: Extensible to satellite, glider, and buoy data
- **Smart Alerts**: Proactive anomaly detection and notifications
- **Collaborative Tools**: Multi-user dashboards with shared queries
- **Educational Mode**: Learn oceanographic concepts while exploring data

## 🏗️ Architecture

```
FloatChat/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # REST API endpoints
│   │   ├── core/        # Configuration and utilities
│   │   ├── db/          # Database models and connections
│   │   ├── rag/         # RAG pipeline implementation
│   │   └── services/    # Business logic services
│   └── requirements.txt
├── frontend/            # Next.js frontend
│   ├── app/            # App router pages
│   ├── components/     # React components
│   ├── lib/           # Utilities and configurations
│   └── types/         # TypeScript type definitions
├── data-processing/    # ETL pipeline
├── docker-compose.yml # Container orchestration
└── scripts/           # Deployment and utility scripts
```

## 🚀 Quick Start
to use 

1. **Clone and setup**:
   ```bash
   git clone <repository>
   cd floatchat
   npm install
   ```

2. **Start development**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:8000/docs

## 🔧 Development

### Environment Setup
- Node.js 18+
- Python 3.9+
- PostgreSQL with PostGIS
- Vector database (Chroma/FAISS)

### Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code

## 📊 Sample Queries

- "Show me temperature profiles in the Arabian Sea for the last 6 months"
- "Compare BGC parameters between different ocean basins"
- "Find unusual salinity readings near major currents"
- "Export recent float data as NetCDF for station 2903334"

## 📊 Sample Queries

- "Show me temperature profiles in the Arabian Sea for the last 6 months"
- "Compare BGC parameters between different ocean basins"
- "Find unusual salinity readings near major currents"
- "Export recent float data as NetCDF for station 2903334"

## 🤝 Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.

## 📄 License

MIT License - see LICENSE file for details and so on
