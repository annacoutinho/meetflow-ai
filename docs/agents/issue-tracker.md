# Issue tracker: Local Markdown

Todas as operações do tracker são arquivos locais versionados neste repositório. Serviço externo: nenhum.

- Uma pasta por fase: `.scratch/<fase>/`.
- Spec: `.scratch/<fase>/spec.md`.
- Tickets: `.scratch/<fase>/issues/<NN>-<nome>.md`, um arquivo por ticket, numeração a partir de `01`, dependências antes dos dependentes.
- Retrospectiva: `.scratch/<fase>/retro.md`.
- Entrevistas, decisões e evidências complementares ficam na pasta da fase. Decisões arquiteturais duradouras podem ser registradas em `docs/adr/` e referenciadas pelo spec.
- Cada ticket contém objetivo, escopo, dependências explícitas, critérios de aceite, verificações e `Status: todo|in_progress|blocked|done`.
- `Blocked by:` referencia os caminhos dos tickets necessários; `done` em todos eles libera o ticket. Ausência de dependências deve ser explícita.
- Resultados, limitações e comentários são acrescentados no próprio ticket, preservando o registro anterior.

“Publicar no tracker” significa escrever um arquivo aqui. “Buscar ticket” significa ler o arquivo local completo. Nunca traduza essas operações para comandos de GitHub, GitLab ou outro serviço.

Estados de execução acima prevalecem sobre os exemplos das skills. Labels de triagem são metadados separados (`Triage:`), nunca substitutos de `Status:`. Use o vocabulário aprovado em [triage-labels.md](triage-labels.md).

Inclua estes arquivos nos commits locais. Se uma regra de ignore vier a excluí-los, ajuste apenas o necessário para versionar a documentação da fase, preservando exclusões de segredos e arquivos temporários.
