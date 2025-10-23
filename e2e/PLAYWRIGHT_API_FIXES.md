# Playwright API Corrections

## Problem
Tests were using Testing Library API, not Playwright API:
- ❌ `page.getByPlaceholderText()` - Testing Library
- ✅ `page.locator('input[placeholder*="..."]')` - Playwright
- ✅ `page.locator('input').filter({ hasText: /.../ })` - Playwright

## Changes Made

### Before (Testing Library - WRONG)
```typescript
await page.getByPlaceholderText(/nome da música/i).fill('Test');
```

### After (Playwright - CORRECT)
```typescript
await page.locator('input[placeholder*="música"]').fill('Test');
// OR
await page.locator('input[placeholder*="name"]').fill('Test');
// OR using role
await page.getByRole('textbox', { name: /música|name/i }).fill('Test');
```

## API Mapping

| Testing Library | Playwright |
|---|---|
| `getByPlaceholderText()` | `locator('input[placeholder*="..."]')` |
| `getByRole()` | `getByRole()` ✅ (same) |
| `getByText()` | `getByText()` ✅ (same) |
| `getByLabelText()` | `getByLabel()` |

## Solution
Replace all `getByPlaceholderText()` calls with `locator('input[placeholder*="..."]')`
