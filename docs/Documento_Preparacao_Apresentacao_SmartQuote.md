# Documento de preparação — Apresentação do projeto SmartQuote

**Objetivo:** fornecer roteiro completo para uma apresentação clara, confiável e sem surpresas do SmartQuote — cobrindo funcionalidades principais, estrutura de slides, fluxo de apresentação, e práticas para incorporar vídeos sem erros em apresentações ao vivo.

**Tempo total sugerido:** 12–20 minutos (pitch + demonstração curta). Ajuste conforme o tempo disponível.

---

## 1. Resumo executivo (1 slide)
- **Título:** "SmartQuote — Cotação inteligente para [segmento/cliente]"
- Uma frase de impacto: problema + solução em 10–12 palavras.
- Três bullets curtos: principal benefício (ex.: economia de tempo), público-alvo, estado do projeto (protótipo/produção).
- Visual: logotipo + screenshot da dashboard principal (1 imagem).
- Tempo: 60–90s
- Nota do apresentador: começar com um dado ou pergunta que prenda (ex.: "Quantas horas sua equipe gasta criando cotações?").

---

## 2. Problema e oportunidade (1 slide)
- **Título:** "O problema"
- Bullet points: dores do usuário, custos atuais, gaps nas soluções existentes.
- Visual: gráfico simples ou ilustração de fluxo manual.
- Tempo: 60s
- Nota: usar micro-história/cliente fictício para humanizar.

---

## 3. Solução (1 slide)
- **Título:** "Nossa solução"
- 3 bullets: o que o SmartQuote faz (geração automática, revisão por IA, workflow de aprovação).
- Visual: diagrama simplificado do fluxo SmartQuote (input → IA → aprovação → envio).
- Tempo: 60s

---

## 4. Funcionalidades principais (2–3 slides)
Sugestão de quebra por tema:

### Slide A — Core
- Geração automática de cotações (IA/ML), templates, personalização.
- Visual: screenshot do gerador de cotações.
- Tempo: 60s

### Slide B — Workflow e Aprovações
- Fluxo de aprovações, notificações, histórico.
- Visual: componente `approval-workflow-status` / diagrama.
- Tempo: 45s

### Slide C — Integrações & Analytics
- Integração com CRM/email, métricas de conversão, relatórios.
- Visual: gráficos de `revenue-chart`/`email-processing-stats`.
- Tempo: 45s

Notas do apresentador: para cada funcionalidade, mencionar benefício direto ao usuário e um exemplo real rápido.

---

## 5. Demonstração ao vivo / Vídeo da demo (1–2 slides + ação)
Opções:
- Demo ao vivo curta (máx 2–3 minutos) — preferível se a estabilidade for garantida.
- Vídeo gravado de 60–120s — preferível para reduzir risco.

Recomendações sobre onde colocar vídeos (detalhado na seção 7 abaixo).

**Slide:** "Demonstração"
- Um frame/thumbnail com botão "Play demo".
- Ao lado: passos cobertos na demo (ex.: "criar cotação → enviar para aprovação → gerar PDF").
- Tempo: 2–3 minutos (vídeo) ou 2–4 minutos (demo ao vivo).

Notas: preparar um "demo fallback" (vídeo curto + screenshots) caso o sistema esteja indisponível.

---

## 6. Resultados e métricas (1 slide)
- KPIs esperados: tempo reduzido por cotação, taxa de conversão, economia prevista.
- Se houver dados reais (teste piloto), incluir 2–3 métricas com gráficos.
- Tempo: 60–90s

---

## 7. Roadmap e próximos passos (1 slide)
- Curto prazo (3–6 meses): features prioritárias.
- Médio prazo (6–12 meses): integrações, escalabilidade.
- Time & recursos necessários.
- Tempo: 45s

---

## 8. Equipe e contato (1 slide)
- Fotos/nomes/funções (2–4 pessoas).
- Contato para follow-up.
- Tempo: 30s

---

## 9. Perguntas (1 slide)
- **Título:** "Perguntas"
- Fazer uma pergunta dirigida ao público para abrir Q&A, ou já ter 2 perguntas frequentes preparadas.
- Tempo sugerido: 3–5 minutos

---

## Estrutura sugerida de arquivos para a apresentação
- `slides/01_titulo.pdf` (ou `.pptx`)
- `slides/02_problema.pdf`
- ...
- `media/demo.mp4` (vídeo local curto)
- `media/demo-thumbnail.png`
- Mantenha uma cópia na nuvem (Google Drive/OneDrive) e num pendrive.

---

## Onde e como colocar vídeos para evitar erros em apresentação ao vivo (práticas recomendadas)

1. **Formato e compressão**
- Formato preferido: MP4 (H.264 codec, AAC áudio) — mais compatível.
- Resolução: 1080p é suficiente; 720p para reduzir tamanho se necessário.
- Duração: manter vídeos curtos (30–120s).
- Teste: reproduza o arquivo em VLC e no próprio PowerPoint/Keynote/Google Slides.

2. **Localização dos arquivos**
- Primário: vídeo embutido no arquivo de slides (`.pptx`) ou em PDF com link para player externo (nem todos os PDFs embutem vídeo).
- Backup 1: vídeo local em pasta `media/` (mesma máquina da apresentação).
- Backup 2: vídeo hospedado em link privado (YouTube não listado ou Google Drive) — não dependa somente de streaming (rede pode falhar).

