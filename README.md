# Associação Cultural e Recreativa dos Moradores de Almargem

Site oficial da Associação Cultural e Recreativa dos Moradores de Almargem.

## Dados da Associação

- **NIF:** 502197463
- **Denominação:** Associação Cultural e Recreativa dos Moradores de Almargem
- **Email:** ACRDM_ALMARGEM@HOTMAIL.COM
- **Facebook:** Almargem.2026

## Funcionalidades

### 📞 Contactos e Redes Sociais
- Informações de contacto da associação
- Links diretos para redes sociais
- Formulário de contacto por email
- Localização no mapa

### 📊 Relatórios de Contas Mensais
- Publicação de relatórios financeiros
- Visualização de receitas, despesas e saldos
- Organização por mês/ano
- Descrições detalhadas

### 📸 Publicações
- Sistema de publicação de imagens
- Comentários interativos
- Upload de fotos
- Organização cronológica

### 👥 Lista de Sócios
- Gestão de sócios da associação
- Pesquisa rápida
- Estatísticas (total e sócios ativos)
- Estados de adesão

### 🍽️ Reservas de Comida
- Sistema de reservas online
- Múltiplos pratos disponíveis
- Controle de quantidade
- Observações personalizadas

## Como Usar

### Localmente
1. Abra o arquivo `index.html` no seu navegador
2. Todas as funcionalidades funcionam offline
3. Os dados são guardados no navegador (localStorage)

### Hospedagem Gratuita

#### Opção 1: GitHub Pages (Recomendado)
1. Crie uma conta no [GitHub](https://github.com)
2. Crie um novo repositório chamado `associacao-almargem`
3. Faça upload dos 3 arquivos:
   - `index.html`
   - `styles.css`
   - `script.js`
4. Vá para Settings > Pages
5. Selecione "Deploy from a branch"
6. Escolha a branch `main` e pasta `/root`
7. Seu site estará disponível em: `https://[seu-usuario].github.io/associacao-almargem`

#### Opção 2: Netlify
1. Acesse [Netlify](https://netlify.com)
2. Arraste os arquivos para a área de upload
3. Pronto! Site publicado com URL aleatória gratuita

#### Opção 3: Vercel
1. Acesse [Vercel](https://vercel.com)
2. Importe o projeto do GitHub ou faça upload
3. Site publicado instantaneamente

#### Opção 4: Firebase Hosting
1. Crie projeto no [Firebase Console](https://console.firebase.google.com)
2. Instale Firebase CLI: `npm install -g firebase-tools`
3. Execute: `firebase init hosting`
4. Faça upload: `firebase deploy`

## Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Design responsivo e moderno
- **JavaScript Vanilla** - Funcionalidades interativas
- **Font Awesome** - Ícones profissionais
- **LocalStorage** - Armazenamento local de dados

## Personalização

### Alterar Cores
No arquivo `styles.css`, modifique as variáveis:
```css
/* Cor principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adicionar Novos Pratos
No arquivo `index.html`, na seção de reservas:
```html
<option value="novo-prato">Nome do Novo Prato</option>
```
E no arquivo `script.js`:
```javascript
const pratos = {
    // ... pratos existentes
    'novo-prato': 'Nome do Novo Prato'
};
```

### Modificar Informações da Associação
Edite o arquivo `index.html` na seção `<header>` e `<footer>`.

## Backup de Dados

O site inclui funcionalidades de backup:
- **Exportar:** Botão para exportar todos os dados em formato JSON
- **Importar:** Funcionalidade para restaurar dados a partir de backup

Para acessar estas funções, abra o console do navegador (F12) e execute:
```javascript
exportData() // Exportar dados
```

## Segurança

- Todos os dados são armazenados localmente no navegador
- Não há envio de informações para servidores externos
- Recomendado fazer backup regular dos dados

## Suporte e Manutenção

### Problemas Comuns
1. **Dados não aparecem:** Verifique se o localStorage está ativo
2. **Imagens não carregam:** Verifique o formato e tamanho dos arquivos
3. **Links quebrados:** Atualize os URLs das redes sociais

### Manutenção Recomendada
- Backup mensal dos dados
- Atualização de informações de contacto
- Revisão de relatórios financeiros

## Licença

Este projeto é gratuito e open-source para uso da Associação Cultural e Recreativa dos Moradores de Almargem.

---

**Desenvolvido com ❤️ para a comunidade de Almargem**
