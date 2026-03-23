import { describe, it, expect } from 'vitest';
import { renderExpandedLongMultiplication } from './longMultFormat';
import { renderTraditionalLongMultiplication } from './longMultFormat';

describe('renderExpandedLongMultiplication', () => {
  it('aligns digits for 27 x 65', () => {
    const result = renderExpandedLongMultiplication(27, 65);
    console.log('\nExpanded form output:\n' + result + '\n');
    const lines = result.split('\n');
    // All numbers should be the same width
    const width = lines[0].length;
    for (const line of lines) {
      if (!line.startsWith('-')) {
        expect(line.slice(0, width).length).toBe(width);
      }
    }
    // Find the column of the last digit of the top number (27)
    const topLine = lines[0];
    const lastDigitA = '7';
    const lastDigitB = '5';
    const lastDigitIdx = topLine.lastIndexOf(lastDigitA);
    const bottomLine = lines[1];
    // The last digit of b (65) should be in the same column
    expect(bottomLine[lastDigitIdx]).toBe(lastDigitB); // 65
    // The × should be present
    expect(bottomLine.includes('×')).toBe(true);
    // Check the entire output string
    expect(result).toBe(
      [
        '   27',
        '×  65',
        '-----',
        '   35  ← 5 × 7',
        '  100  ← 5 × 20',
        '  420  ← 60 × 7',
        ' 1200  ← 60 × 20',
        '-----',
        ' 1755',
      ].join('\n'),
    );
  });

  it('aligns digits for 7 x 27', () => {
    const result = renderExpandedLongMultiplication(7, 27);
    console.log('\nExpanded form output (7 x 27):\n' + result + '\n');
    expect(result).toBe(
      [
        '   7',
        '× 27',
        '----',
        '  49  ← 7 × 7',
        ' 140  ← 20 × 7',
        '----',
        ' 189',
      ].join('\n'),
    );
  });

  it('aligns digits for 7 x 6', () => {
    const result = renderExpandedLongMultiplication(7, 6);
    console.log('\nExpanded form output (7 x 6):\n' + result + '\n');
    expect(result).toBe(
      ['  7', '× 6', '---', ' 42  ← 6 × 7', '---', ' 42'].join('\n'),
    );
  });

  it('shows one term for 5 x 8', () => {
    const result = renderExpandedLongMultiplication(5, 8);
    console.log('\nExpanded form output (5 x 8):\n' + result + '\n');
    expect(result).toBe(
      ['  5', '× 8', '---', ' 40  ← 8 × 5', '---', ' 40'].join('\n'),
    );
  });
});

describe('renderTraditionalLongMultiplication', () => {
  it('shows full output for 27 x 65', () => {
    const result = renderTraditionalLongMultiplication(27, 65);
    // Print the full output for visual inspection
    console.log('\nTraditional form output:\n' + result + '\n');
    expect(result).toBe(
      [
        '   27',
        '×  65',
        '-----',
        '  135  ← 27 × 5 (ones)',
        ' 1620  ← 27 × 60 (tens, shifted)',
        '-----',
        ' 1755',
      ].join('\n'),
    );
  });

  it('shows full output for 7 x 27', () => {
    const result = renderTraditionalLongMultiplication(7, 27);
    console.log('\nTraditional form output (7 x 27):\n' + result + '\n');
    expect(result).toBe(
      [
        '   7',
        '× 27',
        '----',
        '  49  ← 7 × 7 (ones)',
        ' 140  ← 7 × 20 (tens, shifted)',
        '----',
        ' 189',
      ].join('\n'),
    );
  });

  it('shows full output for 7 x 6', () => {
    const result = renderTraditionalLongMultiplication(7, 6);
    console.log('\nTraditional form output (7 x 6):\n' + result + '\n');
    expect(result).toBe(
      [
        '  7',
        '× 6',
        '---',
        ' 42  ← 7 × 6 (ones)',
        '  0  ← 7 × 0 (tens, shifted)',
        '---',
        ' 42',
      ].join('\n'),
    );
  });
});
