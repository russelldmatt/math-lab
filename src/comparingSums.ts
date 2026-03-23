import { makeOneBlock, makeHorizontalTenBlock } from './main';

function renderNumberBlocks(n: number): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'number-viz';

  const tens = Math.floor(n / 10);
  const ones = n % 10;

  for (let i = 0; i < tens; i++) {
    wrapper.appendChild(makeHorizontalTenBlock());
  }

  if (ones > 0) {
    const onesRow = document.createElement('div');
    onesRow.className = 'number-viz-ones';
    for (let i = 0; i < ones; i++) {
      onesRow.appendChild(makeOneBlock());
    }
    wrapper.appendChild(onesRow);
  }

  return wrapper;
}

// ── Audio ────────────────────────────────────────────────────────────────

function playSuccess(): void {
  const ctx = new AudioContext();
  const notes = [523.25, 659.25, 783.99]; // C5 E5 G5
  notes.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.13;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.start(t);
    osc.stop(t + 0.4);
  });
}

function playFailure(): void {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(280, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.45);
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
}

// ── DOM refs ─────────────────────────────────────────────────────────────

const aInput = document.getElementById('aInput') as HTMLInputElement;
const bInput = document.getElementById('bInput') as HTMLInputElement;
const cInput = document.getElementById('cInput') as HTMLInputElement;
const dInput = document.getElementById('dInput') as HTMLInputElement;
const mainEl = document.getElementById('comparingMain')!;

// ── Layout (CSS grid: 3 cols × 2 rows) ─────────────────────────────────
//   col 1 = left sum   col 2 = eq indicator   col 3 = right sum
//   row 1 = (empty)    (spans)                 move buttons
//   row 2 = left row   (spans)                 right row

const layout = document.createElement('div');
layout.className = 'comparing-layout';
mainEl.appendChild(layout);

function makeAddendEl(): {
  wrap: HTMLElement;
  labelEl: HTMLElement;
  blocksEl: HTMLElement;
} {
  const wrap = document.createElement('div');
  wrap.className = 'addend';
  const labelEl = document.createElement('div');
  labelEl.className = 'addend-label';
  const blocksEl = document.createElement('div');
  blocksEl.className = 'addend-blocks';
  wrap.appendChild(labelEl);
  wrap.appendChild(blocksEl);
  return { wrap, labelEl, blocksEl };
}

function makePlusEl(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'sum-plus';
  el.textContent = '+';
  return el;
}

// Move buttons — row 1, col 3
const btnRow = document.createElement('div');
btnRow.className = 'move-btn-row';
btnRow.style.gridColumn = '3';
btnRow.style.gridRow = '1';

const btnMoveLeft = document.createElement('button');
btnMoveLeft.className = 'move-btn';
btnMoveLeft.innerHTML = '&larr; Move 1';
btnMoveLeft.title = 'Move 1 from D to C';

const btnMoveRight = document.createElement('button');
btnMoveRight.className = 'move-btn';
btnMoveRight.innerHTML = 'Move 1 &rarr;';
btnMoveRight.title = 'Move 1 from C to D';

btnRow.appendChild(btnMoveLeft);
btnRow.appendChild(btnMoveRight);
layout.appendChild(btnRow);

// Equality indicator — col 2, spans both rows
const eqIndicator = document.createElement('div');
eqIndicator.className = 'eq-indicator';
eqIndicator.style.gridColumn = '2';
eqIndicator.style.gridRow = '1 / 3';
eqIndicator.innerHTML =
  '<span class="eq-question">?</span><span class="eq-sign">=</span>';
layout.appendChild(eqIndicator);

// Left sum row — row 2, col 1
const leftRow = document.createElement('div');
leftRow.className = 'sum-row';
leftRow.style.gridColumn = '1';
leftRow.style.gridRow = '2';

const addendA = makeAddendEl();
const addendB = makeAddendEl();
leftRow.appendChild(addendA.wrap);
leftRow.appendChild(makePlusEl());
leftRow.appendChild(addendB.wrap);
layout.appendChild(leftRow);

// Right sum row — row 2, col 3
const rightRow = document.createElement('div');
rightRow.className = 'sum-row';
rightRow.style.gridColumn = '3';
rightRow.style.gridRow = '2';

const addendC = makeAddendEl();
const addendD = makeAddendEl();
rightRow.appendChild(addendC.wrap);
rightRow.appendChild(makePlusEl());
rightRow.appendChild(addendD.wrap);
layout.appendChild(rightRow);

// ── Question section ─────────────────────────────────────────────────────

