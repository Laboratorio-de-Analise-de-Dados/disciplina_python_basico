// Configurações do repositório (ajuste se o repo mudar)
const repoOwner = 'Laboratorio-de-Analise-de-Dados';
const repoName = 'disciplina_python_basico';

// Lista de tarefas/notebooks (caminhos relativos no repo)
const assignments = [
  { id: '02-Introducao', title: '02 - Introdução', path: 'dev/script/aulas/teóricas/02-Introdução_algoritmos_2_2026-03-19.ipynb' },
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

// build assignments UI in panel
const tasksContainer = document.getElementById('tasks-checks');
assignments.forEach(a => {
  const div = document.createElement('label');
  div.className = 'task-check';
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.value = a.id;
  const span = document.createElement('span');
  span.textContent = a.title;
  div.appendChild(cb);
  div.appendChild(span);
  tasksContainer.appendChild(div);
});

// Load students from local file list (embedded or fetched)
const studentsRaw = `
1. Guilherme/Disciplina - https://github.com/Laboratorio-de-Analise-de-Dados/disciplina_python_basico.git
2. Alessandra Conti Gomes de Souza - https://github.com/alecgsbr-web/Aula-Phyton
3. Aline de Carvalho - https://github.com/aline-bio/python-basico.git
4. Bianca Nichele Kusma - https://github.com/biancankusma/python_basico.git
5. Camilla Leitzke Toledo - https://github.com/camilaltoledo0502-art/Entregas-de-atividades-aula-Python-.git
6. Camilla Maia Moraes - https://github.com/camss36/Python_b-sico_Camilla_Maia.git
7. Carolina Zem - https://github.com/zemsacional/Aulas_Python
8. Emanuele Oliveira Jarno - https://github.com/emanuelejarno/Aula-de-mestrado
9. Gabriela Maria da Costa Ferreira - https://github.com/GbrielaMaria/Python
10. Gabriela Marino Koerich - https://github.com/GabrielaKoerich/Mestrado-Python-Basico
11. Hector Hugo Furini - https://github.com/hector-furini/Disciplina-PBp-Python
12. Isabel de Farias Ribeiro - https://github.com/isabeldfribeiro/Disciplina_python
13. Isadora Celine Rodrigues Carneiro Camargo - https://github.com/isacarneiro/python_basic_2026
14. Julia Cardoso da Silva - https://github.com/cardosojulias/Mestrado_python_julia
15. Julia Weber Ferraboli - https://github.com/jwferraboli/aulagithub.git
16. Livia Mendes Zacharow Pedroso - https://github.com/Livia-Zacharow/aulas_python_doutorado.git
17. Lucas Herrero Matias - https://github.com/lherreromatias/Disciplina_pyton
18. Mario Kujbida - https://github.com/Mario-Kujbida/Python-B-sico.git
19. Mateus Marchetto - https://github.com/marchettom/Disciplina-Python
20. Matheus Schipanski - https://github.com/matcow/Aula-Python
21. Natália Jeanegitz da Silva - https://github.com/njeanegitz/aula-python.git
22. Natalia Zureck Xavier - https://github.com/NataliaZureck/AulaPythonBasico.git
23. Nicholas Yuri Naufal - https://github.com/nicholasynaufal/Disciplina_Python.git
24. Paulo Henrique Moro dos Santos - https://github.com/paulo-moro/disciplina_python_doc
25. Rafael Uhlik Veiga - https://github.com/R-Zurik/Projeto-Inicial-Teste
26. Rodrigo Alexandre Lusa - https://github.com/Rodrigo-Lusa/aulas_python_mestrado.git
27. Sophia Pereira Ozorio - https://github.com/SophiaOzorio/mestrado_python
28. Thais Agata Veiga Ferreira - https://github.com/tveigaferreira-hue/phyton-.git
29. Yasmin Soares - https://github.com/yasminsoares01/aulas-Phyton
`;

function parseStudents(raw){
  const lines = raw.split(/\n+/).map(l => l.trim()).filter(Boolean);
  return lines.map(line => {
    const m = line.match(/^[0-9]+\.\s*(.*?)\s*-\s*(https?:\/\/\S+)$/);
    if(m) return { name: m[1].trim(), url: m[2].trim() };
    return null;
  }).filter(Boolean);
}

const students = parseStudents(studentsRaw);
const studentsList = document.getElementById('students-list');
students.forEach((s, idx) => {
  const li = document.createElement('li');
  li.className = 'student-item';
  li.tabIndex = 0;
  li.dataset.index = idx;
  li.innerHTML = `<div><div class="student-name">${s.name}</div><div class="student-link">${s.url.replace('https://github.com/','')}</div></div><div>›</div>`;
  li.addEventListener('click', () => openStudentPanel(idx));
  li.addEventListener('keypress', (e) => { if(e.key === 'Enter') openStudentPanel(idx); });
  studentsList.appendChild(li);
});

// panel logic
const panel = document.getElementById('student-panel');
const panelName = document.getElementById('panel-name');
const panelGithub = document.getElementById('panel-github');
const closePanelBtn = document.getElementById('close-panel');
function openStudentPanel(i){
  const s = students[i];
  panelName.textContent = s.name;
  panelGithub.href = s.url;
  panelGithub.textContent = s.url;
  panel.style.display = 'block';
  panel.setAttribute('aria-hidden','false');
  // reset checks
  document.querySelectorAll('#tasks-checks input[type=checkbox]').forEach(cb => cb.checked = false);
  panel.dataset.current = i;
}
closePanelBtn.addEventListener('click', () => { panel.style.display = 'none'; panel.setAttribute('aria-hidden','true'); });

function buildIssueUrl(title, body, labels = ['submission']){
  const base = `https://github.com/${repoOwner}/${repoName}/issues/new`;
  const params = new URLSearchParams();
  params.set('title', title);
  params.set('body', body);
  if(labels.length) params.set('labels', labels.join(','));
  return `${base}?${params.toString()}`;
}

document.getElementById('panel-open-issues').addEventListener('click', () => {
  const idx = panel.dataset.current;
  if(idx == null) return alert('Selecione um aluno.');
  const s = students[idx];
  const checked = Array.from(document.querySelectorAll('#tasks-checks input:checked')).map(cb => cb.value);
  if(checked.length === 0) return alert('Marque pelo menos uma tarefa.');

  // abrir uma issue por tarefa marcada
  checked.forEach(id => {
    const a = assignments.find(x => x.id === id);
    const title = `Submissão: ${a.title} — ${s.name}`;
    const body = `Aluno: ${s.name}%0A\nRepositório/Arquivo: ${s.url}%0A\nTarefa: ${a.path}%0A\n\n(Registro via site)`;
    const url = buildIssueUrl(title, decodeURIComponent(body), ['submission']);
    window.open(url, '_blank');
  });
});

document.getElementById('panel-copy').addEventListener('click', () => {
  const idx = panel.dataset.current;
  if(idx == null) return alert('Selecione um aluno.');
  const s = students[idx];
  const checked = Array.from(document.querySelectorAll('#tasks-checks input:checked')).map(cb => assignments.find(a => a.id === cb.value).title);
  if(checked.length === 0) return alert('Marque pelo menos uma tarefa.');
  const md = `**Aluno**: ${s.name}\n**Repositório**: ${s.url}\n**Tarefas enviadas**:\n- ${checked.join('\n- ')}`;
  navigator.clipboard.writeText(md).then(() => alert('Resumo copiado')).catch(()=>alert('Não foi possível copiar'));
});
