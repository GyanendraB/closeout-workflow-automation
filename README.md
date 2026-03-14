# Closeout Hardhat AI Validation Automation

This project uses Playwright with TypeScript to validate the Closeout hardhat AI workflow end to end.

## Project Structure
- `src/pages`: page objects for login, control panel, project, site, and workflow navigation
- `src/fixtures`: reusable Playwright fixtures
- `src/utils`: shared utility helpers
- `src/config`: environment and framework configuration
- `tests/ui`: UI validation scenarios
- `tests/api`: API validation scenarios
- `test-data`: sample images and payloads
- `test-data/images/accept`: images that must be accepted by AI validation
- `test-data/images/reject`: images that must be rejected by AI validation
- `reports`: generated execution reports

## Setup
```bash
npm install
npx playwright install
```

## Running Tests
Run all test cases:
```bash
npm test
```
Run only UI test cases:
```bash
npm run test:ui
```
Run only API test cases:
```bash
npm run test:api
```
Run accept-folder validation only:
```bash
npx playwright test tests/ui/accept-folder-ai-validation.spec.ts
```
Run reject-folder validation only:
```bash
npx playwright test tests/ui/reject-folder-ai-validation.spec.ts
```

## Headed and Headless
Run in headed mode:
```bash
npx playwright test --headed
```
Run in headless mode:
```bash
npx playwright test --headless
```

## Parallel Execution
Run tests with a specific number of workers:
```bash
npx playwright test --workers=4
```
The project is currently configured to run sequentially with `workers: 1` and `fullyParallel: false` in `playwright.config.ts`.

## Browser Selection
Run the currently configured browser project:
```bash
npx playwright test --project=chromium
```

## Reports
An HTML Playwright report is generated automatically after every execution in `reports/playwright-report`.
Open the HTML report with:
```bash
npm run report
npx playwright show-report reports\playwright-report
```
An Allure results folder is also generated automatically in `allure-results`.
Serve the Allure report with:
```bash
npm run test 
npm run report:allure:generate
allure open reports/allure-report
```

## Test Data Naming
- Keep accepted images in `test-data/images/accept` using names like `accept-1.jpg`, `accept-2.jpg`
- Keep rejected images in `test-data/images/reject` using names like `reject-1.jpg`, `reject-2.jpeg`
- If an image is placed in the wrong folder, that folder test should fail for that image but continue validating the remaining files

