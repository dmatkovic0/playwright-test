# AIO Tests Integration Guide

## Overview
Your Playwright tests are now configured to automatically report results to AIO Tests in Jira. When you're ready to use this feature, follow the setup steps below.

## Setup Instructions

### 1. Generate AIO Tests API Key
1. Log into your Jira instance
2. Go to **Jira Settings** → **Apps** → **AIO Tests** → **API Keys**
3. Click **Generate API Key**
4. Copy the generated API key

### 2. Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your actual values:
   ```env
   AIO_JIRA_URL=https://yourcompany.atlassian.net
   AIO_API_KEY=your-actual-api-key
   AIO_PROJECT_KEY=YOUR_PROJECT_KEY
   # Optional: Specify existing cycle to update
   # AIO_CYCLE_KEY=CYC-123
   ```

### 3. Link Tests to AIO Test Cases

To link your Playwright tests to AIO Tests cases in Jira, add the test case key to your test title with `@` prefix:

#### Method 1: Add to test title (Recommended)
```javascript
test('should successfully login with valid credentials @TC-001', async ({ page }) => {
  // your test code
});
```

#### Method 2: Use tags array
```javascript
test('should successfully login @TC-002', {
  tag: '@TC-002'
}, async ({ page }) => {
  // your test code
});
```

**Note:** Replace `TC-001`, `TC-002` with your actual AIO Tests case keys from Jira.

## How It Works

### Automatic Cycle Creation
- If you **don't specify** `AIO_CYCLE_KEY`, a new test cycle will be created automatically with the name format: `Playwright Test Run - YYYY-MM-DD`
- Each test run creates a new cycle in Jira

### Update Existing Cycle
- If you **do specify** `AIO_CYCLE_KEY` in `.env`, test results will update that existing cycle
- Useful for tracking progress within a specific test cycle

### Result Reporting
- **Pass**: If your test passes, it will be marked as PASSED in AIO Tests
- **Fail**: If your test fails, it will be marked as FAILED in AIO Tests
- **Attachments**: Screenshots and videos from failed tests are automatically uploaded

## Running Tests

Once configured, simply run your tests as normal:

```bash
npx playwright test
```

After the test run completes, results will automatically be sent to AIO Tests in Jira.

## CI/CD Integration

For CI/CD pipelines, set the API key as an environment variable:

```bash
export AIO_API_KEY="your-api-key"
npx playwright test
```

In GitHub Actions:
```yaml
- name: Run Playwright tests
  env:
    AIO_API_KEY: ${{ secrets.AIO_API_KEY }}
  run: npx playwright test
```

## Configuration Options

The reporter is configured in `playwright.config.js` with these options:

| Option | Description | Default |
|--------|-------------|---------|
| `cloud` | Set to `true` for Jira Cloud | `true` |
| `jiraUrl` | Your Jira instance URL | - |
| `apiKey` | AIO Tests API key | - |
| `projectKey` | Jira project key | - |
| `cycleKey` | Existing cycle to update (optional) | `undefined` |
| `createNewCycle` | Create new cycle if cycleKey not specified | `true` |
| `cycleName` | Name for new cycle | `Playwright Test Run - YYYY-MM-DD` |
| `uploadAttachments` | Upload screenshots/videos for failed tests | `true` |

## Troubleshooting

### Tests run but results don't appear in Jira
- Verify your API key is correct
- Check that test case keys (e.g., `@TC-001`) match actual test cases in AIO Tests
- Ensure your Jira project key is correct
- Check console output for any error messages from the reporter

### "Unauthorized" error
- Regenerate your API key in AIO Tests settings
- Make sure the API key has proper permissions

### Test case not found
- Verify the test case key exists in your Jira project
- Ensure the test case is part of AIO Tests (not just a regular Jira issue)

## Disabling AIO Reporter Temporarily

To run tests without sending results to Jira, either:

1. Remove the API key from `.env`
2. Or comment out the reporter in `playwright.config.js`:
   ```javascript
   reporter: [
     ['list'],
     ['html'],
     // ['aiotests-playwright-reporter', { aioConfig }],
   ],
   ```

## Next Steps

When you're ready to use this feature:
1. Set up your `.env` file with credentials
2. Create test cases in AIO Tests (or use existing ones)
3. Tag your Playwright tests with the AIO test case keys
4. Run your tests and see results automatically appear in Jira!

How It Will Work (When You're Ready)

  1. Set up credentials - Copy .env.example to .env and add your Jira URL, API key, and project key
  2. Tag your tests - Add @TC-001 (your AIO test case key) to test titles
  3. Run tests normally - npx playwright test
  4. Results auto-sync - Pass/Fail status automatically updates in Jira cycles
