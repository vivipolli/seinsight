# Frontend React - Seinsight AI

## 🚀 Como rodar o frontend

### Pré-requisitos
- Node.js 18+ 
- Yarn ou npm
- ElizaOS rodando na porta 3000

### 1. Instalar dependências
```bash
cd insights-analyzer
yarn install
```

### 2. Rodar o ElizaOS (backend)
```bash
yarn start
# ou
yarn dev
```

### 3. Rodar o frontend React
Em outro terminal:
```bash
yarn frontend:dev
```

O frontend estará disponível em: http://localhost:5173

### 4. Build para produção
```bash
yarn frontend:build
```

## 📁 Estrutura do Frontend

```
src/frontend/
├── components/          # Componentes React
│   ├── SeinsightApp.tsx # Componente principal
│   ├── Header.tsx       # Cabeçalho
│   ├── InputSection.tsx # Formulário de entrada
│   ├── LoadingSection.tsx # Loading spinner
│   ├── ResultsSection.tsx # Exibição de resultados
│   └── index.ts         # Barrel exports
├── services/
│   └── SeinsightService.ts # Lógica de API
├── types/
│   └── index.ts         # Tipos TypeScript
├── styles/
│   └── seinsight.css    # Estilos específicos
├── index.tsx            # Entry point React
├── index.css            # Estilos globais
└── index.html           # HTML base
```

## 🔧 Scripts disponíveis

- `yarn frontend:dev` - Desenvolvimento com hot reload
- `yarn frontend:build` - Build para produção
- `yarn frontend:preview` - Preview do build
- `yarn start` - ElizaOS (backend)
- `yarn dev` - ElizaOS em modo desenvolvimento

## 🌐 Funcionalidades

- ✅ Interface React moderna
- ✅ Integração com ElizaOS agents
- ✅ Geração de hashtags via HashtagGenerator
- ✅ Análise crítica via InsightCompiler
- ✅ Loading states e error handling
- ✅ Design responsivo
- ✅ Tipagem TypeScript completa

## 🔗 Integração com ElizaOS

O frontend se conecta aos seguintes agents:
- **HashtagGenerator**: `635b4207-35ce-0ec5-a517-52445ae58215`
- **InsightCompiler**: `3643e20d-b322-0e3e-a089-87f323dc94ad`

## 🎨 Estilos

- Fonte: Inter (Google Fonts)
- Gradiente: Roxo/Azul
- Design: Moderno e responsivo
- Framework: CSS puro + Tailwind
