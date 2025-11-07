# Integração RICAS - SmartQuote Frontend

## 📌 Visão Geral

O RICAS (RCS Intelligent Cognitive Agent System) está integrado na página `/assistant` do SmartQuote Frontend, permitindo conversas em tempo real com a IA para consultas sobre cotações, produtos, fornecedores e análises.

## 🔗 Endpoint API

**URL Base:** Configurada via variável de ambiente `NEXT_PUBLIC_RICAS_API_URL`

### Configuração

Adicione no arquivo `.env.local`:
```bash
NEXT_PUBLIC_RICAS_API_URL=https://linxsf-smartquote.hf.space
```

### POST /chat

**Descrição:** Envia uma mensagem para o RICAS e recebe uma resposta contextualizada.

**Request Body:**
```json
{
  "mensagem": "Sua pergunta aqui",
  "nome": "Nome do usuário"
}
```

**Response:**
```json
{
  "resposta": "Resposta do RICAS"
}
```

**Possíveis campos de resposta:**
- `resposta`, `response`, `message` ou `resultado`: Contém o texto da resposta do assistente

## 💻 Implementação Frontend

### Localização
- **Arquivo:** `/app/assistant/page.tsx`
- **Rota:** `/assistant`

### Funcionalidades Implementadas

1. **Chat Interface Completa**
   - Interface de mensagens estilo chat moderno
   - Mensagens do usuário alinhadas à direita
   - Mensagens do assistente alinhadas à esquerda com avatar
   - Auto-scroll para última mensagem

2. **Integração API Real**
   ```typescript
   const ricasApiUrl = process.env.NEXT_PUBLIC_RICAS_API_URL || 'https://linxsf-smartquote.hf.space';
   
   const response = await fetch(`${ricasApiUrl}/chat`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json',
     },
     body: JSON.stringify({
       mensagem: currentInput,
       nome: user?.name || user?.email || 'Usuário',
     }),
   });
   ```

3. **Tratamento de Erros**
   - Exibe mensagem amigável em caso de erro
   - Toast de erro para feedback visual
   - Log de erros no console para debug

4. **Estados de Carregamento**
   - Indicador visual durante processamento (spinner)
   - Desabilita input durante carregamento
   - Previne múltiplas requisições simultâneas

5. **Recursos Extras**
   - Botão "Limpar Conversa" para resetar chat
   - Suporte a Enter para enviar (Shift+Enter para nova linha)
   - Timestamps em todas as mensagens
   - Mensagem de boas-vindas automática

### Mensagem Inicial

A RICAS se apresenta com:
```
Olá! Sou a RICAS (RCS Intelligent Cognitive Agent System), 
sua assistente inteligente de cotações da RCS-Angola. 

Posso ajudá-lo com:
• Consultas sobre produtos e fornecedores
• Análise de cotações e propostas
• Informações sobre preços e disponibilidade
• Estatísticas e relatórios
• Processamento de pedidos

Como posso ajudá-lo hoje?
```

## 🎨 Interface

### Componentes Visuais
- **Avatar do Bot:** Ícone Bot do Lucide React
- **Avatar do Usuário:** Ícone User do Lucide React
- **Cores:** Gradiente azul-roxo para destaque
- **Loading State:** Spinner animado durante processamento
- **Toast Notifications:** Feedback de ações (erro, sucesso)

### Layout Responsivo
- Desktop: Sidebar fixa + área de chat
- Mobile: Menu hambúrguer + chat full-screen

## 🔧 Manutenção

### Para Alterar a Mensagem Inicial
Edite o estado inicial em `/app/assistant/page.tsx`:
```typescript
const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    role: 'assistant',
    content: 'Sua nova mensagem aqui...',
    timestamp: new Date(),
  },
]);
```

### Para Adicionar Histórico Persistente
Implemente localStorage:
```typescript
useEffect(() => {
  const saved = localStorage.getItem('ricas-chat-history');
  if (saved) {
    setMessages(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  localStorage.setItem('ricas-chat-history', JSON.stringify(messages));
}, [messages]);
```

### Para Adicionar Autenticação na API
Adicione header de autorização:
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
},
```

## 📊 Modelo de Dados

### Interface Message
```typescript
interface Message {
  id: string;          // Timestamp único
  role: 'user' | 'assistant';  // Papel na conversa
  content: string;     // Conteúdo da mensagem
  timestamp: Date;     // Data/hora da mensagem
}
```

## 🚀 Melhorias Futuras

1. **Histórico Persistente**
   - Salvar conversas no localStorage ou backend
   - Recuperar conversas anteriores

2. **Markdown Support**
   - Renderizar respostas formatadas com markdown
   - Suporte a listas, tabelas, código

3. **Anexos**
   - Upload de arquivos para análise
   - Compartilhamento de cotações

4. **Contexto Enriquecido**
   - Passar informações do usuário logado
   - Incluir dados de cotações recentes

5. **Sugestões Rápidas**
   - Botões com perguntas frequentes
   - Auto-complete de produtos/fornecedores

6. **Feedback de Qualidade**
   - Botões 👍/👎 nas respostas
   - Enviar feedback para melhorar o modelo

## 📝 Notas Técnicas

- **CORS:** O endpoint precisa permitir requisições do domínio do frontend
- **Timeout:** Considere adicionar timeout para requisições longas
- **Rate Limiting:** Implemente controle de taxa se necessário
- **Cache:** Cache de respostas comuns pode melhorar performance

## 🔐 Segurança

- Nunca envie dados sensíveis sem criptografia
- Valide e sanitize input do usuário
- Implemente rate limiting para prevenir abuso
- Use HTTPS em produção

## 📚 Referências

- Documentação RICAS: `/docs/RICAS.md`
- API Endpoint: `https://linxsf-smartquote.hf.space`
- Modelo Base: Gemma3-27B (fine-tuned)
- Versão Atual: `ricas-agent02`

---

**Última atualização:** Novembro 2025
**Desenvolvido por:** RCS-Angola / Equipa Pão-Pão Quejo-Quejo
