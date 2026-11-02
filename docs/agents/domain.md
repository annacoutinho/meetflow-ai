# Documentação de domínio

Use inicialmente um contexto: `CONTEXT.md` na raiz e decisões duradouras em `docs/adr/`. Esta é a convenção da versão instalada das skills. A fonte oficial consultada em 2026-11-02 já usa `GLOSSARY.md`; não renomear arquivos nem atualizar skills implicitamente. Se existir um glossário nessa convenção mais nova, consultá-lo e escolher uma única fonte canônica antes de escrever definições duplicadas.

Antes de explorar, leia o glossário existente e os ADRs pertinentes. Se existir `CONTEXT-MAP.md` ou `GLOSSARY-MAP.md`, leia os contextos relevantes. A ausência desses documentos não impede a investigação.

Crie o glossário somente quando termos forem decididos na entrevista; ele descreve o domínio, não a implementação. Registre ADRs apenas para decisões difíceis de reverter, surpreendentes sem contexto e resultantes de uma escolha real entre alternativas. Demais decisões ficam no spec da fase. Divergências com código ou ADRs devem ser expostas ao usuário.
