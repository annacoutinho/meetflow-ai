# Instruções do projeto

## Agent skills

Para este projeto e as próximas tarefas, siga [o workflow por fases e tickets](docs/agents/workflow.md). Leia esse arquivo antes de planejar ou implementar. As decisões do usuário prevalecem sobre os padrões das skills. A fase atual é `meetflow-mvp`; suas autorizações específicas estão em `.scratch/meetflow-mvp/spec.md`.

### Issue tracker

Use exclusivamente Local Markdown em `.scratch/<fase>/`. Leia [as operações do tracker](docs/agents/issue-tracker.md) antes de usar setup, spec, tickets, implementação ou retro.

### Domain docs

Leia [as regras de documentação de domínio](docs/agents/domain.md) antes de explorar uma funcionalidade ou registrar decisões.

### Triage labels

Use os labels locais aprovados em [triage-labels.md](docs/agents/triage-labels.md), separados do status de execução dos tickets.

### Limites permanentes

Trabalhe em branch local por fase, nunca diretamente em `main` ou `master`. Preserve alterações preexistentes e o histórico. Código, configurações, decisões, specs, tickets e retrospectivas ficam neste repositório.

Não faça push, PRs, issues externas, publicação, CI remota ou alterações de remotes. A fonte das skills é somente para leitura; consultar e baixar skills oficiais é permitido. Não altere outros projetos ou configurações globais, salvo instalação estritamente necessária de skills.

Merge, deploy, migrations e ativação em produção exigem decisão explícita do usuário. Aprovação não autoriza push implicitamente. Nunca grave segredos em arquivos ou commits.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
