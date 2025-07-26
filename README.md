[![CI](https://github.com/zevikn/minute-tests/actions/workflows/ci.yml/badge.svg)](https://github.com/zevikn/minute-tests/actions/workflows/ci.yml)

GitHub Dashboard - https://zevikn.github.io/minute-tests/

** Please notice the 'Open Issues(Bugs found)' section below

# Minute Media Video Player Test Suite

This project is an automation test suite for a custom video player using Playwright and Docker.

## Project Structure
```
├── client/                 Static frontend with video player
├── server/                 Express.js backend to receive events
├── tests/                  Playwright tests
├── utils/                  Reusable test helpers
├── Dockerfile              Builds and runs backend server
├── docker-compose.yml      Launches frontend/backend
├── playwright.config.ts    Playwright test runner config
├── .github/
│   └── workflows/
│       └── ci.yml          CI pipeline
├── README.md               This file
└── docs/
    └── test-plan.md        Test strategy & coverage
```

## Running Locally
	* Install dependencies: `npm install`
	* Start server and client with Docker in another terminal: `docker-compose up`
	* Run tests: `npx playwright test`
	* View test report: `npx playwright show-report`	

## Running Tests in CI
	* Tests run automatically on push using GitHub Actions.
	* Results are stored as:
	  * playwright-report/ (HTML)
		
## Test Coverage
	* Video playback (play, pause, seek, scroll)
	* Event data validation
	* Handling of bad/missing POST requests
	* Validate No console errors

## CI/CD
	* GitHub Actions pipeline:
	  * Builds app
	  * Starts backend
	  * Runs tests
	  * Exports results in HTML
	  
## Tech Stack
	* Playwright
	* Node.js (Express)
	* Docker
	* GitHub Actions

## Features
	* Automates user interactions with an HTML5 video player.
	* Validates backend event tracking via POST `/api/event` endpoint.
	* Handles both valid and invalid requests (negative tests).
	* Captures screenshots on test failures.
	* Generates HTML test reports.
	* CI pipeline powered by GitHub Actions.
	
## Test Plan	
	* See docs/test-plan.md for test coverage and strategy.

## Open Issues(Bugs Found) 

#### Please notice that latest run is without client&server bugs fixes.
#### GitHub Dashboard results show tests status after the bugs will be fixed.

| Issue | Description | Problem | Fix |
|-------|-------------|---------|-----|
| favicon.ico | file is missing | causing 404 error on console | fixed in client's index.html file |
| client sends wrong event | ('play' instead of 'pause') in 'pause' event | causing some functional tests failures | fix is COMMENTED in client's index.html file |
| server validations | server is missing validations for missing/invalid fields | causing some edge cases tests failure | fix is COMMENTED in server.js file |
