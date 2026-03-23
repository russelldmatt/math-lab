import './style.css';
import { makeOneBlock, makeHorizontalTenBlock } from './blocks';
import { playSuccess, playFailure, playTimeUp } from './audio';

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
  labelEl: HTMLElement;
  blocksEl: HTMLElement;
} {
  const labelEl = document.createElement('div');
  labelEl.className = 'addend-label';
  const blocksEl = document.createElement('div');
  blocksEl.className = 'addend-blocks';
  return { labelEl, blocksEl };
}

function makePlusEl(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'sum-plus';
  el.textContent = '+';
  return el;
}

// Grid layout: 7 cols — A(1) | +(2) | B(3) | ?/=(4) | C(5) | +(6) | D(7)
// Row 1: move buttons span cols 5-7
// Row 2: number labels + operators
// Row 3: base-10 blocks (same columns as their labels)

function placeAt(el: HTMLElement, col: string, row: string): HTMLElement {
  el.style.gridColumn = col;
  el.style.gridRow = row;
  return el;
}

// Move buttons — row 1, cols 5–7
const btnRow = document.createElement('div');
btnRow.className = 'move-btn-row';
btnRow.style.gridColumn = '5 / 8';
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

// ?/= indicator — row 2, col 4; ? is absolutely positioned so = stays centered
const eqIndicator = document.createElement('div');
eqIndicator.className = 'eq-indicator';
eqIndicator.style.gridColumn = '4';
eqIndicator.style.gridRow = '2';
eqIndicator.innerHTML = '<span class="eq-question">?</span><span class="eq-sign">=</span>';
layout.appendChild(eqIndicator);

const addendA = makeAddendEl();
const addendB = makeAddendEl();
const addendC = makeAddendEl();
const addendD = makeAddendEl();

// Row 2: labels — each addend gets its own column
const plusLeft = makePlusEl();
const plusRight = makePlusEl();
layout.appendChild(placeAt(addendA.labelEl, '1', '2'));
layout.appendChild(placeAt(plusLeft,         '2', '2'));
layout.appendChild(placeAt(addendB.labelEl, '3', '2'));
layout.appendChild(placeAt(addendC.labelEl, '5', '2'));
layout.appendChild(placeAt(plusRight,        '6', '2'));
layout.appendChild(placeAt(addendD.labelEl, '7', '2'));

// Row 3: blocks — same column as their label, so they align vertically
layout.appendChild(placeAt(addendA.blocksEl, '1', '3'));
layout.appendChild(placeAt(addendB.blocksEl, '3', '3'));
layout.appendChild(placeAt(addendC.blocksEl, '5', '3'));
layout.appendChild(placeAt(addendD.blocksEl, '7', '3'));

// ── Question section ─────────────────────────────────────────────────────

const questionSection = document.createElement('div');
questionSection.className = 'question-section';
questionSection.style.gridColumn = '1 / -1';
  questionSection.style.gridRow = '4';
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

// ── Scoreboard ────────────────────────────────────────────────────────────

const scoreSection = document.createElement('div');
scoreSection.className = 'score-section';
scoreSection.style.gridColumn = '1 / -1';
  scoreSection.style.gridRow = '5';
layout.appendChild(scoreSection);

const timerEl = document.createElement('div');
timerEl.className = 'game-timer';
timerEl.hidden = true;
scoreSection.appendChild(timerEl);

const scoreEl = document.createElement('div');
scoreEl.className = 'score-display';
scoreEl.hidden = true;
scoreSection.appendChild(scoreEl);

const gameOverEl = document.createElement('div');
gameOverEl.className = 'game-over';
gameOverEl.hidden = true;
scoreSection.appendChild(gameOverEl);

// ── Game state ────────────────────────────────────────────────────────────

let correct = 0;
let incorrect = 0;
let gameActive = false;
let timerInterval: ReturnType<typeof setInterval> | null = null;

function updateScoreDisplay(): void {
  const total = correct - incorrect;
  scoreEl.innerHTML =
    `<span class="score-correct">✓ ${correct}</span>` +
    `<span class="score-incorrect">✗ ${incorrect}</span>` +
    `<span class="score-total">Score: ${total >= 0 ? '+' : ''}${total}</span>`;
}

function endGame(): void {
  gameActive = false;
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  playTimeUp();
  timerEl.hidden = true;
  btnYes.disabled = true;
  btnNo.disabled = true;
  const total = correct - incorrect;
  gameOverEl.textContent = `Time's up! Final score: ${total >= 0 ? '+' : ''}${total} (${correct} correct, ${incorrect} incorrect)`;
  gameOverEl.hidden = false;
  startGameBtn.textContent = '↺ Play again';
  startGameBtn.disabled = false;
}

function startGame(): void {
  correct = 0;
  incorrect = 0;
  gameActive = true;
  gameOverEl.hidden = true;
  scoreEl.hidden = false;
  timerEl.hidden = false;
  btnYes.disabled = false;
  btnNo.disabled = false;
  startGameBtn.disabled = true;
  updateScoreDisplay();
  generateProblem();

  let remaining = 30;
  timerEl.textContent = `⏱ ${remaining}s`;

  timerInterval = setInterval(() => {
    remaining -= 1;
    timerEl.textContent = `⏱ ${remaining}s`;
    if (remaining <= 0) endGame();
  }, 1000);
}

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
  const isCorrect = answeredYes === equal;

  resetAnswerButtons();
  if (isCorrect) {
    (answeredYes ? btnYes : btnNo).className = 'answer-btn answer-correct';
    playSuccess();
  } else {
    (answeredYes ? btnYes : btnNo).className = 'answer-btn answer-wrong';
    playFailure();
  }

  if (gameActive) {
    if (isCorrect) correct++;
    else incorrect++;
    updateScoreDisplay();
    // brief pause so the colour shows, then auto-advance
    btnYes.disabled = true;
    btnNo.disabled = true;
    setTimeout(() => {
      if (!gameActive) return;
      generateProblem();
      btnYes.disabled = false;
      btnNo.disabled = false;
    }, 600);
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

const startGameBtn = document.getElementById(
  'startGameBtn',
) as HTMLButtonElement;
startGameBtn.addEventListener('click', startGame);

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
