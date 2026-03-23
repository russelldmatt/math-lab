import './style.css';
import { renderGrid } from './main';
import {
  renderExpandedLongMultiplication,
  renderTraditionalLongMultiplication,
} from './longMultFormat';

const aInput = document.getElementById('aInput') as HTMLInputElement;
const bInput = document.getElementById('bInput') as HTMLInputElement;
const exampleArea = document.getElementById('exampleArea')!;
const longExpanded = document.getElementById('exampleLongExpanded')!;
const longTraditional = document.getElementById('exampleLongTraditional')!;

function renderExamples(): void {
  const a = parseInt(aInput.value) || 0;
  const b = parseInt(bInput.value) || 0;

  renderGrid(a, b, exampleArea);

  longExpanded.innerHTML = `<h3>Expanded form (4 terms)</h3><pre>${renderExpandedLongMultiplication(a, b)}</pre>`;
  longTraditional.innerHTML = `<h3>Traditional form (2 partial products)</h3><pre>${renderTraditionalLongMultiplication(a, b)}</pre>`;
}

aInput.addEventListener('input', renderExamples);
bInput.addEventListener('input', renderExamples);

renderExamples();
