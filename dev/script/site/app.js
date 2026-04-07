// Configurações do repositório (ajuste se o repo mudar)
const repoOwner = 'Laboratorio-de-Analise-de-Dados';
const repoName = 'disciplina_python_basico';

// Lista de tarefas/notebooks (caminhos relativos no repo)
const assignments = [
  { id: '04-ObjetosSimples', title: '04 - Objetos Simples', path: 'dev/script/aulas/práticas/04-ObjetosSimples.ipynb' },
  { id: '05-ObjetosCompostos1', title: '05 - Objetos Compostos 1', path: 'dev/script/aulas/práticas/05-ObjetosCompostos1.ipynb' },
  { id: '06-ObjetosCompostos2', title: '06 - Objetos Compostos 2', path: 'dev/script/aulas/práticas/06-ObjetosCompostos2.ipynb' },
  { id: '06-Pandas', title: '06 - Pandas', path: 'dev/script/aulas/práticas/06-Pandas.ipynb' },
  { id: '07-OperadoresAritmeticos', title: '07 - Operadores Aritméticos', path: 'dev/script/aulas/práticas/07-OperadoresAritmeticos.ipynb' },
  { id: '08-OperadoresRelacionais', title: '08 - Operadores Relacionais', path: 'dev/script/aulas/práticas/08-OperadoresRelacionais.ipynb' },
  { id: '09-OperadoresLogicos', title: '09 - Operadores Lógicos', path: 'dev/script/aulas/práticas/09-OperadoresLógicos.ipynb' },
  { id: '10-EstruturasCondicionais', title: '10 - Estruturas Condicionais', path: 'dev/script/aulas/práticas/10-EstruturasCondicionais.ipynb' },
  { id: '11-EstuturasRepeticao', title: '11 - Estruturas de Repetição', path: 'dev/script/aulas/práticas/11-EstuturasRepeticao.ipynb' },
  { id: '12-Rotinas', title: '12 - Rotinas', path: 'dev/script/aulas/práticas/12-Rotinas.ipynb' },
  { id: '13-VariaveisQualitativas', title: '13 - Variáveis Qualitativas', path: 'dev/script/aulas/práticas/13-VariáveisQualitativas.ipynb' },
  { id: '14-VariaveisQuantitativas', title: '14 - Variáveis Quantitativas', path: 'dev/script/aulas/práticas/14-VariáveisQuantitativas.ipynb' },
  { id: '15-TendenciaCentral', title: '15 - Tendência Central', path: 'dev/script/aulas/práticas/15-TendênciaCentral.ipynb' },
  { id: '16-VarianciaPratica', title: '16 - Variância Prática', path: 'dev/script/aulas/práticas/16-VariânciaPrática.ipynb' }
];

const select = document.getElementById('assignment-select');
assignments.forEach(a => {
  const opt = document.createElement('option');
  opt.value = a.id;
  opt.textContent = `${a.title} — ${a.path}`;
  select.appendChild(opt);
});

const form = document.getElementById('submission-form');
const openIssuesLink = document.getElementById('open-issues');
openIssuesLink.href = `https://github.com/${repoOwner}/${repoName}/issues?q=is%3Aissue+label%3Asubmission`;

function buildIssueUrl(title, body, labels = ['submission']){
  const base = `https://github.com/${repoOwner}/${repoName}/issues/new`;
  const params = new URLSearchParams();
  params.set('title', title);
  params.set('body', body);
  if(labels.length) params.set('labels', labels.join(','));
  return `${base}?${params.toString()}`;
}

function sanitize(s){
  return String(s).trim();
}

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const name = sanitize(document.getElementById('student-name').value);
  const url = sanitize(document.getElementById('repo-url').value);
  const assignmentId = document.getElementById('assignment-select').value;
  const assignment = assignments.find(a => a.id === assignmentId);
  if(!name || !url || !assignment) return alert('Preencha os campos.');

  const title = `Submissão: ${assignment.title} — ${name}`;
  const body = `Aluno: ${name}%0A\nArquivo/Repositório: ${url}%0A\nTarefa: ${assignment.path}%0A\n\n(Edite a issue se quiser adicionar mais detalhes)`;

  const issueUrl = buildIssueUrl(title, decodeURIComponent(body), ['submission']);
  // Abrir em nova aba
  window.open(issueUrl, '_blank');
});

// Cópia em Markdown para colar localmente ou em outro lugar
document.getElementById('copy-markdown').addEventListener('click', () => {
  const name = sanitize(document.getElementById('student-name').value);
  const url = sanitize(document.getElementById('repo-url').value);
  const assignmentId = document.getElementById('assignment-select').value;
  const assignment = assignments.find(a => a.id === assignmentId);
  if(!name || !url || !assignment) return alert('Preencha os campos antes de copiar.');
  const md = `**Submissão**: ${assignment.title}\n**Aluno**: ${name}\n**Repositório/Arquivo**: ${url}\n**Caminho no repo**: ${assignment.path}`;
  navigator.clipboard.writeText(md).then(() => {
    alert('Markdown copiado para a área de transferência.');
  }, () => alert('Não foi possível copiar.'));
});
