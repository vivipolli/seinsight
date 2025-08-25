# Community Signal Oracle - Deployment Guide

## 📋 Pré-requisitos

### 1. Environment Setup
Certifique-se de que o arquivo `.env` contém:
```bash
PRIVATE_KEY=0x...  # Sua chave privada (sem 0x no início)
```

### 2. Sei Testnet Tokens
- Obtenha SEI testnet tokens do faucet: https://faucet.sei-apis.com/
- Endereço para adicionar SEI testnet na sua wallet: `https://evm-rpc-testnet.sei-apis.com`
- Chain ID: `1328`

### 3. Instalação
```bash
cd backend
npm install
# ou
yarn install
```

## 🚀 Deploy Options

### Opção 1: Script Direto (Recomendado)
```bash
# Compile o contrato
npm run compile

# Deploy no Sei Testnet
npm run deploy:oracle:testnet
```

### Opção 2: Hardhat Ignition
```bash
# Deploy usando Ignition
npm run deploy:oracle:ignition
```

## 📊 Após o Deploy

### 1. Verificar Deployment
O script irá exibir:
- ✅ Endereço do contrato
- 📊 Hash da transação
- 🔗 Link do Sei Explorer

### 2. Salvar Informações
Copie o endereço do contrato para:
- Frontend/dApp configuration
- Arquivo de configuração `.env`
- Documentation

### 3. Configurar Permissões (Opcional)
```bash
# Se precisar autorizar outros publishers
# Use a função setPublisherAuthorization() do contrato
```

## 🔧 Verificação do Contrato

### Via Sei Explorer
1. Acesse: https://seitrace.com
2. Cole o endereço do contrato
3. Verifique o deployment

### Via Script
```bash
# Verificar informações básicas
npx hardhat console --network seitestnet
```

## 🎯 Integração com Frontend

### Endereço do Contrato
```javascript
const ORACLE_CONTRACT_ADDRESS = "0x..."; // Endereço obtido no deploy
```

### ABI (será gerada automaticamente)
```javascript
import { CommunitySignalOracle__factory } from '../typechain-types';
```

## 🐛 Troubleshooting

### Error: "insufficient funds"
- Verifique se tem SEI suficiente no testnet
- Use o faucet: https://faucet.sei-apis.com/

### Error: "nonce too high"
- Reset o nonce na sua wallet
- Ou aguarde alguns minutos

### Error: "replacement transaction underpriced"
- Aumente o gas price no hardhat.config.ts
- Ou aguarde a transação anterior ser processada

### Error: "contract creation code storage out of gas"
- Aumente o gasLimit no deploy script
- Ou simplifique o contrato se necessário

## 📝 Logs e Monitoramento

### Deployment Logs
Os logs de deployment são salvos automaticamente e incluem:
- Network information
- Contract address
- Deployer address
- Transaction hash
- Timestamp

### Monitoring
- Use Sei Explorer para monitorar transações
- Configure alertas se necessário

## 🔄 Re-deployment

### Se precisar fazer re-deploy:
```bash
# Limpe cache se necessário
npx hardhat clean
npx hardhat compile

# Deploy novamente
npm run deploy:oracle:testnet
```

### Update Frontend
Sempre atualize o endereço do contrato no frontend após re-deploy.

## 🎉 Próximos Passos

1. **Integrar com generateTop3SignalsAction**
2. **Configurar IPFS para CIDs reais**
3. **Testar publicação de signals**
4. **Setup monitoramento de eventos**
5. **Documentar API para dApps consumidores**
