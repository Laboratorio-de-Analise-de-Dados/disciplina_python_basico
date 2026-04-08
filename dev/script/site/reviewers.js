// reviewers.js - interactive page to list and edit tasks where canReview == true
(function(){
  const area = document.getElementById('results-area');
  const reviewers = ['', 'Jessica', 'Felipe', 'Metusalem', 'Guilherme'];
  const repoOwner = 'Laboratorio-de-Analise-de-Dados';
  const repoName = 'disciplina_python_basico';

  Promise.all([fetch('students.json').then(r=>r.json()), fetch('assignments.json').then(r=>r.json())])
    .then(([students, assignments]) => {
      // build a flattened list of entries where canReview might be true or you want to show all with ability to toggle
      const entries = [];
      students.forEach((s, idx) => {
        const key = `student_status_${idx}`;
        let state = {};
        try{ const raw = localStorage.getItem(key); state = raw ? JSON.parse(raw) : {}; }catch(e){}
        assignments.forEach(a => {
          const st = state[a.id] || {};
          // include all rows but highlight those with canReview; user wanted to edit reviewers here
          entries.push({ studentIdx: idx, studentName: s.name, github: s.url, assignmentId: a.id, assignmentTitle: a.title, status: st.status||'falta', reviewer: st.reviewer||'', canReview: !!st.canReview });
        });
      });

      // show only entries where canReview is true
      const filtered = entries.filter(e => !!e.canReview);
      if(filtered.length === 0){
        area.innerHTML = '<div class="muted">Nenhuma tarefa marcada como "pode revisar".</div>';
        return;
      }

      // build table with editable controls
      const table = document.createElement('table');
      table.className = 'reviewers-table';
      table.style.width='100%';
      table.style.borderCollapse='collapse';
      const thead = document.createElement('thead');
      thead.innerHTML = '<tr style="text-align:left"><th style="padding:8px;border-bottom:1px solid #eef6ff">Pode revisar</th><th style="padding:8px;border-bottom:1px solid #eef6ff">Aluno</th><th style="padding:8px;border-bottom:1px solid #eef6ff">GitHub</th><th style="padding:8px;border-bottom:1px solid #eef6ff">Tarefa</th><th style="padding:8px;border-bottom:1px solid #eef6ff">Status</th><th style="padding:8px;border-bottom:1px solid #eef6ff">Revisor</th></tr>';
      table.appendChild(thead);
      const tbody = document.createElement('tbody');

  filtered.forEach(en => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #f1f5f9';

        // canReview checkbox
        const canTd = document.createElement('td'); canTd.style.padding='8px'; canTd.style.verticalAlign='middle';
        const canCb = document.createElement('input'); canCb.type='checkbox'; canCb.checked = !!en.canReview; canCb.dataset.idx = en.studentIdx; canCb.dataset.aid = en.assignmentId; canCb.dataset.kind='canreview';
        canCb.className = 'can-review-checkbox';
        canTd.appendChild(canCb);

        // student name + link to student page
        const nameTd = document.createElement('td'); nameTd.style.padding='8px';
        const nameA = document.createElement('a'); nameA.href = `student.html?idx=${en.studentIdx}`; nameA.textContent = en.studentName; nameA.className='link'; nameA.style.cursor='pointer';
        nameTd.appendChild(nameA);

        // github
        const ghTd = document.createElement('td'); ghTd.style.padding='8px'; ghTd.innerHTML = `<a href="${en.github}" target="_blank">${en.github.replace('https://github.com/','')}</a>`;

        // assignment
        const aTd = document.createElement('td'); aTd.style.padding='8px'; aTd.textContent = `${en.assignmentTitle} (${en.assignmentId})`;

        // status select
        const statusTd = document.createElement('td'); statusTd.style.padding='8px';
        const statusSel = document.createElement('select');
        [['falta','Falta revisar'], ['revisando','Em revisão'], ['revisado','Revisado']].forEach(o=>{ const op=document.createElement('option'); op.value=o[0]; op.textContent=o[1]; statusSel.appendChild(op); });
        statusSel.value = en.status || 'falta'; statusSel.dataset.idx = en.studentIdx; statusSel.dataset.aid = en.assignmentId; statusSel.dataset.kind='status';
        statusSel.style.padding='6px'; statusSel.style.borderRadius='6px'; statusSel.style.minWidth='140px';
        statusTd.appendChild(statusSel);

        // reviewer select
        const revTd = document.createElement('td'); revTd.style.padding='8px';
        const revSel = document.createElement('select'); revSel.dataset.idx = en.studentIdx; revSel.dataset.aid = en.assignmentId; revSel.dataset.kind='reviewer';
        reviewers.forEach(n => { const op=document.createElement('option'); op.value=n; op.textContent = n || '—'; revSel.appendChild(op); });
        revSel.value = en.reviewer || '';
        revSel.style.padding='6px'; revSel.style.borderRadius='999px'; revSel.style.minWidth='120px';
        revTd.appendChild(revSel);

        tr.appendChild(canTd);
        tr.appendChild(nameTd);
        tr.appendChild(ghTd);
        tr.appendChild(aTd);
        tr.appendChild(statusTd);
        tr.appendChild(revTd);

        // history button for this row
        const histBtn = document.createElement('button'); histBtn.textContent='Hist'; histBtn.style.marginLeft='8px'; histBtn.className='secondary'; histBtn.style.padding='6px 8px';
        histBtn.addEventListener('click', ()=>{
          // show small panel under this row with history for this assignment
          const histKey = `student_history_${en.studentIdx}`;
          const rawH = localStorage.getItem(histKey) || '[]';
          let arr = [];
          try{ arr = JSON.parse(rawH); }catch(e){}
          const items = arr.filter(it => it.aid === en.assignmentId);
          // remove existing panel if present
          const existing = tr.querySelector('.row-history'); if(existing) existing.remove();
          const panel = document.createElement('div'); panel.className='row-history'; panel.style.padding='8px'; panel.style.marginTop='8px'; panel.style.background='#fbfdff'; panel.style.border='1px solid #eef6ff'; panel.style.borderRadius='8px';
          if(!items.length) panel.innerHTML = '<div class="muted">Sem histórico para esta tarefa.</div>';
          else items.slice(0,30).forEach(it => { const d=new Date(it.ts); const el=document.createElement('div'); el.style.fontSize='13px'; el.style.marginBottom='6px'; el.innerHTML = `<div style="color:var(--muted);font-size:12px">${d.toLocaleString()} · ${it.origin}</div><div style="margin-top:4px">${escapeHtml(String(it.field))}: <strong>${escapeHtml(String(it.old))}</strong> → <strong>${escapeHtml(String(it.new))}</strong></div>`; panel.appendChild(el); });
          tr.appendChild(panel);
        });
        aTd.appendChild(histBtn);

        // listen to changes and persist to localStorage; if canReview is turned off here, remove the row
        [canCb, statusSel, revSel].forEach(el => {
          el.addEventListener('change', () => {
            const idx = Number(el.dataset.idx);
            const aid = el.dataset.aid;
            const payload = { status: statusSel.value, reviewer: revSel.value, canReview: !!canCb.checked };
            saveAssignmentState(idx, aid, payload);
            showToast('Alteração salva localmente');
            if(el === canCb && !canCb.checked){
              // remove this row from the table immediately
              tr.remove();
            }
          });
        });

        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      area.appendChild(table);

      // print button
      const printBtn = document.getElementById('print-btn');
      if(printBtn) printBtn.addEventListener('click', ()=> window.print());

      // issue report button: open a prefilled issue with all current canReview rows
      const issueBtn = document.getElementById('issue-report-btn');
      if(issueBtn){
        issueBtn.addEventListener('click', ()=>{
          const title = `Lista de quem pode revisar — ${new Date().toLocaleString()}`;
          let body = `Lista de alunos/tarefas onde foi marcado \"Pode revisar\"\n\n`;
          body += '|student|github|assignment_id|assignment_title|status|reviewer|\n|---|---|---|---|---|---|\n';
          filtered.forEach(en => {
            body += `|${en.studentName.replace(/\|/g,'\\|')}|${en.github}|${en.assignmentId}|${en.assignmentTitle.replace(/\|/g,'\\|')}|${en.status}|${en.reviewer}|\n`;
          });
          body += `\nGerado por interface de Monitoria.`;
          const params = new URLSearchParams();
          params.set('title', title);
          params.set('body', body);
          params.set('labels', ['pode-revisar','monitoria'].join(','));
          const url = `https://github.com/${repoOwner}/${repoName}/issues/new?${params.toString()}`;
          window.open(url, '_blank');
        });
      }
    })
    .catch(err => {
      console.error('Erro ao montar lista de revisores', err);
      area.innerHTML = '<div class="muted">Erro ao montar a lista.</div>';
    });

  function saveAssignmentState(idx, aid, payload){
    const key = `student_status_${idx}`;
    let state = {};
    try{ const raw = localStorage.getItem(key); state = raw ? JSON.parse(raw) : {}; }catch(e){}
    const prev = state[aid] || {};
    const next = Object.assign({}, state[aid]||{}, payload);
    state[aid] = next;
    localStorage.setItem(key, JSON.stringify(state));
    localStorage.setItem(`${key}_ts`, String(Date.now()));
    // log diffs
    try{
      const histKey = `student_history_${idx}`;
      const rawH = localStorage.getItem(histKey);
      const arr = rawH ? JSON.parse(rawH) : [];
      if(prev.status !== next.status) arr.unshift({ts: Date.now(), aid: aid, field: 'status', old: prev.status||'', new: next.status||'', origin: 'reviewers'});
      if((prev.reviewer||'') !== (next.reviewer||'')) arr.unshift({ts: Date.now(), aid: aid, field: 'reviewer', old: prev.reviewer||'', new: next.reviewer||'', origin: 'reviewers'});
      if(!!prev.canReview !== !!next.canReview) arr.unshift({ts: Date.now(), aid: aid, field: 'canReview', old: !!prev.canReview, new: !!next.canReview, origin: 'reviewers'});
      if(arr.length > 300) arr.length = 300;
      localStorage.setItem(histKey, JSON.stringify(arr));
    }catch(e){ console.error('Erro ao gravar histórico', e); }
  }

  // small toast helper
  function showToast(msg){
    let t = document.querySelector('.toast');
    if(!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    setTimeout(()=> t.classList.remove('show'), 1800);
  }

})();

