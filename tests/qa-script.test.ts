import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {outputDirectories} from '../scripts/qa-benchmarks.mjs';

describe('QA output discovery', () => {
  it('ignores overview files while selecting benchmark directories', () => {
    const root = mkdtempSync(join(tmpdir(), 'deeptalk-mg-qa-'));
    mkdirSync(join(root, 'timeline'));
    writeFileSync(join(root, 'benchmark-overview.png'), 'not a directory');
    expect(outputDirectories(root)).toEqual(['timeline']);
  });
});
