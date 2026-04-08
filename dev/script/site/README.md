# Painel de submissões (monitores)

Esta pasta contém um site estático minimalista para os monitores registrarem rapidamente quais tarefas cada aluno enviou.

Principais funcionalidades
- Lista de alunos (pré-carregada a partir de `dev/script/alunos/GitHub_Alunos.txt`).
- Ao clicar num aluno abre-se um painel com checkboxes para cada tarefa; o monitor marca as tarefas enviadas.
- Para cada tarefa marcada é possível abrir uma Issue pré-preenchida no repositório do curso (útil para manter um registro) ou copiar um resumo em Markdown.

Tarefas incluídas
- 02 - Introdução
- 04 - Objetos Simples
- 05 - Objetos Compostos 1
- 06 - Objetos Compostos 2
- 06 - Pandas
- 07 - Operadores Aritméticos
- 08 - Operadores Relacionais
- 09 - Operadores Lógicos
- 10 - Estruturas Condicionais
- 11 - Estruturas de Repetição
- 12 - Rotinas
- 13 - Variáveis Qualitativas
- 14 - Variáveis Quantitativas
- 15 - Tendência Central
- 16 - Variância Prática

Como publicar
1) Copiar os arquivos para `docs/` e ativar GitHub Pages em `main` → `/docs`.
2) Ou usar uma branch `gh-pages` com os arquivos estáticos.


Observações
- O site salva o estado de "Disponível para correção" e "Corrigido pelos monitores" no navegador do usuário usando localStorage (portanto, as marcações são locais ao navegador e máquina em que o monitor as fez).
- Se quiser registro centralizado das marcações (visível para outros monitores), será necessário um backend ou integração com Issues/Actions.

Personalização
- Para alterar o repositório onde as Issues serão criadas, edite `repoOwner` e `repoName` em `app.js`.
- A lista de alunos está agora em `students.json`. Se preferir que seja carregada diretamente do arquivo `dev/script/alunos/GitHub_Alunos.txt`, posso alterar para um fetch dinâmico.