3. **Estratégia de redundância no show**
- Embed + local + nuvem: embuta o vídeo no slide e também mantenha o arquivo local e um link na nuvem.
- Pré-carregamento: abra o arquivo de slides e teste o play; em navegadores, pre-carregue o vídeo antes de começar (carregar a aba/preview).
- Off-line: verifique que o player pode rodar sem internet (se for local).
- Thumbnail estático: sempre ter um slide com screenshot/thumbnail e instruções "Play demo (vídeo offline)", caso o vídeo não carregue.
- Link direto para o arquivo local: em PPT, links podem referenciar arquivos locais se necessário.

4. **Player e apresentação**
- Evite depender de players do navegador que dependam de codecs; preferir o player do próprio PowerPoint/Keynote ou um player local (VLC).
- Testar em modo "apresentação" na máquina real, com som e projetor.
- Se usar Google Slides, teste no navegador que será utilizado (mesma versão) e desative extensões que podem bloquear autoplay.

5. **Som**
- Garanta volume padrão e teste com microfone/alto-falantes reais.
- Se houver som crítico, adicionar legenda no vídeo e colocar indicação no slide.

6. **Prática de backup rápido**
- Atalho: se o vídeo falhar, mostrar screenshots sequenciais (slides) narrando o fluxo; ou abrir o vídeo local em VLC com Alt+Tab.
- Fale a linha de transição enquanto alterna para o backup para manter o público engajado.

7. **Checklist técnico para vídeos (pré-show)**
- Converter para MP4 H.264.
- Testar reprodução no PowerPoint/Keynote/VLC.
- Testar com projetor e resolução alvo.
- Confirmar áudio está ok (alto/baixa latência).
- Confirmar links da nuvem funcionam (e baixar offline se possível).

---

## Roteiro detalhado e notas do apresentador (por slide) — frases de exemplo

**Slide 1 (Título)**
- "Bom dia — somos o SmartQuote. Facilitamos a criação de cotações personalizadas com IA, reduzindo o tempo e aumentando conversões."

**Slide 2 (Problema)**
- "Atualmente, equipes gastam X horas por cotação e cometem erros manuais que atrasam vendas."

**Slide 3 (Solução)**
- "Com o SmartQuote, automatizamos a geração, revisamos por IA e integrarmos o fluxo de aprovação."

**Slide 4–6 (Funcionalidades)**
- "Aqui você vê como o gerador nos permite selecionar parâmetros e gerar cotações 10x mais rápido..."
- Transição para demo: "Agora vou mostrar um exemplo real — vídeo curto de 90 segundos."

**Slide Demo**
- "Este é um fluxo típico: criar -> aprovar -> enviar. Vamos assistir."

**Slide Resultados**
- "Em um piloto com X clientes, vimos Y% de redução no tempo de resposta."

**Slide Roadmap**
- "Nos próximos 6 meses planejamos integração com [CRM] e modularização de templates."

**Q&A**
- Ter 3 respostas prontas: segurança/dados, integração e pricing.

---

## Dicas práticas para minimizar riscos durante a apresentação
- Use vídeo curto e focado. Se for demo ao vivo, condense passos essenciais.
- Sempre ter o vídeo embutido e um arquivo local com o mesmo nome.
- Leve um pendrive com slides + vídeos. Tenha link na nuvem.
- Teste na máquina real e no projetor pelo menos 30–60 min antes.
- Se possível, levar sua própria máquina (não depender de hardware da casa).
- Desligar atualizações automáticas, notificações, e bloquear o screensaver.
- Deixar janelas de debug fechadas; usar um modo de apresentação com apenas slides visíveis.
- Ter um slide "fallback" com prints para narrar se o sistema cair.

---

## Checklist pré-apresentação (técnico rápido)
- [ ] Converter vídeo para MP4 H.264 e copiar para `media/demo.mp4`.
- [ ] Inserir vídeo embutido no `.pptx` e manter `media/` como backup local.
- [ ] Testar reprodução em modo apresentação (som + vídeo).
- [ ] Testar a apresentação em modo offline (sem internet).
- [ ] Verificar resolução do projetor/monitores (por ex. 1920x1080).
- [ ] Desativar notificações e bloqueios de tela.
- [ ] Ter pendrive com slides e vídeos.
- [ ] Ter link na nuvem e verificar permissões.
- [ ] Treinar transições e fala (cronômetro).

---

## Perguntas frequentes (pré-rotas de resposta rápida)
- **Segurança de dados?** R: criptografia em trânsito e em repouso; permissões por usuário.
- **Integração com CRM?** R: APIs REST e webhooks; roadmap para conectores nativos.
- **Preço?** R: modelo básico (ex.: por usuário / por número de cotações) — apresentar faixa.

---

## Apêndice — templates e recursos rápidos
- Nome do arquivo de vídeo recomendado: `media/demo_short_90s_h264.mp4`
- Thumbnail: `media/demo-thumbnail.png` (usado no slide / fallback)
- Script de backup: abrir `media/demo_short_90s_h264.mp4` em VLC e partilhar tela.

---

## Próximos passos
- Completar roteiro detalhado por slide (próxima tarefa na todo list).
- Preparar vídeo curto de demo e testá-lo em diferentes players.
- Montar checklist final e exportar PDF de apresentação.

---

*Arquivo gerado automaticamente: Documento de preparação para apresentação do SmartQuote.*
