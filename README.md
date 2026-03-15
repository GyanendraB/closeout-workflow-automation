# Closeout Hardhat AI Validation Automation

This project uses Playwright with TypeScript to validate the Closeout hardhat AI workflow and related API services. It includes 4 UI test cases and 3 API test cases.

## Test Cases
### UI
1. Login test >>
Validates both login scenarios. It checks unauthorized login with wrong credentials and successful login with valid credentials.
2. Accept Images Validation >>
Uploads images from the accept folder. It validates that the AI marks those images as accepted.
3. Rejected Images Validation >>
Uploads images from the reject folder. It validates that the AI marks those images as rejected.
4. Notification Validation >>
Clears old notifications, uploads a reject image, and checks that a new notification badge appears. It also validates the notification time and clears the notification again.

### API
1. Login API test
Validates that the login API returns a successful response and auth token for valid credentials.
2. Account API test
Validates that the user account API returns the expected logged-in user details.
3. Photo Upload API test
Validates that the placeholder photo API returns photo records and expected status values.

## Project Structure
- `src/pages`: page objects for login, control panel, project, site, and workflow navigation
- `src/fixtures`: reusable Playwright fixtures
- `src/utils`: shared utility helpers
- `src/config`: environment and framework configuration
- `tests/ui`:  UI validation scenarios
- `tests/api`: API validation scenarios
- `test-data`: sample images and payloads
- `test-data/images/accept`: images that must be accepted by AI validation
- `test-data/images/reject`: images that must be rejected by AI validation
- `reports`: generated execution reports

## Setup and Run
Requirements : 
To run this project, you mainly need these: 
Node.js
npm
Playwright browsers
Java, if you want to generate or open Allure reports
Vs Code

```bash
Clone the project from git hub. 
npm install
npx playwright install
```

## Running Tests
1. Run all the test cases:
```bash
npm test
```
2. Run just the API/UI test cases:
```bash
npm run test:api
npm run test:ui
    Headed(With the Browser)
cd .\closeout-ai-validation-automation
npx playwright test tests/ui --headed
```
4. Run a specific test case:
Example:
```bash
cd .\closeout-ai-validation-automation
npx playwright test tests/ui/login-ui.spec.ts
```
Specific UI test in headed mode:
```bash
cd .\closeout-ai-validation-automation
npx playwright test tests/ui/login-ui.spec.ts --headed
```

## Reports
An HTML Playwright report is generated automatically after every execution in `reports/playwright-report`.
Open the HTML report with:
```bash
npm run report
npx playwright show-report reports\playwright-report
```
Screenshots are saved for all test runs. Videos and traces are kept for failed tests in `test-results`.

An Allure results folder is also generated automatically in `allure-results`.
Serve the Allure report with:
```bash
npm.cmd run clean:allure
npm run test 
npm run report:allure:generate
allure open reports/allure-report
```

## Test Data Naming
- Keep accepted images in `test-data/images/accept` using names like `accept-1.jpg`, `accept-2.jpg`
- Keep rejected images in `test-data/images/reject` using names like `reject-1.jpg`, `reject-2.jpeg`
- If an image is placed in the wrong folder, that folder test should fail for that image but continue validating the remaining files
