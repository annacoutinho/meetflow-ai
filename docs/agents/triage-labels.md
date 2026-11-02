# Labels de triagem local

Vocabulário padrão aprovado pelo usuário em 2026-11-02:

| Papel | Label |
| --- | --- |
| Aguardando triagem | `needs-triage` |
| Informação insuficiente | `needs-info` |
| Pronto para execução pelo agente | `ready-for-agent` |
| Requer intervenção humana | `ready-for-human` |
| Não será realizado | `wontfix` |

Registre o label em `Triage:` no arquivo Markdown local quando necessário. O estado de execução continua sendo `Status: todo|in_progress|blocked|done`. Um label não libera dependências nem substitui aprovação do spec. Não crie labels em serviços externos.
