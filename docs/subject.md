# 🧩 Software Design Document  
## SmartQuote RCS  
### EXIJA SERVIÇOS  
### CLIENTES SÃO PARCEIROS DE VALOR ACRESCENTADO  

---

### 📅 Projeto
**Nome:** SmartQuote - RCS  
**Data:** 28 de maio de 2025  
**Requerente:** Manuel Correa (Diretor de Inteligência Operacional)  
**Responsável pela Elaboração:** Samuel Freitas (Gestor de Projetos)  

---

## 1. 🎯 Objetivo do Projeto
Automatizar e otimizar os processos de cotação e procurement através da integração de automação de IA com os sistemas internos da RCS e externos de fornecedores, promovendo **agilidade**, **rastreabilidade** e **escalabilidade** na resposta a propostas.

---

## 2. 🧱 Escopo

### 2.1 Funcionalidades previstas para a Fase 1:
- Integração e automação do sistema com IA.  
- Interface web para recepção, processamento e validação de pedidos de cotação (inputs) via e-mail ou formulário web.  
- Cotação automatizada com IA, utilizando base de dados de fornecedores e preços conhecidos.  
- Coleta e armazenamento das cotações geradas (com links e rastreabilidade).  
- Geração de logs de todos os processos e dashboards.  
- Controle de acesso de usuários e níveis de permissões (Ver, Editar).  
- Configuração de fluxo de validação de cotação com base em valores específicos (ex: > 2 milhões é validado por X).  
- Encaminhamento para revisão humana (alerta por e-mail), com opção de download antes do envio ao cliente (fora do sistema).  

---

## 3. ⚙️ Critérios de Requisitos

### 3.1 Requisitos Técnicos:
- Plataforma compatível com chamadas **HTTPS (REST API)**.  
- Formato **JSON** para entrada e saída de dados.  
- Logs de interação exportáveis (`.csv` ou via API).  
- Disponibilidade de **endpoints seguros e documentados**.  

### 3.2 Requisitos de Segurança:
- Autenticação por **token** para chamadas à API.  
- Registro de logs de acesso.  
- Rastreabilidade de decisões e sugestões geradas.  

---

## 4. 🔁 Fluxos do Sistema

1. E-mail cai na caixa do **quote**.  
2. Reencaminhamento do e-mail do quote para uma caixa configurada no sistema para disparar o fluxo de automação de cotação.  
3. Abertura de oportunidade e cotação no **Microsoft Dynamics 365**.  
4. Início do processamento da cotação com base nas pesquisas às bases de dados e preços conhecidos.  
5. **Caso OK →** Registrar logs de sucesso e seguir para o ponto 7.  
6. **Caso Not OK →** Registrar log de insucesso e alertar por e-mail.  
7. Exibir detalhes das cotações geradas, com opções de download e marcação como “enviado ao cliente”.  

**Previsão Total da Fase 1:** 1 mês  

---

## 5. 🚀 Possibilidades de Expansão
- Escalonamento para unidades **Energy**, **Printing** e **IT**.  
- Integração com **ERP** e **portais de fornecedores**.  
- Personalização de modelos de **IA** conforme o contexto da RCS.  
- Utilização de **Business Intelligence (BI)** para análise dos dados das propostas geradas.  

---
