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
    ' ' + pad(partial1, numWidth) + `  ← ${a}×${bOnes} (ones)`;
  const partial2Line =
    ' ' + pad(partial2, numWidth) + `  ← ${a}×${bTens} (tens, shifted)`;
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

  const p1 = aOnes * bOnes;
  const p2 = aTens * bOnes;
  const p3 = aOnes * bTens;
  const p4 = aTens * bTens;

  const numWidth = Math.max(
    String(a).length,
    String(b).length,
    String(p1).length,
    String(p2).length,
    String(p3).length,
    String(p4).length,
    String(a * b).length
  );

  const topLine = ' ' + pad(a, numWidth);
  const bottomLine = '×' + pad(b, numWidth);
  const dashLine = '-'.repeat(numWidth + 1);
  const p1Line = ' ' + pad(p1, numWidth) + '  ← ' + bOnes + '×' + aOnes;
  const p2Line = ' ' + pad(p2, numWidth) + '  ← ' + bOnes + '×' + aTens;
  const p3Line = ' ' + pad(p3, numWidth) + '  ← ' + bTens + '×' + aOnes;
  const p4Line = ' ' + pad(p4, numWidth) + '  ← ' + bTens + '×' + aTens;
  const totalLine = ' ' + pad(a * b, numWidth);

  return [
    topLine,
    bottomLine,
    dashLine,
    p1Line,
    p2Line,
    p3Line,
    p4Line,
    dashLine,
    totalLine,
  ].join('\n');
}
