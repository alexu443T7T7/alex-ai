#!/bin/bash
# VoxMentor AI - Quick Setup Script

set -e

echo "================================================"
echo "  VoxMentor AI - Installation & Setup"
echo "  Votre Professeur Vocal Intelligent"
echo "================================================"
echo ""

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required. Please install it first."
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Please install it first."
    exit 1
fi

# Check for Ollama
if ! command -v ollama &> /dev/null; then
    echo "⚠️  Ollama is not installed."
    echo "   Install it from: https://ollama.ai/download"
    echo "   Then run: ollama pull mistral"
    echo ""
    echo "   Continuing with Python/Node setup..."
else
    echo "✅ Ollama found"
    echo "📥 Pulling Mistral model..."
    ollama pull mistral
fi

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend
python3 -m venv venv 2>/dev/null || python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend
npm install
cd ..

echo ""
echo "================================================"
echo "  ✅ Setup complete!"
echo ""
echo "  To start the app:"
echo ""
echo "  1. Make sure Ollama is running:"
echo "     ollama serve"
echo ""
echo "  2. Start the backend (terminal 1):"
echo "     cd backend && source venv/bin/activate"
echo "     uvicorn app.main:app --reload --port 8000"
echo ""
echo "  3. Start the frontend (terminal 2):"
echo "     cd frontend && npm run dev"
echo ""
echo "  4. Open http://localhost:5173"
echo ""
echo "  Or use Docker:"
echo "     docker compose up --build"
echo "     Open http://localhost:8000"
echo "================================================"
