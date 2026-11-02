# Workflow local por fases e tickets

Aplica-se a este projeto e às próximas tarefas. Tracker e caminhos: [issue-tracker.md](issue-tracker.md). Estas instruções expressam as decisões do usuário e prevalecem sobre padrões incompatíveis das skills. A proposta inicial de helpdesk/Jurídico foi substituída pelo briefing de MeetFlow AI. Para a fase `meetflow-mvp`, o usuário autorizou explicitamente concluir autonomamente sem novas confirmações, usando Gemini gratuito, sem billing nem deploy. Essa exceção dispensa as confirmações de entrevista, spec e tickets desta fase; não dispensa documentação, revisão, testes ou os limites de publicação.

## Preparação e retomada

Identifique a raiz Git, leia `AGENTS.md`, a configuração do tracker e a documentação de domínio. Confira status, branch, mudanças preexistentes e histórico antes de editar. Use uma branch local `codex/<fase>` por fase; nunca trabalhe diretamente na branch principal, descarte alterações ou reescreva histórico. Não troque de branch se isso colocar trabalho preexistente em risco.

Confira as skills instaladas antes de instalar. Baixe somente as ausentes de `https://github.com/mattpocock/skills`; preserve instalações e o repositório original de configuração, incluindo arquivos, branches e histórico. Registre o resultado e links em `docs/agents/setup.md`. Não altere outros projetos ou configurações globais além do necessário à instalação autorizada.

## 1. /grill-with-docs

Leia e aplique `grill-with-docs`, `grilling` e `domain-modeling`. Investigue dúvidas técnicas no projeto. Entreviste em rodadas de perguntas numeradas `Q1`, `Q2` etc., com recomendação em cada uma. Pergunte apenas decisões cujas premissas já estejam resolvidas; aguarde as respostas antes de decidir os pontos abertos. Defina objetivo, escopo, restrições e critérios de aceite. Não escreva código da funcionalidade nesta etapa.

## 2. /to-spec

Após resolver a entrevista, consolide em `.scratch/<fase>/spec.md`: objetivo, escopo e exclusões, comportamento esperado, critérios de aceite verificáveis, decisões técnicas, contratos de API alterados, estratégia de testes, riscos, ativação e reversão. Inclua a estratégia de consultas, índices e impacto em rotas muito usadas quando pertinente. Aguarde aprovação explícita do spec antes de criar tickets ou implementar.

## 3. /to-tickets

Divida o spec aprovado em entregas pequenas e verificáveis individualmente, preferindo fatias verticais. Apresente a divisão e dependências para revisão do usuário conforme a skill, depois escreva um arquivo por ticket no tracker local. Inclua todos os campos definidos em `issue-tracker.md`. O último ticket é o de ativação e depende de todos os tickets necessários à liberação; permanece bloqueado enquanto faltar qualquer um deles.

## 4. /implement <caminho-do-ticket>

A primeira invocação autoriza continuar automaticamente pelos próximos tickets liberados da fase aprovada, um por vez, sem pedir autorização a cada ticket.

1. Leia o spec aprovado, o ticket e suas dependências. Comece somente quando elas estiverem `done`; marque `in_progress`.
2. Aplique `/tdd` aos comportamentos testáveis, nas interfaces acordadas, observando falha antes da correção. Registre justificativa para exceções.
3. Implemente somente o escopo aprovado. Funcionalidades novas começam desligadas por flag/configuração. Preserve comportamento e visual fora do escopo. Evite N+1 e avalie índices conforme as consultas.
4. Execute `/code-review` conforme a skill instalada, corrija achados e registre o resultado.
5. Execute lint, build e testes locais aplicáveis, usando os comandos reais do projeto. Registre comandos, resultados e limitações. Nunca declare uma verificação aprovada sem executá-la.
6. Se a validação depender de infraestrutura externa, registre a pendência e seu impacto nos critérios de aceite; não acione serviços externos. Resolva falhas locais no escopo. Pare apenas por impedimento real, informação exclusiva do usuário ou necessidade de mudar o escopo aprovado.
7. Marque `done` somente após satisfazer os critérios de aceite. Faça um commit local com código e documentação do ticket, incluindo spec e configuração pertinentes, sem incluir alterações alheias ou segredos.

## 5. Ativação e /retro

O último ticket prepara e valida localmente a ativação e a reversão. A conclusão desse preparo não autoriza ativação em produção. Registre em `.scratch/<fase>/retro.md` entregas, dificuldades, pendências e melhorias, e versione a retrospectiva localmente.

Prepare tudo que puder localmente e apresente ao final um pedido consolidado para as decisões externas realmente necessárias: merge, deploy, migrations ou ativação em produção. Não execute essas ações sem decisão explícita. A aprovação não autoriza push implicitamente.

## Limites e compatibilidade

Não faça push, abra PRs, crie issues externas, publique artefatos, acione CI remota ou altere remotes. Consultas e downloads das skills oficiais são a exceção autorizada de rede; conteúdo do projeto permanece local. Não grave segredos em código, documentação ou commits.

Quando não houver ferramenta nativa de invocação de skills, leia o `SKILL.md` e execute suas instruções equivalentes, informando essa diferença. Não afirme ter executado um comando indisponível. Configurações já decididas pelo usuário (Local Markdown, `AGENTS.md` e estes caminhos) dispensam repetir as perguntas padrão do setup. Registre diferenças de versão sem atualizar ou sobrescrever skills automaticamente.

## Fase meeting-assistant

O briefing de continuação autoriza evoluir o MVP existente sem recriá-lo, mantendo `codex/meetflow-mvp`. Escopo e decisões técnicas em `.scratch/meeting-assistant/spec.md`; tracker continua local. Não procurar credenciais em outros projetos. Chave Gemini somente em `.env.local` ignorado; teste real apenas se disponível com segurança. Nesta fase o Trello fica como adapter preparado, sem chamadas reais pelo agente nem criação automática de cards.

## Publicação autorizada pelo usuário

Em 2026-11-02, o usuário autorizou subir este projeto de forma separada e organizada para a conta GitHub `annacoutinho`. Isso permite o repositório dedicado MeetFlow AI e o envio separado do MVP e do trabalho parcial. Não autoriza deploy, billing, CI remota, conteúdo de outros projetos ou credenciais. Preservar histórico; não fazer force push.
