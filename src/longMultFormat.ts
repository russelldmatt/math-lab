export function pad(num: number, width: number) {
  return num.toString().padStart(width, ' ');
}

export function renderTraditionalLongMultiplication(a: number, b: number) {
  const bTens = Math.floor(b / 10) * 10;
  const bOnes = b % 10;
  const partial1 = a * bOnes;
  const partial2 = a * bTens;

  const numWidth = Math.max(
    String(a).length,
    String(b).length,
    String(partial1).length,
    String(partial2).length,
    String(a * b).length
  );

  const topLine = ' ' + pad(a, numWidth);
  const bottomLine = '×' + pad(b, numWidth);
  const dashLine = '-'.repeat(numWidth + 1);
  const partial1Line =
    ' ' + pad(partial1, numWidth) + `  ← ${a} × ${bOnes} (ones)`;
  const partial2Line =
    ' ' + pad(partial2, numWidth) + `  ← ${a} × ${bTens} (tens, shifted)`;
  const totalLine = ' ' + pad(a * b, numWidth);

  return [
    topLine,
    bottomLine,
    dashLine,
    partial1Line,
    partial2Line,
    dashLine,
    totalLine,
  ].join('\n');
}

export function renderExpandedLongMultiplication(a: number, b: number) {
  const aTens = Math.floor(a / 10) * 10;
  const aOnes = a % 10;
  const bTens = Math.floor(b / 10) * 10;
  const bOnes = b % 10;

  // Expanded term count is based on digit count:
  // 1-digit × 1-digit => 1 term
  // 2-digit × 1-digit (or 1-digit × 2-digit) => 2 terms
  // 2-digit × 2-digit => 4 terms
  const aParts = a >= 10 ? [aOnes, aTens] : [aOnes];
  const bParts = b >= 10 ? [bOnes, bTens] : [bOnes];

  const terms: Array<{ value: number; left: number; right: number }> = [];
  for (const left of bParts) {
    for (const right of aParts) {
      terms.push({ value: left * right, left, right });
    }
  }

  const numWidth = Math.max(
    String(a).length,
    String(b).length,
    ...terms.map((t) => String(t.value).length),
    String(a * b).length
  );

  const topLine = ' ' + pad(a, numWidth);
  const bottomLine = '×' + pad(b, numWidth);
  const dashLine = '-'.repeat(numWidth + 1);
  const termLines = terms.map(
    (t) => ' ' + pad(t.value, numWidth) + '  ← ' + t.left + ' × ' + t.right
  );
  const totalLine = ' ' + pad(a * b, numWidth);

  return [
    topLine,
    bottomLine,
    dashLine,
    ...termLines,
    dashLine,
    totalLine,
  ].join('\n');
}
