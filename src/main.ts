import './style.css';

const viz = document.getElementById('viz')!;

function makeOneBlock() {
  const container = document.createElement('div');
  container.className = 'block';
  const block = document.createElement('div');
  block.className = 'one-block';
  const label = document.createElement('div');
  label.className = 'block-label';
  label.textContent = 'One (1) block';
  container.appendChild(block);
  container.appendChild(label);
  return container;
}

function makeTenBlock() {
  const container = document.createElement('div');
  container.className = 'block';
  const ten = document.createElement('div');
  ten.className = 'ten-block';
  for (let i = 0; i < 10; i++) {
    const mini = document.createElement('div');
    mini.className = 'mini';
    ten.appendChild(mini);
  }
  const label = document.createElement('div');
  label.className = 'block-label';
  label.textContent = 'Ten (10) block — horizontal';
  container.appendChild(ten);
  container.appendChild(label);
  return container;
}

function makeVerticalTenBlock() {
  const container = document.createElement('div');
  container.className = 'block';
  const ten = document.createElement('div');
  ten.className = 'ten-block-vertical';
  for (let i = 0; i < 10; i++) {
    const mini = document.createElement('div');
    mini.className = 'mini';
    ten.appendChild(mini);
  }
  const label = document.createElement('div');
  label.className = 'block-label';
  label.textContent = 'Ten (10) block — vertical';
  container.appendChild(ten);
  container.appendChild(label);
  return container;
}

function makeHundredBlock() {
  const container = document.createElement('div');
  container.className = 'block';
  const hundred = document.createElement('div');
  hundred.className = 'hundred-block';
  for (let i = 0; i < 100; i++) {
    const mini = document.createElement('div');
    mini.className = 'mini';
    hundred.appendChild(mini);
  }
  const label = document.createElement('div');
  label.className = 'block-label';
  label.textContent = 'One Hundred (100) block — 10×10';
  container.appendChild(hundred);
  container.appendChild(label);
  return container;
}

function init() {
  viz.innerHTML = '';
  viz.appendChild(makeOneBlock());
  viz.appendChild(makeTenBlock());
  viz.appendChild(makeVerticalTenBlock());
  viz.appendChild(makeHundredBlock());
}

init();
