(() => {
  'use strict';
  // Moteur de comptage partagé avec formation-v4-r1, intégré à la compilation.
  /* MOTEUR_BIGRAMME */
  const python = /* FICHIERS_PYTHON */ {};
  const formatPercent = new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    maximumFractionDigits: 1,
  });
  const endTokens = new Set(['.', '!', '?']);
  const form = $('#v4-generation-form');
  const step = $('#v4-step');
  const status = $('#v4-generation-status');
  const trace = $('#v4-generation-trace');
  let session;

  function tokenLabel(token, ids) {
    return `« ${token} » (${ids.get(token) ?? 'hors vocabulaire'})`;
  }

  function renderText() {
    const { output, ids } = session;
    $('#v4-generated-text').textContent = output.join(' ').replace(/\s+([.!?])/g, '$1');
    $('#v4-generated-ids').textContent = output.map((token) => tokenLabel(token, ids)).join(' · ');
  }

  function candidatesFor(context) {
    const continuations = session.model.counts.get(context);
    return distribution(session.model, context, 1, continuations?.size || 1);
  }

  function describeState() {
    const { output, limit, added, ids } = session;
    const context = output.at(-1);
    let message;
    if (endTokens.has(context)) {
      message = `Arrêt sur le signe de fin « ${context} ». `;
    } else if (added === limit) {
      message = `Arrêt au budget de ${limit} nouveau${limit === 1 ? '' : 'x'} token${limit === 1 ? '' : 's'}. `;
    } else if (!candidatesFor(context).length) {
      message = `Arrêt faute de suite observée après ${tokenLabel(context, ids)}. `;
    }
    step.disabled = Boolean(message);
    status.textContent = message
      ? `${message}${added} token${added > 1 ? 's' : ''} ajouté${added > 1 ? 's' : ''}.`
      : `Contexte courant ${tokenLabel(context, ids)}. ${added} / ${limit} tokens ajoutés.`;
  }

  function reset() {
    const model = train($('#v4-corpus').value);
    const output = tokens($('#v4-prefix').value);
    const ids = new Map([...new Set(model.words)].map((token, index) => [token, index]));
    trace.replaceChildren();
    $('#v4-vocabulary').textContent = [...ids].map(([token]) => tokenLabel(token, ids)).join(' · ');
    session = {
      model,
      output,
      ids,
      added: 0,
      limit: $('#v4-budget').valueAsNumber,
      random: rng($('#v4-seed').valueAsNumber),
    };
    renderText();
    if (
      !model.words.some((token) => !endTokens.has(token)) ||
      !output.some((token) => !endTokens.has(token))
    ) {
      status.textContent = 'Saisis au moins un mot dans le corpus et dans le début du texte.';
      step.disabled = true;
      return;
    }
    describeState();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    reset();
  });
  form.addEventListener('input', () => {
    step.disabled = true;
    status.textContent = 'Les valeurs ont changé. Recommence pour appliquer les réglages.';
  });
  step.addEventListener('click', () => {
    const { output, ids, random } = session;
    const context = output.at(-1);
    const candidates = candidatesFor(context);
    const roll = random();
    const next = sample(candidates, () => roll);
    const total = candidates.reduce((sum, item) => sum + item.count, 0);
    const options = candidates.map(
      ({ word, count, p }) =>
        `${tokenLabel(word, ids)} ${count}/${total} ≈ ${formatPercent.format(p)}`,
    );
    const row = document.createElement('li');
    row.textContent = `Après ${tokenLabel(context, ids)} → ${options.join(' · ')}. Tirage ${formatPercent.format(roll)} → ${tokenLabel(next, ids)} ajouté.`;
    trace.append(row);
    output.push(next);
    session.added++;
    renderText();
    describeState();
  });

  function navigationButton(screen, label, target) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary';
    button.dataset.v4Open = screen;
    if (target) button.dataset.v4Target = target;
    button.textContent = label;
    return button;
  }

  const shortcuts = document.createElement('nav');
  shortcuts.className = 'buttonrow';
  shortcuts.setAttribute('aria-label', 'Ateliers et séances');
  const teacherButton = navigationButton('teacher', 'Fiches de séance');
  teacherButton.classList.add('teacher-inline');
  teacherButton.hidden = state.role !== 'teacher';
  shortcuts.append(
    navigationButton('generation', 'Générer un texte pas à pas'),
    navigationButton('tp', 'Travaux pratiques Python'),
  );
  $('.hero').after(shortcuts);
  teacherButton.classList.replace('secondary', 'navbtn');
  $('#teacherRole').after(teacherButton);
  const courseLinks = new Map([
    [1, [navigationButton('tp', 'Travail pratique de fusion', 'v4-tp-fusion')]],
    [2, [navigationButton('generation', 'Atelier de génération pas à pas')]],
    [5, [navigationButton('tp', 'Travail pratique de recherche', 'v4-tp-recherche')]],
    [11, [navigationButton('generation', 'Atelier de génération pas à pas')]],
  ]);
  const chapterShortcuts = document.createElement('div');
  chapterShortcuts.className = 'buttonrow';
  $('#sectionTry').append(chapterShortcuts);
  function updateChapterLinks() {
    const buttons = courseLinks.get(state.course) ?? [];
    chapterShortcuts.replaceChildren(...buttons);
    chapterShortcuts.hidden = buttons.length === 0;
  }
  new MutationObserver(updateChapterLinks).observe($('#courseTitle'), { childList: true });

  function openScreen(name, target = `v4-${name}-title`) {
    if (name === 'teacher' && state.role !== 'teacher') return;
    view(name);
    document.title = `${$(`#v4-${name}-title`).textContent} — LLM Academy`;
    document.getElementById(target).focus();
  }

  document.addEventListener('click', (event) => {
    const navigation = event.target.closest('[data-v4-open]');
    if (navigation) openScreen(navigation.dataset.v4Open, navigation.dataset.v4Target);
    const download = event.target.closest('[data-v4-python]');
    if (download) {
      const filename = download.dataset.v4Python;
      const url = URL.createObjectURL(
        new Blob([python[filename]], { type: 'text/x-python;charset=utf-8' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.py`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }
  });
  $('#teacherRole').addEventListener('click', () => {
    teacherButton.focus();
  });
  $('#studentRole').addEventListener('click', () => {
    if (!$('#screen-teacher').hidden) {
      view('home');
      document.title = 'LLM Academy — Comprendre en faisant';
    }
  });
  reset();
})();
