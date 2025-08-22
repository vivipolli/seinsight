## Community Signal Oracle (Sei)

### O que é
Publicação on-chain, na Sei, dos Top-3 sinais por janela (hashtags/tópicos com maior engajamento no X). Cada janela emite um evento com o período, os três sinais e o CID do lote de evidências no IPFS.

### Por que é melhor
- **Infra componível**: dApps na Sei podem consumir diretamente os sinais on-chain.
- **Transparente e verificável**: histórico público (tx) e lote de evidências (CID/IPFS).
- **Baixo esforço/custo**: contrato simples + job de publicação + UI com links.

### Como funciona (fluxo)
1. Coleta e ranking (off-chain, IA assistida): agregamos dados do X (simulado inicialmente) e ranqueamos os sinais.
2. Lote IPFS: geramos um JSON com evidências (ids, timestamps, métricas) e publicamos no IPFS → `CID`.
3. Publicação na Sei: emitimos um evento com `windowStart`, `windowEnd`, `top3Signals[]` e `cid`.
4. Consumo: a UI mostra sinais com links e verificação; dApps escutam eventos para compor alertas/dashboards.
5. Verificação: qualquer pessoa valida o `CID` no IPFS e o evento on-chain correspondente.

### Dados publicados (evento)
- `windowStart` / `windowEnd`: período da janela
- `top3Signals`: lista de 3 strings (hashtags/tópicos)
- `cid`: referência ao lote bruto (IPFS)
- `source` (opcional): "twitter"

### Exemplo de lote (IPFS)
```json
{
  "windowStart": 1719964800,
  "windowEnd": 1719968400,
  "source": "twitter",
  "signals": ["#Sei", "#Web3", "#AI"],
  "evidence": [
    {
      "tweetId": "17890123456789",
      "author": "@handle",
      "timestamp": 1719965100,
      "metrics": { "likes": 120, "retweets": 40, "replies": 8 },
      "excerpt": "Sei enabling composable on-chain signals..."
    }
  ]
}
```

### Integração com o que já temos
- Reutiliza a análise social existente para ranquear sinais.
- Adiciona publicação IPFS + evento na Sei e um painel de verificação no frontend.

### Roadmap rápido
- v1: Eventos com `top3Signals` + `cid` por janela.
- v1.1: Indicador de confiança (diversidade de fontes, engajamento).
- v1.2: Curadoria comunitária (attestations/micro-rewards).
- v2: SDK simples para consumo por dApps e parceiros.
