# 🎬 Como Rodar E2E Tests com Playwright

## ⚠️ Problema Encontrado & Solução

### Problema
```
Error: Timed out waiting 60000ms from config.webServer
```

**Causa:** O servidor de desenvolvimento não consegue iniciar no tempo especificado durante os testes E2E.

### Solução
Configuração atualizada em `playwright.config.ts`:
- ✅ Timeout aumentado para 120 segundos
- ✅ `reuseExistingServer: false` (garante início fresco)
- ✅ Workers reduzido para 1 (evita conflitos)
- ✅ Screenshots e vídeos em caso de falha

---

## 🚀 Como Rodar Corretamente

### Opção 1: Deixar o Dev Server Rodando (RECOMENDADO)

**Terminal 1 - Iniciar servidor:**
```bash
npm run dev
# Aguarde até ver: "VITE v... ready in XXX ms"
# Verifique: http://localhost:5173
```

**Terminal 2 - Rodar testes E2E:**
```bash
npm run test:e2e
```

### Opção 2: Deixar Playwright Iniciar o Servidor

```bash
# Playwright vai iniciar npm run dev automaticamente
npm run test:e2e
# Aguarde a inicialização (pode levar 30-60 segundos)
```

### Opção 3: Debug com UI Interativa

```bash
# Terminal 1: Servidor
npm run dev

# Terminal 2: Testes com UI
npm run test:e2e:ui
```

---

## 🔧 Comandos Úteis

### Ver Relatório HTML
```bash
# Após rodar os testes, abra o relatório
npx playwright show-report
```

### Rodar Teste Específico
```bash
# Rodar apenas um arquivo
npx playwright test e2e/app.spec.ts

# Rodar um teste específico por nome
npx playwright test -g "should load homepage"
```

### Debug Mode
```bash
# Abre inspetor visual
PWDEBUG=1 npx playwright test

# Ou com UI
npm run test:e2e:ui --debug
```

### Headed Mode (Ver o Browser)
```bash
npm run test:e2e:headed
```

### Watch Mode (Reconectar após mudanças)
```bash
npx playwright test --watch
```

---

## ✅ Checklist Antes de Rodar

- [ ] Node.js v16+ instalado: `node --version`
- [ ] Dependências instaladas: `npm install` ou `npm ci`
- [ ] Navegadores Playwright instalados: `npx playwright install`
- [ ] Porta 5173 disponível (verificar em `http://localhost:5173`)
- [ ] Arquivo `playwright.config.ts` atualizado
- [ ] E2E tests existem em pasta `e2e/`

---

## 🐛 Troubleshooting

### Erro: "Port 5173 already in use"
```bash
# Mate o processo na porta
lsof -i :5173
kill -9 <PID>

# Ou use outra porta
npm run dev -- --port 5174
```

### Erro: "Chromium not found"
```bash
# Instale os navegadores
npx playwright install chromium
# Ou todos
npx playwright install
```

### Erro: "connect ECONNREFUSED"
```bash
# Certifique-se que o servidor está rodando
npm run dev
# Aguarde: "ready in XXX ms"
# Depois em outro terminal:
npm run test:e2e
```

### Relatório vazio ou em branco
```bash
# Limpe cache e relatórios antigos
rm -rf playwright-report test-results
npm run test:e2e
npx playwright show-report
```

### Testes muito lentos
```bash
# Reduza o número de browsers em playwright.config.ts
# Uncomment apenas o Chromium para testes rápidos
```

---

## 📊 Esperado na Saída

### Sucesso ✅
```
Running 27 tests using 1 worker
  ✓ [chromium] › e2e/app.spec.ts:6 (1.2s)
  ✓ [chromium] › e2e/app.spec.ts:13 (800ms)
  ...
27 passed (45s)
```

### Com Falhas ❌
```
Running 27 tests using 1 worker
  ✗ [chromium] › e2e/app.spec.ts:6
  ...
3 failed, 24 passed (1m)

To debug the failed tests, run:
npx playwright test --debug
```

---

## 📁 Arquivos de Saída

Após rodar testes:
```
playwright-report/
├── index.html          # Abrir no browser
├── data/
│   └── traces/        # Vídeos e traces
└── test-results/      # Detalhes de falhas

test-results/
└── ...                # Resultados em JSON
```

---

## 🎯 Próximos Passos

1. **Rodar testes iniciais:**
   ```bash
   npm run dev          # Terminal 1
   npm run test:e2e     # Terminal 2
   ```

2. **Ver resultado:**
   ```bash
   npx playwright show-report
   ```

3. **Se houver falhas:**
   ```bash
   npm run test:e2e:headed    # Ver o que falhou
   # ou
   PWDEBUG=1 npx playwright test  # Debug interativo
   ```

---

## 💡 Dicas Pro

### Para CI/CD (GitHub Actions, etc)
```bash
# Instalar tudo de uma vez
npm ci
npx playwright install

# Rodar testes
npm run test:e2e
```

### Para múltiplos browsers (depois que tiver funcionando)
1. Edite `playwright.config.ts`
2. Descomente `firefox` e `webkit`
3. Rode novamente:
   ```bash
   npm run test:e2e
   ```

### Salvar vídeos de todas as falhas
```bash
# Editado em playwright.config.ts:
video: 'retain-on-failure'  // Já configurado!
```

---

## ❓ FAQ

**P: Quanto tempo leva para rodar?**
A: ~1-2 minutos na primeira execução, ~30-60 segundos depois

**P: Posso rodar enquanto desenvolvimento?**
A: Sim! Use `npm run test:e2e:ui` para teste interativo

**P: Como debugar um teste específico?**
A: Use `npm run test:e2e:headed` e veja o browser em tempo real

**P: Posso rodar no CI?**
A: Sim! Veja seção "Para CI/CD"

---

**Last Updated:** 22/10/2025
**Status:** ✅ Ready to Test
