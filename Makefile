.PHONY: help dev build up down logs restart clean install-frontend install-backend

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dev: ## Start development environment
	docker-compose up

build: ## Build all containers
	docker-compose build

up: ## Start all services in detached mode
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## Show logs (use logs-backend or logs-frontend for specific service)
	docker-compose logs -f

logs-backend: ## Show backend logs
	docker-compose logs -f backend

logs-frontend: ## Show frontend logs
	docker-compose logs -f frontend

logs-db: ## Show database logs
	docker-compose logs -f db

restart: ## Restart all services
	docker-compose restart

restart-backend: ## Restart backend service
	docker-compose restart backend

restart-frontend: ## Restart frontend service
	docker-compose restart frontend

clean: ## Stop and remove all containers, networks, and volumes
	docker-compose down -v

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

install-backend: ## Install backend dependencies
	cd backend && pip install -r requirements.txt

db-backup: ## Backup database
	docker-compose exec db pg_dump -U postgres your_life_stats > backup_$$(date +%Y%m%d_%H%M%S).sql

db-restore: ## Restore database from backup (usage: make db-restore FILE=backup.sql)
	docker-compose exec -T db psql -U postgres your_life_stats < $(FILE)

health: ## Check service health
	@echo "Checking backend health..."
	@curl -s http://localhost:8000/health || echo "Backend not responding"
	@echo "\nChecking frontend health..."
	@curl -s http://localhost:3000 > /dev/null && echo "Frontend is running" || echo "Frontend not responding"

ps: ## Show running containers
	docker-compose ps

prod: ## Start production environment with nginx
	docker-compose --profile production up -d
