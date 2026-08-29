import {spawnSync} from 'node:child_process';
import {describe, expect, it} from 'vitest';

describe('Contract V1 real render integration', () => {
  const integration = process.env.MG_RUN_REAL_INTEGRATION === '1' ? it : it.skip;

  integration('renders a repeatable causal candidate through the real runner', () => {
    const result = spawnSync('npm', ['run', 'verify:contract-runner'], {encoding: 'utf8'});
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain('contract-runner repeatability: pass');
  }, 180_000);
});
