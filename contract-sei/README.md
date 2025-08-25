# Seinsight AI Backend

Backend da plataforma Seinsight AI - Sistema de análise e recomendações autônomas baseadas em dados de redes sociais, com ancoragem on-chain na Sei.

## 🚀 Funcionalidades

### ✅ Implementadas (MVP)
- **Coleta de dados sociais** (Twitter, LinkedIn, Instagram)
- **Análise de sentimento** e tendências
- **Geração de insights** baseados em IA
- **Aprovação manual** de insights (human-in-the-loop)
- **Registro on-chain** na blockchain Sei
- **APIs REST** completas
- **Smart contracts** para milestone e insights

### 🔄 Em Desenvolvimento
- Integração real com APIs de redes sociais
- Modelos de IA mais avançados
- Dashboard de analytics
- Sistema de notificações

## 📁 Estrutura do Projeto

```
backend/
├── contracts/                 # Smart contracts Solidity
│   ├── MilestoneRegistry.sol  # Registro de milestones
│   ├── AchievementNFT.sol     # NFTs de conquistas
│   └── InsightRegistry.sol    # Registro de insights
├── src/
│   ├── controllers/          # Controllers da API
│   ├── services/            # Lógica de negócio
│   ├── routes/              # Rotas da API
│   ├── middleware/          # Middlewares
│   ├── utils/               # Utilitários
│   ├── config/              # Configurações
│   └── server.js            # Servidor principal
├── scripts/                 # Scripts de deploy
├── test/                    # Testes
├── docs/                    # Documentação
└── logs/                    # Logs da aplicação
```

## 🛠️ Tecnologias

### Backend
- **Node.js/Express** - Framework web
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache e sessões
- **Winston** - Logging
- **Joi** - Validação de dados

### Blockchain
- **Solidity** - Smart contracts
- **Hardhat** - Desenvolvimento e deploy
- **Sei Network** - Blockchain principal
- **OpenZeppelin** - Contratos seguros

### IA/Analytics
- **Mock Data** - Dados simulados para MVP
- **Análise de sentimento** - Processamento de texto
- **Detecção de tendências** - Análise temporal

## 🚀 Instalação

### 1. Pré-requisitos
```bash
# Node.js 18+
node --version

# PostgreSQL
psql --version

# Redis (opcional para MVP)
redis-server --version
```

### 2. Clone e instale dependências
```bash
cd backend
npm install
```

### 3. Configure variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 4. Compile os contratos
```bash
npm run compile
```

### 5. Deploy dos contratos (opcional)
```bash
npm run deploy
```

### 6. Inicie o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📡 APIs

### Base URL
```
http://localhost:3000/api
```

### Endpoints Principais

#### Insights
- `GET /insights` - Listar insights
- `GET /insights/:projectId` - Insights por projeto
- `POST /insights` - Criar insight
- `POST /insights/approve` - Aprovar/rejeitar insight

#### Analytics
- `GET /analytics/social/:projectId` - Analytics sociais
- `GET /analytics/social/:projectId/sentiment` - Análise de sentimento
- `GET /analytics/social/:projectId/trends` - Análise de tendências

#### Social Data
- `POST /social/collect` - Coletar dados sociais
- `GET /social/data/:projectId` - Dados sociais
- `POST /social/configure` - Configurar plataforma

#### Blockchain
- `GET /blockchain/insights/:projectId` - Insights da blockchain
- `POST /blockchain/register-insight` - Registrar insight on-chain

## 🔧 Configuração

### Variáveis de Ambiente

#### Obrigatórias
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_NAME=Seinsight_ai
DB_USER=postgres
DB_PASSWORD=password
```

#### Blockchain (para produção)
```env
PRIVATE_KEY=your-private-key
SEI_RPC_URL=https://evm-rpc-testnet.sei-apis.com
SEI_CHAIN_ID=1328
```

#### APIs Sociais (para produção)
```env
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes dos contratos
npx hardhat test

# Testes específicos
npm test -- --grep "insights"
```

## 📊 Monitoramento

### Logs
- **Arquivo**: `logs/combined.log`
- **Erros**: `logs/error.log`
- **Console**: Em desenvolvimento

### Health Check
```bash
curl http://localhost:3000/health
```

## 🔒 Segurança

### Implementado
- **Helmet** - Headers de segurança
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Limitação de requisições
- **Input Validation** - Validação de entrada
- **Error Handling** - Tratamento de erros

### Recomendações
- Use HTTPS em produção
- Configure firewall adequadamente
- Monitore logs regularmente
- Mantenha dependências atualizadas

## 🚀 Deploy

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
# Build
npm run build

# Start
npm start

# PM2 (recomendado)
pm2 start ecosystem.config.js
```

## 📈 Próximos Passos

### Semana 1 (Dias 1-5)
- [x] Estrutura básica do backend
- [x] APIs REST
- [x] Smart contracts
- [x] Mock data para MVP

### Semana 2 (Dias 6-11)
- [ ] Integração real com APIs sociais
- [ ] Modelos de IA básicos
- [ ] Testes completos
- [ ] Documentação final
- [ ] Preparação para apresentação

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação em `docs/`
- Verifique os logs em `logs/`
