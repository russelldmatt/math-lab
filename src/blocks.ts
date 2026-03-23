// Shared base-10 block primitives — no side effects, safe to import anywhere.

export function makeOneBlock(): HTMLElement {
  const block = document.createElement('div');
  block.className = 'one-block';
  return block;
}

export function makeHorizontalTenBlock(): HTMLElement {
  const ten = document.createElement('div');
  ten.className = 'ten-block';
  for (let i = 0; i < 10; i++) {
    const mini = document.createElement('div');
    mini.className = 'mini';
    ten.appendChild(mini);
  }
  return ten;
}

export function makeVerticalTenBlock(): HTMLElement {
  const ten = document.createElement('div');
  ten.className = 'ten-block-vertical';
  for (let i = 0; i < 10; i++) {
    const mini = document.createElement('div');
    mini.className = 'mini';
    ten.appendChild(mini);
  }
  return ten;
}

export function makeHundredBlock(): HTMLElement {
  const hundred = document.createElement('div');
  hundred.className = 'hundred-block';
  for (let i = 0; i < 100; i++) {
    const mini = document.createElement('div');
    mini.className = 'mini';
    hundred.appendChild(mini);
  }
  return hundred;
}
