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
      '   27\n' +
        '×  65\n' +
        '-----\n' +
        '   35  ← 5 × 7\n' +
        '  100  ← 5 × 20\n' +
        '  420  ← 60 × 7\n' +
        ' 1200  ← 60 × 20\n' +
        '-----\n' +
        ' 1755'
    );
  });

  it('aligns digits for 7 x 27', () => {
    const result = renderExpandedLongMultiplication(7, 27);
    console.log('\nExpanded form output (7 x 27):\n' + result + '\n');
    expect(result).toBe(
      '   7\n' +
        '× 27\n' +
        '----\n' +
        '  49  ← 7 × 7\n' +
        '   0  ← 7 × 0\n' +
        ' 140  ← 20 × 7\n' +
        '   0  ← 20 × 0\n' +
        '----\n' +
        ' 189'
    );
  });

  it('aligns digits for 7 x 6', () => {
    const result = renderExpandedLongMultiplication(7, 6);
    console.log('\nExpanded form output (7 x 6):\n' + result + '\n');
    expect(result).toBe(
      '  7\n' +
        '× 6\n' +
        '---\n' +
        ' 42  ← 6 × 7\n' +
        '  0  ← 6 × 0\n' +
        '  0  ← 0 × 7\n' +
        '  0  ← 0 × 0\n' +
        '---\n' +
        ' 42'
    );
  });
});

describe('renderTraditionalLongMultiplication', () => {
  it('shows full output for 27 x 65', () => {
    const result = renderTraditionalLongMultiplication(27, 65);
    // Print the full output for visual inspection
    console.log('\nTraditional form output:\n' + result + '\n');
    expect(result).toBe(
      '   27\n' +
        '×  65\n' +
        '-----\n' +
        '  135  ← 27 × 5 (ones)\n' +
        ' 1620  ← 27 × 60 (tens, shifted)\n' +
        '-----\n' +
        ' 1755'
    );
  });

  it('shows full output for 7 x 27', () => {
    const result = renderTraditionalLongMultiplication(7, 27);
    console.log('\nTraditional form output (7 x 27):\n' + result + '\n');
    expect(result).toBe(
      '   7\n' +
        '× 27\n' +
        '----\n' +
        '  49  ← 7 × 7 (ones)\n' +
        ' 140  ← 7 × 20 (tens, shifted)\n' +
        '----\n' +
        ' 189'
    );
  });

  it('shows full output for 7 x 6', () => {
    const result = renderTraditionalLongMultiplication(7, 6);
    console.log('\nTraditional form output (7 x 6):\n' + result + '\n');
    expect(result).toBe(
      '  7\n' +
        '× 6\n' +
        '---\n' +
        ' 42  ← 7 × 6 (ones)\n' +
        '  0  ← 7 × 0 (tens, shifted)\n' +
        '---\n' +
        ' 42'
    );
  });
});
