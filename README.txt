Minute Media Video Player Test Suite

This project is an automation test suite for a custom video player using Playwright and Docker.

Project Structure:

* client: Static frontend with video player
* server: Node.js backend with Express
* tests: Playwright UI tests
* Dockerfile: Builds and runs backend server
* docker-compose.yml: Launches frontend/backend
* playwright.config.js: Test config and browser settings

How to Run:

1. Install dependencies: `npm install`
2. Start server with Docker: `docker-compose up`
3. Run tests: `npx playwright test`
4. View test report: `npx playwright show-report`

Test Coverage:

* Video playback (play, pause, seek, scroll)
* Event data validation
* Handling of bad/missing POST requests
* Validate No console errors

CI/CD:

* GitHub Actions pipeline

  * Builds app
  * Starts backend
  * Runs tests
  * Exports results in HTML

Tech Stack:

* Playwright
* Node.js (Express)
* Docker
* GitHub Actions

Issues/Bugs Found:

* favicon.ico missing - caused 404 error on favicon.ico - fixed in client's index.html file
* client sends wrong event in 'pause' event -> 'play' event is sent,causing functional tests failures - fix is in comment in client's index.html file
* server doesn't have validations for missing/invalid fields such as type,userId etc., causing edge cases tests failures - fix is in comment in client index.html