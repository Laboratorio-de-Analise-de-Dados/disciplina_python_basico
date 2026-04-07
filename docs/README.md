# Site de submissões (estático)

Esta pasta contém um site estático simples para registrar submissões de alunos do curso "Disciplina Python Básico".

Objetivo
- Permitir que alunos registrem que fizeram upload de uma tarefa no GitHub, abrindo uma *Issue* pré-preenchida no repositório do curso.
- Fornecer instruções aos monitores para usar as Issues como registro colaborativo e marcar correções.

Como funciona (fluxo recomendado)
1. O aluno abre esta página (quando publicada) e preenche: nome, link do repositório/arquivo, e seleciona a tarefa.
2. Ao clicar em "Abrir Issue pré-preenchida" será aberta a página de criação de issue no repositório com o título e corpo preenchidos. O aluno confirma a criação da issue.
3. Os monitores consultam as issues do repositório filtrando por <code>label:submission</code>. Quando corrigirem, adicionam o label <code>corrected</code> (ou outro fluxo que prefiram).

Vantagens
- Não é necessário backend — usa Issues do GitHub como repositório de registro.
- Fácil de auditar: histórico, comentários e labels ficam na interface do GitHub.

Limitações
- Gera um registro centralizado somente se os alunos criarem a issue (eles precisam estar logados no GitHub). O site apenas pré-preenche o formulário de criação de issue.
- Se quiser persistência automática (sem exigir que o aluno finalize a criação da issue), será necessário um backend ou usar GitHub Actions + token (implica gerenciar credenciais/secrets).

Publicar com GitHub Pages
Opções:

- Mover os arquivos para a pasta `/docs` do repositório e configurar GitHub Pages para servir a partir da branch `main` e a pasta `/docs`.
  Exemplo de comandos:

  ```bash
  # a partir da raiz do repositório
  mkdir -p docs
  rsync -av --exclude='.git' dev/script/site/ docs/
  git add docs
  git commit -m "Publicar site de submissões em /docs"
  git push
  ```

- Ou, publicar usando a branch `gh-pages` (recomendado se preferir manter arquivos fora do root/docs). Há ferramentas (ex: gh-pages npm package) que fazem deploy automático.

Notas finais
- O repositório usado para as Issues é: `Laboratorio-de-Analise-de-Dados/disciplina_python_basico`. Se for outro, edite `app.js` e altere `repoOwner`/`repoName`.
- Esta implementação é deliberadamente simples e segura (sem tokens embutidos). Se quiser, posso estender para: formulário que abre Pull Requests, integração com Google Forms, ou um workflow automático via GitHub Actions (requer setup de secret/token). 
