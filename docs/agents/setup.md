# Preparação das skills — 2026-11-02

## Repositório e estado inicial

Raiz confirmada por `git rev-parse --show-toplevel`: `C:/Users/anna.coutinho/Documents/ChatGPT/MeetFlow AI`.

Estado inicial: somente `.git`, nenhum arquivo rastreado, nenhuma alteração preexistente, branch inicial `master`, sem commits e sem remotes encontrados. Não havia `AGENTS.md`, `CLAUDE.md`, `.gitignore`, código, manifesto, specs ou tickets. O usuário confirmou na entrevista que o projeto será criado do zero aqui. Branch local criada: `codex/helpdesk-juridico`.

## Inventário e fonte oficial

As skills abaixo já estavam instaladas em `C:/Users/anna.coutinho/.codex/skills/`. Nenhuma skill nova foi instalada; nenhuma existente foi sobrescrita. Uma tentativa de instalação com o helper oficial do Codex terminou com `Destination already exists` no primeiro destino, sem instalar arquivos.

| Skill instalada | Fonte oficial |
| --- | --- |
| setup-matt-pocock-skills | https://github.com/mattpocock/skills/tree/main/skills/engineering/setup-matt-pocock-skills |
| grill-with-docs | https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs |
| to-spec | https://github.com/mattpocock/skills/tree/main/skills/engineering/to-spec |
| to-tickets | https://github.com/mattpocock/skills/tree/main/skills/engineering/to-tickets |
| implement | https://github.com/mattpocock/skills/tree/main/skills/engineering/implement |
| retro | https://github.com/mattpocock/skills/tree/main/skills/engineering/retro |

Também confirmadas no disco: `grilling`, `domain-modeling`, `tdd`, `code-review`, `writing-for-agents` e `triage`. O catálogo de skills da sessão não enumerava todas as pastas existentes; o inventário do disco foi necessário para conferir a instalação.

Fonte de referência consultada em modo leitura: https://github.com/mattpocock/skills. Nenhum conteúdo do projeto foi enviado ao repositório oficial.

## Configuração aplicada

- Tracker: exclusivamente Local Markdown, conforme `issue-tracker.md`.
- Fluxo desta tarefa e das próximas: `workflow.md`, referenciado por `AGENTS.md`.
- Convenções de domínio: `domain.md`; glossário e ADRs criados somente quando houver decisões.
- Estados de execução: `todo`, `in_progress`, `blocked`, `done`. Labels de triagem, se escolhidos, ficam separados do status.
- Vocabulário padrão de triagem aprovado pelo usuário, registrado em `triage-labels.md`, exclusivamente local.

## Compatibilidade e execução

Os seis nomes de comando solicitados têm `SKILL.md` local. Não há ferramenta nativa `Skill` exposta nesta sessão: a preparação e a entrevista são executadas lendo e seguindo as instruções dos arquivos, não por um comando slash de shell. As skills recém-descobertas podem exigir nova sessão para aparecer no catálogo; isso não impede a aplicação manual das instruções lidas.

A versão local de setup e domain-modeling usa `CONTEXT.md`; a fonte oficial atual consultada usa `GLOSSARY.md`. Foi preservada a convenção instalada e registrada a compatibilidade em `domain.md`; não houve atualização global.

O usuário já determinou tracker, caminhos, arquivo `AGENTS.md` e execução da preparação. Essas escolhas prevalecem sobre perguntas e confirmações padrão do setup. A aprovação do spec e a espera pelas respostas da entrevista permanecem obrigatórias.

## Validação e limites

Não existe aplicação ou comando de lint, build ou testes neste repositório inicial; essas validações não foram executadas nem declaradas aprovadas. Não foi criado spec, ticket ou código da funcionalidade durante a preparação. O fluxo está aguardando as decisões de produto na entrevista antes de decisões técnicas.
