import './style.css';

const aInput = document.getElementById('aInput') as HTMLInputElement;
const bInput = document.getElementById('bInput') as HTMLInputElement;
const viz = document.getElementById('viz')!;
const summary = document.getElementById('summary')!;

aInput.addEventListener('input', render);
bInput.addEventListener('input', render);

function decompose(n: number) {
  const hundreds = Math.floor(n / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;

  const groups = [];
  if (hundreds) groups.push({ label: 'hundreds', value: hundreds * 100 });
  if (tens) groups.push({ label: 'tens', value: tens * 10 });
  if (ones) groups.push({ label: 'ones', value: ones });

  if (groups.length === 0) groups.push({ label: 'ones', value: 0 });

  return groups;
}

function render() {
  const a = parseInt(aInput.value) || 0;
  const b = parseInt(bInput.value) || 0;

  const aGroups = decompose(a);
  const bGroups = decompose(b);

  viz.innerHTML = '';
  viz.style.gridTemplateColumns = `repeat(${bGroups.length}, 1fr)`;

  let total = 0;

  for (const aPart of aGroups) {
    for (const bPart of bGroups) {
      const product = aPart.value * bPart.value;
      total += product;

      const cell = document.createElement('div');
      cell.className = `cell ${aPart.label}`;
      cell.innerText = `${aPart.value} × ${bPart.value}
= ${product}`;

      viz.appendChild(cell);
    }
  }

  summary.innerHTML = `
    <div>
      ${a} × ${b} =
      <strong>${total}</strong>
    </div>
  `;
}

render();
