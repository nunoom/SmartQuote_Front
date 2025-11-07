Perfeito, Reinaldo 👌
Aqui está a **documentação técnica completa formatada em Markdown (.md)** — ideal para incluir no repositório GitHub do projeto **SmartQuote / RICAS**.
A estrutura está organizada com **títulos hierárquicos**, blocos de código e tabelas compatíveis com o GitHub Markdown renderer.

---

````markdown
# 🧠 SmartQuote Agent — Documentação Técnica

**Versão:** v2.0  
**Equipa de Desenvolvimento:** Pão-Pão Quejo-Quejo  
**Organização:** RCS-Angola  
**Modelo de IA:** `ricas-agent02`  
**Última atualização:** Novembro 2025  

---

## 📌 1. Função Principal

O **SmartQuote Agent** é um agente inteligente de **cotação automatizada com IA integrada**, desenvolvido internamente pela **Equipa Pão-Pão Quejo-Quejo**.

Ele processa pedidos de orçamento via **e-mail, formulário ou API**, interpreta o texto usando **análise semântica**, consulta a base de dados de produtos e fornecedores, e gera uma **proposta comercial formatada em JSON**, pronta para envio automático ao cliente ou integração com o **ERP**.

---

## ⚙️ 2. Arquitetura Técnica

### 🧩 Stack e Componentes

| Camada | Tecnologia / Descrição |
|--------|-------------------------|
| **Backend principal** | Python + FastAPI |
| **Modelo de IA** | `ricas-agent02` (base Gemma3-27B) |
| **Banco de dados** | PostgreSQL |
| **Servidor ASGI** | Uvicorn |
| **Integração de IA** | Ollama API / Ricas-API |
| **Formatação e Data Handling** | Pandas |
| **Conexão DB** | Psycopg2 |
| **HTTP Requests** | Requests |

---

### 🌐 Endpoints Principais

| Endpoint | Método | Função |
|-----------|--------|--------|
| `/processar-requisicao` | POST | Recebe um pedido de cotação e gera JSON final |
| `/chat` | POST | Canal administrativo com histórico e consultas |
| `/health` | GET | Checagem de status da API e banco |
| `/` | GET | Metadados e informações gerais do agente |

---

## 🔄 3. Fluxo de Funcionamento

### 1️⃣ Entrada de Requisição  
Recebe **e-mails, formulários ou chamadas API** com pedidos de cotação.  
A IA interpreta automaticamente o texto e extrai:
- produto  
- quantidade  
- nome  
- e-mail  
- instruções especiais  

---

### 2️⃣ Análise Inicial (IA 1)  
A IA (`ricas-agent02`) interpreta o conteúdo textual e gera um **JSON intermediário** contendo:
- dados do cliente  
- produtos solicitados  
- contexto e instruções do pedido  

---

### 3️⃣ Execução de Consulta (DB Layer)  
O agente acessa o banco **PostgreSQL** e executa funções:

