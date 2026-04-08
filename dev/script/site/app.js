// Configurações do repositório (ajuste se o repo mudar)
const repoOwner = 'Laboratorio-de-Analise-de-Dados';
const repoName = 'disciplina_python_basico';

// assignments are loaded per-student from assignments.json

// Load students from students.json
const studentsGrid = document.getElementById('students-grid');
let students = [];
fetch('students.json')
  .then(r => r.json())
  .then(data => {
    students = data;
    students.forEach((s, idx) => {
      const card = document.createElement('div');
      card.className = 'student-card';
      card.tabIndex = 0;
      card.dataset.index = idx;
      const initials = s.name.split(' ').slice(0,2).map(n=>n[0]||'').join('').toUpperCase().slice(0,2);

      const avatar = document.createElement('div'); avatar.className='avatar'; avatar.textContent = initials;
      const info = document.createElement('div'); info.className = 'info';
      const nameEl = document.createElement('div'); nameEl.className='student-name'; nameEl.textContent = s.name;
      const linkEl = document.createElement('div'); linkEl.className='student-link'; linkEl.textContent = s.url.replace('https://github.com/','');
      info.appendChild(nameEl); info.appendChild(linkEl);

      // simple banner: avatar + info + chevron (no badges shown on main page)
      const chevron = document.createElement('div'); chevron.className='chevron'; chevron.textContent = '›';
      card.appendChild(avatar);
      card.appendChild(info);
      card.appendChild(chevron);
      card.addEventListener('click', () => { window.location.href = `student.html?idx=${idx}`; });
      card.addEventListener('keypress', (e) => { if(e.key === 'Enter') window.location.href = `student.html?idx=${idx}`; });
      studentsGrid.appendChild(card);
    });

    // search (filters cards in the grid)
    const search = document.getElementById('search');
    search.addEventListener('input', (e)=>{
      const q = e.target.value.toLowerCase().trim();
      Array.from(studentsGrid.children).forEach(card=>{
        const name = card.querySelector('.student-name').textContent.toLowerCase();
        const handle = card.querySelector('.student-link').textContent.toLowerCase();
        const show = name.includes(q) || handle.includes(q);
        card.style.display = show ? '' : 'none';
      });
    });

    // export CSV
    const exportBtn = document.getElementById('export-btn');
    exportBtn.addEventListener('click', async () => {
      const assignments = await fetch('assignments.json').then(r=>r.json());
      const rows = [];
      // header
      const header = ['student','github','assignment_id','assignment_title','status','reviewer','canReview'];
      rows.push(header.join(','));
      students.forEach((s, i) => {
        const key = `student_status_${i}`;
        const raw = localStorage.getItem(key);
        let state = {};
        try{ state = raw ? JSON.parse(raw) : {}; }catch(e){}
        assignments.forEach(a => {
          const st = state[a.id] || {};
          const status = st.status || '';
          const reviewer = st.reviewer || '';
          const canReview = st.canReview ? 1 : 0;
          rows.push([`"${s.name.replace(/"/g,'""') }"`, s.url, a.id, `"${a.title.replace(/"/g,'""') }"`, `"${status}"`, `"${reviewer.replace(/"/g,'""') }"`, canReview].join(','));
        });
      });
      const csv = rows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'submissoes_export.csv'; document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });

    // export only students/tasks where canReview == true
    const exportReviewersBtn = document.getElementById('export-reviewers-btn');
    exportReviewersBtn.addEventListener('click', () => {
      // open the reviewers page in a new tab (it will read localStorage and render the list)
      window.open('reviewers.html', '_blank');
    });
  })
  .catch(err => {
    console.error('Falha ao carregar students.json', err);
    if(studentsGrid) studentsGrid.innerHTML = '<div class="muted">Não foi possível carregar a lista de alunos.</div>';
  });

function buildIssueUrl(title, body, labels = ['submission']){
  const base = `https://github.com/${repoOwner}/${repoName}/issues/new`;
  const params = new URLSearchParams();
  params.set('title', title);
  params.set('body', body);
  if(labels.length) params.set('labels', labels.join(','));
  return `${base}?${params.toString()}`;
}
