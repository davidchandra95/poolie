.PHONY: help run build test clean migrate-up migrate-down migrate-create ent-generate dev

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

run: ## Run the server
	go run cmd/server/main.go

build: ## Build the server binary
	go build -o bin/poolie-server cmd/server/main.go

test: ## Run tests
	go test -v ./...

clean: ## Clean build artifacts
	rm -rf bin/
	go clean

dev: ## Run in development mode with hot reload (requires air)
	air

ent-generate: ## Generate Ent code from schemas
	go run -mod=mod entgo.io/ent/cmd/ent generate ./ent/schema

migrate-up: ## Run database migrations
	goose -dir migrations postgres "$(DATABASE_URL)" up

migrate-down: ## Rollback last migration
	goose -dir migrations postgres "$(DATABASE_URL)" down

migrate-status: ## Check migration status
	goose -dir migrations postgres "$(DATABASE_URL)" status

migrate-create: ## Create a new migration (usage: make migrate-create NAME=migration_name)
	goose -dir migrations create $(NAME) sql

install-tools: ## Install development tools
	go install entgo.io/ent/cmd/ent@latest
	go install github.com/pressly/goose/v3/cmd/goose@latest

deps: ## Download dependencies
	go mod download

tidy: ## Tidy go.mod
	go mod tidy

fmt: ## Format code
	go fmt ./...

lint: ## Run linter (requires golangci-lint)
	golangci-lint run

.DEFAULT_GOAL := help
