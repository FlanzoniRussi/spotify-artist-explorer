# 🧪 Test Commands - Quick Reference

## 📋 Unit & Component Tests

### Run All Tests
```bash
npm run test
```

### Run Tests in Watch Mode
```bash
npm run test -- --watch
```

### Run Tests with Coverage
```bash
npm run test -- --coverage
```

### Run Specific Test File
```bash
npm run test -- hooks.test.tsx
npm run test -- header.test.tsx
npm run test -- track-registration-form.test.tsx
```

---

## 🎬 E2E Tests (Playwright)

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Specific E2E Test
```bash
npm run test:e2e -- app.spec.ts
```

### Run in Debug Mode
```bash
npm run test:e2e -- --debug
```

### View Last Test Report
```bash
npx playwright show-report
```

---

## 🚀 Full Setup (Recommended)

### Terminal 1: Start Dev Server
```bash
npm run dev
# Wait for: "VITE v... ready in XXX ms"
```

### Terminal 2: Run Tests
```bash
npm run test               # Unit tests
npm run test:e2e          # E2E tests
```

---

## 📊 Test Coverage Commands

### View Coverage Report
```bash
npm run test -- --coverage
# Then open: coverage/index.html
```

---

## 🎯 Pre-commit Commands

### Run All Tests Before Commit
```bash
npm run test && npm run test:e2e
```

---

## ✅ What Each Test Does

| Command | Tests | Time | Purpose |
|---------|-------|------|---------|
| `npm run test` | Unit + Component | ~5s | Verify logic |
| `npm run test:e2e` | E2E (13) | ~30s | Verify UI flows |
| `npm run test -- --coverage` | With coverage | ~8s | Check coverage % |

---

## 📝 CI/CD Ready

Use these commands in your CI/CD pipeline:

```yaml
# .github/workflows/test.yml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
    - run: npm ci
    - run: npm run test              # ✅
    - run: npm run build
    - run: npm run test:e2e          # ✅
```