```python
get_products()             # lista detalhada de produtos
get_products_summary()     # resumo filtrado
listar_tabelas()           # estrutura de tabelas
````

---

### 4️⃣ Geração da Proposta Final (IA 2)

A IA cruza informações do pedido com o banco e gera a resposta final contendo:

* lista de produtos, quantidades, preços unitários e totais
* subtotal, taxas e valor final
* mensagem formal de resposta ao cliente

---

### 5️⃣ Revisão Automática

Se o `valor_final ≥ 2.000.000 Kz`, o agente marca `"revisao": true`
e envia um alerta interno para revisão humana via e-mail administrativo.

---

## 🔐 4. Segurança e Escalabilidade

* Autenticação via **token seguro** nos headers HTTP
* **Logs detalhados** de todas as requisições e interações com IA e banco
* Estrutura modular compatível com **microserviços e Docker**
* **Integração pronta** com ERP, BI e portais de fornecedores
* Pode operar **100% offline** em ambiente corporativo interno

---

## 🧩 5. O Modelo de IA — RICAS

### 🧠 Descrição Geral

O **RICAS** (*RCS Intelligent Cognitive Agent System*) é um modelo LLM proprietário da **RCS-Angola**, desenvolvido e treinado localmente com base em **Gemma3-27B**, ajustado para ambiente empresarial privado.

#### Totalmente local e offline

Nenhum dado é enviado para servidores externos — todo o processamento, fine-tune e inferência ocorrem **dentro da infraestrutura da RCS-Angola**, garantindo:

* **Autonomia tecnológica**
* **Privacidade**
* **Segurança total dos dados corporativos**

---

### ⚙️ Características Técnicas do Modelo RICAS

| Atributo                      | Descrição                                             |
| ----------------------------- | ----------------------------------------------------- |
| **Nome atual**                | `ricas-agent02`                                       |
| **Base**                      | Gemma3-27B (Google DeepMind)                          |
| **Treinamento adicional**     | Fine-tune interno supervisionado                      |
| **Ambiente de treino**        | Servidores Contabo (PyTorch + Ollama)                 |
| **Propriedade intelectual**   | 100% RCS-Angola                                       |
| **Capacidade contextual**     | 64k tokens                                            |
| **Suporte offline**           | Total                                                 |
| **Idiomas**                   | Português (foco Angola/PALOP), Inglês e Francês       |
| **Domínio de especialização** | Cotação, compras, logística e comunicação empresarial |

---

### 🔁 Aprendizado Contínuo

O RICAS utiliza um pipeline de aprendizado contínuo e incremental, onde as interações reais do SmartQuote são usadas (de forma **anonimizada**) para:

1. Identificar padrões e contextos frequentes
2. Reajustar pesos em microciclos de fine-tune
3. Gerar versões incrementais do modelo:

   * `ricas-agent02-ft-v1`
   * `ricas-agent02-ft-v2`
   * `ricas-agent02-ft-v3`

💡 Isso garante melhoria constante sem perda de controle e com **propriedade de dados 100% interna**.

---

### 🌍 Benefícios Estratégicos

* **Propriedade intelectual exclusiva** (datasets + pesos do modelo)
* **Segurança máxima**: sem dependência de APIs externas
* **Personalização total**: entende jargões, marcas e produtos locais
* **Ciclo de melhoria contínua** baseado em dados reais
* **Compliance total** com políticas e regulamentos internos

---

## 🧬 6. Processo de Fine-Tune

### 🎯 Objetivo

Ajustar o comportamento do RICAS para o domínio de **cotações empresariais**, garantindo precisão em **formato JSON** e **linguagem formal**.

### 📁 Fontes de Dados

* Histórico de propostas e e-mails reais
* Catálogos técnicos de produtos RCS
* Logs anonimizados de conversas e solicitações

---

### ⚙️ Etapas

1. **Coleta e limpeza dos dados** — remoção de redundâncias e erros
2. **Formatação em instruções JSON (prompt + resposta ideal)**
3. **Treinamento supervisionado local** — GPU servers RCS
4. **Validação automatizada** com cenários reais
5. **Deploy e versionamento** (`ricas-agent02-ft-vX`)

---

## 💬 7. Perguntas e Respostas (Q&A)

### ❓1. Como o SmartQuote sabe quando enviar uma cotação para revisão?

> Se `valor_final ≥ 2.000.000 Kz`, o agente define `"revisao": true` e envia alerta ao gestor.

---

### ❓2. O agente precisa de intervenção humana?

> Não. Ele é autônomo, apenas solicita revisão em casos de valor alto ou inconsistência.

---

### ❓3. Como o SmartQuote encontra os preços?

> Consulta as tabelas `Product` e `Supplier` no PostgreSQL, recuperando preços base e disponibilidade.

---

### ❓4. Qual é o formato final da resposta?

```json
{
  "isvalide": true,
  "revisao": false,
  "conteudo": {
    "nome": "Cliente",
    "produto": "Item solicitado",
    "email_cliente": "email@dominio.com",
    "resposta_email": {
      "assunto": "Proposta Comercial",
      "corpo": "Mensagem formal com detalhes"
    },
    "produtos": [
      { "nome": "Produto A", "quantidade": "2", "preco_unitario": "35000", "valor_total": "70000" }
    ],
    "subtotal": "70000",
    "taxas": "0.00",
    "valor_final": "70000"
  }
}
```

---

### ❓5. Como o fine-tune melhora a IA?

> O modelo é treinado com dados reais da RCS, aprimorando:
>
> * Compreensão semântica
> * Linguagem formal empresarial
> * Coerência e formatação JSON

---

### ❓6. O modelo RICAS tem aprendizado contínuo?

> Sim. Aprende de forma incremental a partir das interações (anonimizadas), garantindo privacidade e evolução constante.

---

### ❓7. A RCS controla todo o modelo?

> Sim. A RCS detém **100% da propriedade intelectual**, desde o dataset até o deploy.

---

### ❓8. O SmartQuote funciona sem Internet?

> Sim. É **totalmente self-hosted**, podendo operar em servidores locais com PostgreSQL e modelo RICAS, sem dependências externas.

---

## 🧾 Histórico de Versões

| Versão | Descrição                                  |
| ------ | ------------------------------------------ |
| `v1.0` | Base de cotação + revisão automática       |
| `v1.1` | Integração ERP + BI + logs avançados       |
| `v2.0` | Aprendizado contínuo e adaptativo completo |

---

📄 **Documento gerado automaticamente a partir do ficheiro original (sem alterações de conteúdo).**
© 2025 — **RCS-Angola / Equipa Pão-Pão Quejo-Quejo**

```

---
