import './style.css';

const viz = document.getElementById('viz')!;
const aInput = document.getElementById('aInput') as HTMLInputElement;
const bInput = document.getElementById('bInput') as HTMLInputElement;

interface Group {
  type: 'ones' | 'tens';
  count: number;
}

function decompose(n: number): Group[] {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const groups: Group[] = [];
  if (tens > 0) groups.push({ type: 'tens', count: tens });
  if (ones > 0) groups.push({ type: 'ones', count: ones });
  return groups;
}

function makeOneBlock(): HTMLElement {
  const block = document.createElement('div');
  block.className = 'one-block';
  return block;
}

function makeHorizontalTenBlock(): HTMLElement {
  const ten = document.createElement('div');
  ten.className = 'ten-block';
  for (let i = 0; i < 10; i++) {
    const mini = document.createElement('div');
    mini.className = 'mini';
    ten.appendChild(mini);
  }
  return ten;
}

function makeVerticalTenBlock(): HTMLElement {
  const ten = document.createElement('div');
  ten.className = 'ten-block-vertical';
  for (let i = 0; i < 10; i++) {
    const mini = document.createElement('div');
    mini.className = 'mini';
    ten.appendChild(mini);
  }
  return ten;
}

function makeHundredBlock(): HTMLElement {
  const hundred = document.createElement('div');
  hundred.className = 'hundred-block';
  for (let i = 0; i < 100; i++) {
    const mini = document.createElement('div');
    mini.className = 'mini';
    hundred.appendChild(mini);
  }
  return hundred;
}

function renderGroupBlocks(group: Group, isVertical: boolean): HTMLElement {
  const container = document.createElement('div');
  container.className = `group-blocks ${
    isVertical ? 'vertical' : 'horizontal'
  }`;

  for (let i = 0; i < group.count; i++) {
    if (group.type === 'tens') {
      container.appendChild(
        isVertical ? makeVerticalTenBlock() : makeHorizontalTenBlock()
      );
    } else {
      container.appendChild(makeOneBlock());
    }
  }
  return container;
}

function renderProductCell(aGroup: Group, bGroup: Group): HTMLElement {
  const cell = document.createElement('div');
  cell.className = 'product-cell';

  // Determine product type and create ONE block
  if (aGroup.type === 'tens' && bGroup.type === 'tens') {
    // tens × tens = one hundred block
    cell.appendChild(makeHundredBlock());
  } else if (aGroup.type === 'tens' && bGroup.type === 'ones') {
    // vertical ten (left side tens) × one = vertical ten
    cell.appendChild(makeVerticalTenBlock());
  } else if (aGroup.type === 'ones' && bGroup.type === 'tens') {
    // one × horizontal ten (top side tens) = horizontal ten
    cell.appendChild(makeHorizontalTenBlock());
  } else {
    // ones × ones = one block
    cell.appendChild(makeOneBlock());
  }
  return cell;
}

// core rendering logic factored out so it can be reused on other pages
export interface RenderGridOptions {
  /**
   * called for each product cell after it's created; return class or mutate directly
   */
  highlight?: (aGroup: Group, bGroup: Group, cell: HTMLElement) => void;
}

export function renderGrid(
  a: number,
  b: number,
  target: HTMLElement,
  options: RenderGridOptions = {}
): void {
  const aGroups = decompose(a);
  const bGroups = decompose(b);

  // Create grid container
  const grid = document.createElement('div');
  grid.className = 'mult-grid';

  // Set grid template
  const numACols = aGroups.reduce((sum, g) => sum + g.count, 0);
  const numBCols = bGroups.reduce((sum, g) => sum + g.count, 0);
  // first column/row for labels, use min-content so they shrink to actual blocks
  grid.style.gridTemplateColumns = `min-content repeat(${numBCols}, min-content)`;
  grid.style.gridTemplateRows = `min-content repeat(${numACols}, min-content)`;

  // Corner cell
  const corner = document.createElement('div');
  corner.className = 'grid-cell corner-cell';
  grid.appendChild(corner);

  // Top labels (B groups)
  for (const bGroup of bGroups) {
    for (let i = 0; i < bGroup.count; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell top-label input-cell';
      if (bGroup.type === 'tens') {
        cell.appendChild(makeHorizontalTenBlock());
      } else {
        cell.appendChild(makeOneBlock());
      }
      grid.appendChild(cell);
    }
  }

  // Left labels (A groups) and products
  for (const aGroup of aGroups) {
    for (let ai = 0; ai < aGroup.count; ai++) {
      // Left label
      const leftCell = document.createElement('div');
      leftCell.className = 'grid-cell left-label input-cell';
      if (aGroup.type === 'tens') {
        leftCell.appendChild(makeVerticalTenBlock());
      } else {
        leftCell.appendChild(makeOneBlock());
      }
      grid.appendChild(leftCell);

      // Product cells
      for (const bGroup of bGroups) {
        for (let bi = 0; bi < bGroup.count; bi++) {
          const productCell = renderProductCell(aGroup, bGroup);
          if (options.highlight) {
            options.highlight(aGroup, bGroup, productCell);
          }
          grid.appendChild(productCell);
        }
      }
    }
  }

  target.innerHTML = '';
  target.appendChild(grid);
}

function init() {
  const a = parseInt(aInput.value) || 0;
  const b = parseInt(bInput.value) || 0;
  renderGrid(a, b, viz);
}

// expose to global so non-module pages can use it
declare global {
  interface Window {
    renderGrid: typeof renderGrid;
  }
}

window.renderGrid = renderGrid;

// wire up inputs
function scheduleRender() {
  // debounce? simple immediate
  init();
}
aInput.addEventListener('input', scheduleRender);
bInput.addEventListener('input', scheduleRender);

// initial render
init();
