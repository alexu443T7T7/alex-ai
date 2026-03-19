.PHONY: help install dev backend frontend build docker setup

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## First-time setup: install deps + pull Mistral model
	@echo "📦 Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "🤖 Pulling Mistral model (this may take a while)..."
	ollama pull mistral
	@echo "✅ Setup complete!"

install: ## Install all dependencies
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

backend: ## Start backend server
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

frontend: ## Start frontend dev server
	cd frontend && npm run dev

dev: ## Start both backend and frontend (requires 2 terminals)
	@echo "Run in separate terminals:"
	@echo "  make backend"
	@echo "  make frontend"

build: ## Build frontend for production
	cd frontend && npm run build

docker: ## Build and run with Docker Compose
	docker compose up --build -d
	@echo "⏳ Waiting for Ollama to start..."
	@sleep 5
	docker exec voxmentor-ollama ollama pull mistral
	@echo "✅ VoxMentor AI is running at http://localhost:8000"

docker-stop: ## Stop Docker containers
	docker compose down