const questionSection = document.createElement('div');
questionSection.className = 'question-section';
questionSection.style.gridColumn = '1 / -1';
questionSection.style.gridRow = '3';
layout.appendChild(questionSection);

const questionText = document.createElement('p');
questionText.className = 'question-text';
questionText.textContent = 'Are these sums the same?';
questionSection.appendChild(questionText);

const answerRow = document.createElement('div');
answerRow.className = 'answer-btn-row';
questionSection.appendChild(answerRow);

const btnYes = document.createElement('button');
btnYes.className = 'answer-btn';
btnYes.textContent = 'Yes';

const btnNo = document.createElement('button');
btnNo.className = 'answer-btn';
btnNo.textContent = 'No';

answerRow.appendChild(btnYes);
answerRow.appendChild(btnNo);

function resetAnswerButtons(): void {
  btnYes.className = 'answer-btn';
  btnNo.className = 'answer-btn';
}

function handleAnswer(answeredYes: boolean): void {
  const a = parseInt(aInput.value) || 0;
  const b = parseInt(bInput.value) || 0;
  const c = parseInt(cInput.value) || 0;
  const d = parseInt(dInput.value) || 0;
  const equal = a + b === c + d;
  const correct = answeredYes === equal;

  resetAnswerButtons();
  if (correct) {
    (answeredYes ? btnYes : btnNo).className = 'answer-btn answer-correct';
    playSuccess();
  } else {
    (answeredYes ? btnYes : btnNo).className = 'answer-btn answer-wrong';
    playFailure();
  }
}

btnYes.addEventListener('click', () => handleAnswer(true));
btnNo.addEventListener('click', () => handleAnswer(false));

// ── Problem generation ───────────────────────────────────────────────────

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function generateProblem(): void {
  const equal = Math.random() < 0.5;
  const offset = randInt(-5, 5); // C = A + offset

  const a = randInt(10, 99);
  const c = clamp(a + offset, 10, 99);
  // actual offset after clamping
  const actualOffset = c - a;

  let b: number;
  let d: number;

  if (equal) {
    // D = B - actualOffset; need D in [10,99]
    const bMin = clamp(10 + actualOffset, 10, 99);
    const bMax = clamp(99 + actualOffset, 10, 99);
    b = randInt(bMin, bMax);
    d = b - actualOffset; // guaranteed in [10,99]
  } else {
    // Pick B freely, D = clamp(B + offsetBD) with a different offset
    // Keep trying until sums differ
    let attempts = 0;
    do {
      b = randInt(10, 99);
      const offsetBD = randInt(-5, 5);
      d = clamp(b + offsetBD, 10, 99);
      attempts++;
    } while (a + b === c + d && attempts < 20);

    // Last-resort nudge if still equal
    if (a + b === c + d) {
      d = d < 99 ? d + 1 : d - 1;
    }
  }

  aInput.value = String(a);
  bInput.value = String(b);
  cInput.value = String(c);
  dInput.value = String(d);
  refresh();
}

const generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;
generateBtn.addEventListener('click', generateProblem);

// ── Refresh ──────────────────────────────────────────────────────────────

function refresh(): void {
  const a = parseInt(aInput.value) || 0;
  const b = parseInt(bInput.value) || 0;
  const c = parseInt(cInput.value) || 0;
  const d = parseInt(dInput.value) || 0;

  addendA.labelEl.textContent = String(a);
  addendA.blocksEl.replaceChildren(renderNumberBlocks(a));
  addendB.labelEl.textContent = String(b);
  addendB.blocksEl.replaceChildren(renderNumberBlocks(b));

  addendC.labelEl.textContent = String(c);
  addendC.blocksEl.replaceChildren(renderNumberBlocks(c));
  addendD.labelEl.textContent = String(d);
  addendD.blocksEl.replaceChildren(renderNumberBlocks(d));

  btnMoveLeft.disabled = d <= 0;
  btnMoveRight.disabled = c <= 0;

  resetAnswerButtons();
}

// ── Move button handlers ─────────────────────────────────────────────────

btnMoveLeft.addEventListener('click', () => {
  const c = parseInt(cInput.value) || 0;
  const d = parseInt(dInput.value) || 0;
  if (d > 0) {
    cInput.value = String(c + 1);
    dInput.value = String(d - 1);
    refresh();
  }
});

btnMoveRight.addEventListener('click', () => {
  const c = parseInt(cInput.value) || 0;
  const d = parseInt(dInput.value) || 0;
  if (c > 0) {
    cInput.value = String(c - 1);
    dInput.value = String(d + 1);
    refresh();
  }
});

[aInput, bInput, cInput, dInput].forEach((el) =>
  el.addEventListener('input', refresh),
);

refresh();
