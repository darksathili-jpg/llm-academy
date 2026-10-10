/* Interaction limitée aux trois maquettes. Aucun carnet, route applicative ou stockage. */
const words = ['canapé', 'tapis', 'bureau'];
const weights = [6, 3, 1];
const chances = weights.map((w) => w / weights.reduce((a, b) => a + b, 0));
let prediction = null;
const totals = [0, 0, 0];
const buttons = [...document.querySelectorAll('[data-choice]')];
const draw = document.querySelector('[data-draw]');
const output = document.querySelector('[data-outcome]');
buttons.forEach((button, id) =>
  button.addEventListener('click', () => {
    prediction = id;
    buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === id)));
    draw.disabled = false;
    output.textContent =
      'Tu proposes « ' + words[id] + ' ». Lance le tirage pour observer le résultat.';
  }),
);
draw.addEventListener('click', () => {
  if (prediction === null) return;
  const uniform = new Uint32Array(1);
  crypto.getRandomValues(uniform);
  const value = uniform[0] / 4294967296;
  let edge = 0;
  let selected = words.length - 1;
  for (let i = 0; i < words.length; i++) {
    edge += chances[i];
    if (value < edge) {
      selected = i;
      break;
    }
  }
  totals[selected]++;
  document.querySelector('[data-result]').textContent = words[selected];
  output.textContent =
    'Tu avais proposé « ' +
    words[prediction] +
    ' ». Le tirage donne « ' +
    words[selected] +
    ' ». Un mot favori peut ne pas sortir.';
  document.querySelector('[data-counts]').textContent =
    totals.reduce((a, b) => a + b, 0) +
    ' tirage(s) · canapé ' +
    totals[0] +
    ' · tapis ' +
    totals[1] +
    ' · bureau ' +
    totals[2];
  const pointer = document.querySelector('[data-pointer]');
  if (pointer) {
    pointer.hidden = false;
    pointer.style.left = value * 100 + '%';
  }
  document.querySelectorAll('[data-branch]').forEach((path, i) => {
    path.classList.toggle('chosen', i === selected);
    path.classList.toggle('other', i !== selected);
  });
  const point = document.querySelector('[data-museum-point]');
  if (point) {
    point.setAttribute('cx', String([120, 360, 600][selected]));
    point.style.visibility = 'visible';
  }
});
