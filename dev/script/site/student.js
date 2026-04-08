// student.js - shows a student's detail based on ?idx=N and stores status in localStorage
(function(){
  function qs(name){ return new URLSearchParams(window.location.search).get(name); }
  const idx = Number(qs('idx'));
  const repoOwner = 'Laboratorio-de-Analise-de-Dados';
  const repoName = 'disciplina_python_basico';
  const nameEl = document.getElementById('student-name');
  const githubEl = document.getElementById('student-github');
  const saveBtn = document.getElementById('save-btn');
  const clearBtn = document.getElementById('clear-btn');
  const assignmentsListEl = document.getElementById('assignments-list');

  if(Number.isNaN(idx)){
    nameEl.textContent = 'Aluno inválido';
    githubEl.style.display = 'none';
    return;
  }

  // load students and assignments in parallel
  Promise.all([fetch('students.json').then(r=>r.json()), fetch('assignments.json').then(r=>r.json())])
    .then(([students, assignments]) => {
      const s = students[idx];
      if(!s){ nameEl.textContent = 'Aluno não encontrado'; githubEl.style.display='none'; return; }
      // apply profile overrides when present (stored per-browser)
      const profileKey = `student_profile_${idx}`;
      let profile = {};
      try{ const rawP = localStorage.getItem(profileKey); profile = rawP ? JSON.parse(rawP) : {}; }catch(e){}
      const displayedName = profile.name || s.name;
      const displayedUrl = profile.url || s.url;
      nameEl.textContent = displayedName;
      githubEl.href = displayedUrl;
      githubEl.textContent = displayedUrl.replace('https://github.com/','');

      // wire profile inputs if present
      const profileNameInput = document.getElementById('profile-name');
      const profileGithubInput = document.getElementById('profile-github');
      const saveProfileBtn = document.getElementById('save-profile');
      const resetProfileBtn = document.getElementById('reset-profile');
      if(profileNameInput) profileNameInput.value = profile.name || s.name;
      if(profileGithubInput) profileGithubInput.value = profile.url || s.url;
      if(saveProfileBtn){
        saveProfileBtn.addEventListener('click', ()=>{
          const oldName = profile.name || s.name;
          const oldUrl = profile.url || s.url;
          const newName = (profileNameInput.value || '').trim();
          const newUrl = (profileGithubInput.value || '').trim();
          // save override
          const newProfile = { name: newName || s.name, url: newUrl || s.url };
          localStorage.setItem(profileKey, JSON.stringify(newProfile));
          // log changes
          if(oldName !== newProfile.name) logChange(idx, '__profile__', 'name', oldName, newProfile.name, 'profile');
          if(oldUrl !== newProfile.url) logChange(idx, '__profile__', 'url', oldUrl, newProfile.url, 'profile');
          // update display
          nameEl.textContent = newProfile.name;
          githubEl.href = newProfile.url;
          githubEl.textContent = newProfile.url.replace('https://github.com/','');
          profile = newProfile;
          showToast('Perfil salvo localmente.');
        });
      }
      if(resetProfileBtn){
        resetProfileBtn.addEventListener('click', ()=>{
          if(confirm('Restaurar nome e GitHub para os valores originais?')){
            localStorage.removeItem(profileKey);
            profile = {};
            profileNameInput.value = s.name;
            profileGithubInput.value = s.url;
            nameEl.textContent = s.name;
            githubEl.href = s.url;
            githubEl.textContent = s.url.replace('https://github.com/','');
            logChange(idx, '__profile__', 'reset', '', '', 'profile');
            showToast('Perfil restaurado.');
          }
        });
      }

      // load per-student statuses: { assignmentId: {available:bool, corrected:bool} }
      const key = `student_status_${idx}`;
      let state = {};
      const raw = localStorage.getItem(key);
      if(raw){ try{ state = JSON.parse(raw) }catch(e){} }

      // helper: log changes per student into localStorage under student_history_{idx}
      function logChange(idx, aid, field, oldVal, newVal, origin){
        try{
          const histKey = `student_history_${idx}`;
          const rawH = localStorage.getItem(histKey);
          const arr = rawH ? JSON.parse(rawH) : [];
          arr.unshift({ ts: Date.now(), aid: aid, field: field, old: oldVal, new: newVal, origin: origin });
          // cap
          if(arr.length > 300) arr.length = 300;
          localStorage.setItem(histKey, JSON.stringify(arr));
        }catch(e){ console.error('Erro ao logar mudança', e); }
      }

      function renderHistory(){
        const histKey = `student_history_${idx}`;
        const rawH = localStorage.getItem(histKey);
        const area = document.getElementById('history-area');
        area.innerHTML = '';
        if(!rawH){ area.innerHTML = '<div class="muted">Sem histórico.</div>'; return; }
        let arr = [];
        try{ arr = JSON.parse(rawH); }catch(e){}
        if(!arr.length){ area.innerHTML = '<div class="muted">Sem histórico.</div>'; return; }
        const list = document.createElement('div'); list.className='history-list';
        arr.slice(0,100).forEach(item => {
          const d = new Date(item.ts);
          const el = document.createElement('div'); el.className='history-item';
          el.innerHTML = `<div style="font-size:12px;color:var(--muted);">${d.toLocaleString()} · ${item.origin}</div><div style="margin-top:4px">Tarefa <strong>${item.aid}</strong>: <em>${item.field}</em> — <strong>${escapeHtml(String(item.old))}</strong> → <strong>${escapeHtml(String(item.new))}</strong></div>`;
          list.appendChild(el);
        });
        area.appendChild(list);
      }

      function escapeHtml(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

      const lastSavedEl = document.getElementById('last-saved');
      function updateLastSaved(){
        const raw2 = localStorage.getItem(key);
        if(!raw2){ lastSavedEl.textContent = 'Último salvo: nunca'; return; }
        const tsKey = `${key}_ts`;
        const ts = localStorage.getItem(tsKey);
        if(ts){ const d = new Date(Number(ts)); lastSavedEl.textContent = `Último salvo: ${d.toLocaleString()}`; } else { lastSavedEl.textContent = 'Último salvo: agora'; }
      }
      updateLastSaved();

      // render assignments: show title + status select + reviewer select
      const reviewers = ['', 'Jessica', 'Felipe', 'Metusalem', 'Guilherme'];
      assignments.forEach(a => {
        const row = document.createElement('div');
        row.className = 'task-check';

        // can-review checkbox column
        const canWrap = document.createElement('div'); canWrap.style.width='60px'; canWrap.style.textAlign='center';
        const canCb = document.createElement('input'); canCb.type='checkbox'; canCb.dataset.aid = a.id; canCb.dataset.kind = 'canreview';
        canCb.className = 'can-review-checkbox';
        canWrap.appendChild(canCb);

        const info = document.createElement('div');
        info.style.flex = '1';
        const title = document.createElement('div'); title.textContent = a.title; title.style.fontWeight = '600';
        const path = document.createElement('div'); path.textContent = a.path.replace(/^dev\//,''); path.style.fontSize='12px'; path.style.color='#6b7280';
        info.appendChild(title); info.appendChild(path);

        // status select
        const statusWrap = document.createElement('div'); statusWrap.style.width = '160px'; statusWrap.style.textAlign='center';
        const statusSel = document.createElement('select');
        statusSel.dataset.aid = a.id; statusSel.dataset.kind = 'status';
        const opts = [ ['falta','Falta revisar'], ['revisando','Em revisão'], ['revisado','Revisado'] ];
        opts.forEach(o => { const op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; statusSel.appendChild(op); });
        statusSel.style.padding = '8px'; statusSel.style.borderRadius='8px'; statusSel.style.border='1px solid #e6e9ef'; statusSel.style.minWidth='140px';
        statusWrap.appendChild(statusSel);

        // reviewer select + badge
  const revWrap = document.createElement('div'); revWrap.style.width='200px'; revWrap.style.textAlign='center'; revWrap.style.display='flex'; revWrap.style.alignItems='center'; revWrap.style.justifyContent='center'; revWrap.style.gap='8px';
  const revSel = document.createElement('select'); revSel.dataset.aid = a.id; revSel.dataset.kind = 'reviewer';
  reviewers.forEach(name => { const op = document.createElement('option'); op.value = name; op.textContent = name || '—'; revSel.appendChild(op); });
  revSel.style.padding='8px'; revSel.style.borderRadius='999px'; revSel.style.border='1px solid #e6e9ef'; revSel.style.background='#f8fbff'; revSel.style.minWidth='120px';
  revWrap.appendChild(revSel);

        // apply saved state with migration from old shape
        if(state[a.id]){
          // canReview
          if(typeof state[a.id].canReview !== 'undefined') canCb.checked = !!state[a.id].canReview;
          // new shape: { status:'...', reviewer:'Name' }
          if(state[a.id].status){ statusSel.value = state[a.id].status; }
          else {
            // migrate from old shape {available, corrected}
            if(state[a.id].corrected) statusSel.value = 'revisado';
            else if(state[a.id].available) statusSel.value = 'falta';
            else statusSel.value = 'falta';
          }
          if(state[a.id].reviewer) { revSel.value = state[a.id].reviewer; }
        } else {
          statusSel.value = 'falta';
        }

        // no extra badge — select visually shows the chosen reviewer

        row.appendChild(canWrap);
        row.appendChild(info);
        row.appendChild(statusWrap);
        row.appendChild(revWrap);
        assignmentsListEl.appendChild(row);
      });

      // autosave on change (debounced)
      let autosaveTimer = null;
      assignmentsListEl.addEventListener('change', (e)=>{
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(()=>{ doSave(true); }, 900);
      });

      function doSave(isAuto=false){
        const rows = Array.from(assignmentsListEl.querySelectorAll('.task-check'));
        const newState = {};
        rows.forEach(r => {
          const aid = r.querySelector('[data-kind=status]').dataset.aid;
          const status = r.querySelector('[data-kind=status]').value;
          const reviewer = r.querySelector('[data-kind=reviewer]').value;
          const canReviewEl = r.querySelector('[data-kind=canreview]');
          const canReview = canReviewEl ? !!canReviewEl.checked : false;
          newState[aid] = { status: status, reviewer: reviewer, canReview: canReview };
        });

        // compute diffs vs previous state and log
        Object.keys(newState).forEach(aid => {
          const prev = state[aid] || {};
          const next = newState[aid];
          if(prev.status !== next.status) logChange(idx, aid, 'status', prev.status||'', next.status||'', 'student');
          if((prev.reviewer||'') !== (next.reviewer||'')) logChange(idx, aid, 'reviewer', prev.reviewer||'', next.reviewer||'', 'student');
          if(!!prev.canReview !== !!next.canReview) logChange(idx, aid, 'canReview', !!prev.canReview, !!next.canReview, 'student');
        });

        localStorage.setItem(key, JSON.stringify(newState));
        localStorage.setItem(`${key}_ts`, String(Date.now()));
        state = newState; // update in-memory state
        updateLastSaved();
        renderHistory();
        if(!isAuto) showToast('Status salvo localmente.');
        else showToast('Autosave');
      }

      saveBtn.addEventListener('click', () => { doSave(false); });

      clearBtn.addEventListener('click', () => {
        if(confirm('Remover todas as marcações deste aluno?')){
          localStorage.removeItem(key);
          localStorage.removeItem(`${key}_ts`);
          // reset selects and can-review
          Array.from(assignmentsListEl.querySelectorAll('[data-kind=status]')).forEach(s => s.value='falta');
          Array.from(assignmentsListEl.querySelectorAll('[data-kind=reviewer]')).forEach(s => s.value='');
          Array.from(assignmentsListEl.querySelectorAll('[data-kind=canreview]')).forEach(s => s.checked=false);
          updateLastSaved();
          showToast('Marcações removidas.');
        }
      });

      // hook up history UI
      const toggleHistoryBtn = document.getElementById('toggle-history');
      const clearHistoryBtn = document.getElementById('clear-history');
      const historyArea = document.getElementById('history-area');
      toggleHistoryBtn.addEventListener('click', ()=>{
        if(historyArea.style.display === 'none'){
          renderHistory(); historyArea.style.display = 'block'; toggleHistoryBtn.textContent = 'Esconder histórico';
        } else { historyArea.style.display = 'none'; toggleHistoryBtn.textContent = 'Ver histórico'; }
      });
      clearHistoryBtn.addEventListener('click', ()=>{
        if(confirm('Remover histórico de alterações deste aluno?')){
          localStorage.removeItem(`student_history_${idx}`);
          renderHistory();
          showToast('Histórico removido.');
        }
      });
      // initial render
      renderHistory();
    })
    .catch(err => {
      console.error('Erro ao carregar dados', err);
      nameEl.textContent = 'Erro ao carregar dados do aluno';
    });
  
  // toast helper
  function showToast(msg){
    let t = document.querySelector('.toast');
    if(!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    setTimeout(()=> t.classList.remove('show'), 2200);
  }

  // build issue url helper (same format used in app.js)
  function buildIssueUrl(title, body, labels = ['submission']){
    const base = `https://github.com/${repoOwner}/${repoName}/issues/new`;
    const params = new URLSearchParams();
    params.set('title', title);
    params.set('body', body);
    if(labels.length) params.set('labels', labels.join(','));
    return `${base}?${params.toString()}`;
  }

  // Handler: create GitHub issue with snapshot for this student
  const issueBtn = document.getElementById('issue-btn');
  if(issueBtn){
    issueBtn.addEventListener('click', async ()=>{
      const assignments = await fetch('assignments.json').then(r=>r.json());
      // load current state
      const rawState = localStorage.getItem(key); let curState = {};
      try{ curState = rawState ? JSON.parse(rawState) : {}; }catch(e){}
      const title = `[Registro] ${nameEl.textContent} — snapshot ${new Date().toLocaleString()}`;
      // build markdown body
      let body = `Aluno: **${nameEl.textContent}**\nRepositório: ${githubEl.href}\n\nEstado atual das tarefas:\n\n`;
      body += '|assignment_id|title|status|reviewer|canReview|\n|---|---:|---:|---:|---:|\n';
      assignments.forEach(a => {
        const st = curState[a.id] || {};
        const status = st.status || '';
        const reviewer = st.reviewer || '';
        const canReview = st.canReview ? '1' : '0';
        body += `|${a.id}|${a.title.replace(/\|/g,'\\|')}|${status}|${reviewer}|${canReview}|\n`;
      });
      body += `\nGerado por: interface de Monitoria.\n`;
      const url = buildIssueUrl(title, body, ['submissao','monitoria']);
      window.open(url, '_blank');
    });
  }

  // Handler: propose a PR by opening GitHub's editor with prefilled students.json content
  const proposePrBtn = document.getElementById('propose-pr-btn');
  if(proposePrBtn){
    proposePrBtn.addEventListener('click', async ()=>{
      showToast('Preparando proposta de PR...');
      try{
        const resp = await fetch('students.json');
        if(!resp.ok) throw new Error('Falha ao carregar students.json');
        const all = await resp.json();

        const profileKey = `student_profile_${idx}`;
        let profile = {};
        try{ const rawP = localStorage.getItem(profileKey); profile = rawP ? JSON.parse(rawP) : {}; }catch(e){}

        const updated = JSON.parse(JSON.stringify(all));
        const newEntry = {
          name: profile.name || nameEl.textContent || (all[idx] && all[idx].name) || 'NOME',
          url: profile.url || githubEl.href || (all[idx] && all[idx].url) || 'https://github.com/'
        };
        if(idx >= 0 && idx < updated.length) updated[idx] = newEntry; else updated.push(newEntry);

        const newContent = JSON.stringify(updated, null, 2);

        const owner = repoOwner || 'Laboratorio-de-Analise-de-Dados';
        const repo = repoName || 'disciplina_python_basico';
        const branch = 'main';
        const path = 'dev/script/site/students.json';

        const commitMsg = `Proposta: atualizar students.json — ${newEntry.name}`;
        const editUrl = `https://github.com/${owner}/${repo}/edit/${branch}/${path}?message=${encodeURIComponent(commitMsg)}&value=${encodeURIComponent(newContent)}`;

        logChange(idx, '__profile__', 'propose_pr', '', JSON.stringify(newEntry), 'pr');
        window.open(editUrl, '_blank');
      }catch(err){
        console.error(err);
        showToast('Erro ao preparar proposta: '+(err.message||err));
      }
    });
  }
})();
