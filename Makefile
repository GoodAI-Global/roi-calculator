.PHONY: setup dev build test lint typecheck clean help

# Default target
.DEFAULT_GOAL := help

# Variables
NODE_BIN := ./node_modules/.bin

## setup: Install dependencies
setup:
	npm install

## dev: Start development server
dev:
	npm run dev

## build: Create production build
build:
	npm run build

## test: Run tests
test:
	npm test

## test-watch: Run tests in watch mode
test-watch:
	npm run test:watch

## test-coverage: Run tests with coverage
test-coverage:
	npm run test:coverage

## lint: Run ESLint
lint:
	npm run lint

## typecheck: Run TypeScript type checking
typecheck:
	npm run typecheck

## format: Format code with Prettier
format:
	npm run format

## clean: Remove build artifacts and dependencies
clean:
	rm -rf dist
	rm -rf node_modules
	rm -rf coverage

## ci: Run all CI checks (lint, typecheck, test, build)
ci: lint typecheck test build

## help: Show this help message
help:
	@echo "Available targets:"
	@echo ""
	@grep -E '^## ' $(MAKEFILE_LIST) | sed 's/## /  /'
