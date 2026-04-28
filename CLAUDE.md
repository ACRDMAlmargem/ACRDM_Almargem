# CLAUDE.md — ACRDM Almargem

## Project Overview

- Site oficial da **Associação Cultural e Recreativa dos Moradores de Almargem**
- NIF: 502197463 | Email: ACRDM_ALMARGEM@HOTMAIL.COM | Facebook: Almargem.2026
- GitHub: `https://github.com/ACRDMAlmargem/ACRDM_Almargem`
- Default branch: `main`
- IBAN (quotas): PT50 0045 5310 4010 3909 03339

## Architecture

Site **estático** — sem servidor, sem base de dados, sem build step.

| Ficheiro | Função |
|----------|--------|
| `index.html` | Estrutura completa da SPA (tabs + modais) |
| `script.js` | Toda a lógica da aplicação (~1000 linhas) |
| `styles.css` | Estilos |
| `pdf-generator.js` | Geração de PDFs do formulário de sócio |
| `logo.svg` / `header-image.svg` | Assets estáticos |

**Stack:** HTML5 + CSS3 + Vanilla JavaScript  
**Persistência:** `localStorage` (sem backend)  
**Dependências externas (CDN):** Font Awesome 6.0.0  

## Módulos Funcionais

### Tabs (navegação)
Cinco secções geridas por `data-tab` + classList `active`:
- **Contactos** — email, Facebook, localização (Google Maps)
- **Relatórios** — balancetes mensais + importação de PDFs
- **Publicações** — galeria com comentários
- **Sócios** — lista, pesquisa, adição manual, formulário de adesão
- **Reservas** — reservas de refeições com data/prato/quantidade

### localStorage keys
| Key | Conteúdo |
|-----|----------|
| `reports` | Array de balancetes e PDFs importados |
| `publicacoes` | Array de publicações com comentários |
| `socios` | Array de sócios (id, name, email, phone, status, joinDate) |
| `reservas` | Array de reservas (id, nome, telefone, data, prato, quantidade, status) |
| `adesoes` | Array de pedidos de adesão pendentes de pagamento |

### Formulário de Adesão
- Campos obrigatórios: nome, data de nascimento, NIF (9 dígitos), email, termos
- Validação: NIF formato `/^\d{9}$/`, idade mínima 18 anos, email regex
- Ao submeter: gera PDF via `criarFormularioSocio()` + `enviarFormularioPorEmail()` (abre janela de impressão)
- Guarda localmente em `adesoes` com `status: 'pendente_pagamento'`
- Quota anual: 12€

### Geração de PDFs
- `pdf-generator.js` expõe `criarFormularioSocio(dadosSocio)` e `enviarFormularioPorEmail(dadosSocio, pdfHTML)`
- PDFs de balancetes importados são armazenados como base64 em `localStorage`

## Git Workflow

Commits vão directamente para `main`:

```bash
git add <ficheiros>
git commit -m "feat: ..."
git push origin main
```

## Correr Localmente

Site estático — abrir `index.html` directamente no browser ou servir com qualquer servidor HTTP simples:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

## Notas de Desenvolvimento

- **Não há build step** — editar os ficheiros directamente, sem npm install, sem compilação
- **localStorage é volátil por browser/dispositivo** — dados não são partilhados entre utilizadores
- **Imagens em publicações** usam `URL.createObjectURL()` — não persistem após reload (bug conhecido)
- A função `displaySocios()` referencia `totalSocios` e `sociosAtivos` no DOM, mas esses elementos não existem no HTML actual — não chamam erro fatal mas não actualizam contadores
- `initializeData()` em `script.js:32` nunca é chamada (função duplicada de `DOMContentLoaded`) — dead code


