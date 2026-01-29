# UI and API tests

## Overview
This project is a Playwright-based end-to-end and API test suite for demo web applications. It is designed to be easy to use, maintain, and extend. The suite includes UI tests for the Sauce Demo app and API tests for the FakeStore API (mocked for CI reliability).

## Folder Structure (High Level)

```
.
├── src/
│   ├── tests/
│   │   ├── specs/
│   │   │   ├── ui/           # UI tests for Sauce Demo
│   │   │   └── api/          # API tests for FakeStore (mocked)
│   │   ├── fixtures/         # Playwright fixtures
│   │   └── page-objects/     # Page Object Model files
│   └── utils/                # Global setup, types, helpers
├── playwright.config.ts      # Playwright configuration
├── package.json              # Project dependencies and scripts
├── test-results/             # Test result outputs
├── playwright-report/        # Playwright HTML report output
└── ...
```

## Test Descriptions

- **UI Tests (Sauce Demo)**
  - Located in `src/tests/specs/ui/sauceDemo.spec.ts`
  - Automates login, product selection, cart, checkout, and order completion flows on the Sauce Demo web app.

- **API Tests (FakeStore API)**
  - Located in `src/tests/specs/api/fakestore.spec.ts`
  - Originally called the real FakeStore API and passed locally, but failed in GitHub Actions due to Cloudflare protection.
  - Now uses mocked data and Playwright's `page.route` to intercept and simulate API responses, ensuring tests are reliable in all environments.

## Reporting
- **Playwright HTML Report**
  - After running tests, a full HTML report is generated in the `playwright-report/` folder.
  - You can view the report locally or download it from CI artifacts.

## Linting
- Linting is recommended using ESLint (if configured in your project). Run `npx eslint .` to check code quality.

## How to Use

### 1. Install Dependencies
```
npm install
```

### 2. Run All Tests
```
npx playwright test
```

### 3. Run Only UI or API Tests
```
npx playwright test --project=sauceDemo
npx playwright test --project=fakeStoreAPI
```

### 4. View the Playwright HTML Report
After running tests:
```
npx playwright show-report
```
Or open the `playwright-report/index.html` file in your browser.

### 5. Lint the Code (if ESLint is set up)
```
npx eslint .
```

## Notes
- The FakeStore API tests are fully mocked for CI reliability. Locally the tests were working against the real API, I have uploaded the test results from the older runs in the repo where real calls are made to the API.
- The project is designed to be plug-and-play: clone, install, and run.

---

## Credits

AI assistance (GitHub Copilot) was used to generate basic boilerplate code and to help set up the CI pipeline and readme file for this project.

Hope this helps :)
