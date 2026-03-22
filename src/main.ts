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
  if (ones > 0) groups.push({ type: 'ones', count: ones });
  if (tens > 0) groups.push({ type: 'tens', count: tens });
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
  options: RenderGridOptions = {},
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
  // Extra separator column/row between input headers and product area
  // col 1 = left header blocks, col 2 = left number label, col 3.. = product/header columns
  // row 1 = top header blocks, row 2 = top number label, row 3.. = product/header rows
  grid.style.gridTemplateColumns = `min-content min-content repeat(${numBCols}, min-content)`;
  grid.style.gridTemplateRows = `min-content min-content repeat(${numACols}, min-content)`;

  // Corner cell
  const corner = document.createElement('div');
  corner.className = 'grid-cell corner-cell';
  corner.style.gridColumn = '1';
  corner.style.gridRow = '1';
  grid.appendChild(corner);

  const cornerSpacer = document.createElement('div');
  cornerSpacer.className = 'grid-cell corner-cell';
  cornerSpacer.style.gridColumn = '2';
  cornerSpacer.style.gridRow = '1';
  grid.appendChild(cornerSpacer);

  // Top labels (B groups)
  let topCol = 3;
  for (const bGroup of bGroups) {
    for (let i = 0; i < bGroup.count; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell top-label input-cell';
      cell.style.gridColumn = String(topCol++);
      cell.style.gridRow = '1';
      if (bGroup.type === 'tens') {
        cell.appendChild(makeHorizontalTenBlock());
      } else {
        cell.appendChild(makeOneBlock());
      }
      grid.appendChild(cell);
    }
  }

  const topMidLeftSpacer = document.createElement('div');
  topMidLeftSpacer.className = 'grid-cell corner-cell';
  topMidLeftSpacer.style.gridColumn = '1';
  topMidLeftSpacer.style.gridRow = '2';
  grid.appendChild(topMidLeftSpacer);

  const topMidCenterSpacer = document.createElement('div');
  topMidCenterSpacer.className = 'grid-cell corner-cell';
  topMidCenterSpacer.style.gridColumn = '2';
  topMidCenterSpacer.style.gridRow = '2';
  grid.appendChild(topMidCenterSpacer);

  const topBetweenLabel = document.createElement('div');
  topBetweenLabel.className = 'grid-cell mid-top-label-cell';
  topBetweenLabel.style.gridColumn = `3 / ${3 + numBCols}`;
  topBetweenLabel.style.gridRow = '2';
  topBetweenLabel.innerHTML = `<span class="mid-label-pill">${b}</span>`;
  grid.appendChild(topBetweenLabel);

  // Left labels (A groups) and products
  let productRow = 3;
  for (const aGroup of aGroups) {
    for (let ai = 0; ai < aGroup.count; ai++) {
      // Left label
      const leftCell = document.createElement('div');
      leftCell.className = 'grid-cell left-label input-cell';
      leftCell.style.gridColumn = '1';
      leftCell.style.gridRow = String(productRow);
      if (aGroup.type === 'tens') {
        leftCell.appendChild(makeVerticalTenBlock());
      } else {
        leftCell.appendChild(makeOneBlock());
      }
      grid.appendChild(leftCell);

      // Product cells
      let productCol = 3;
      for (const bGroup of bGroups) {
        for (let bi = 0; bi < bGroup.count; bi++) {
          const productCell = renderProductCell(aGroup, bGroup);
          productCell.style.gridColumn = String(productCol++);
          productCell.style.gridRow = String(productRow);
          if (options.highlight) {
            options.highlight(aGroup, bGroup, productCell);
          }
          grid.appendChild(productCell);
        }
      }

      productRow += 1;
    }
  }

  const leftBetweenLabel = document.createElement('div');
  leftBetweenLabel.className = 'grid-cell mid-left-label-cell';
  leftBetweenLabel.style.gridColumn = '2';
  leftBetweenLabel.style.gridRow = `3 / ${3 + numACols}`;
  leftBetweenLabel.innerHTML = `<span class="mid-label-pill">${a}</span>`;
  grid.appendChild(leftBetweenLabel);

  // Wrap grid with caption
  const wrapper = document.createElement('div');
  wrapper.className = 'area-model-wrapper';

  const caption = document.createElement('div');
  caption.className = 'area-model-caption';
  caption.textContent = `${a} rows of ${b}`;

  wrapper.appendChild(caption);
  wrapper.appendChild(grid);

  target.innerHTML = '';
  target.appendChild(wrapper);
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
