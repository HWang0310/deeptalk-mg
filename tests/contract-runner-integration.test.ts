import {spawnSync} from 'node:child_process';
import {describe, expect, it} from 'vitest';

describe('Contract V1 real render integration', () => {
  const integration = process.env.MG_RUN_REAL_INTEGRATION === '1' ? it : it.skip;

  integration('renders a repeatable causal candidate through the real runner', () => {
    const result = spawnSync('npm', ['run', 'verify:contract-runner'], {encoding: 'utf8'});
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain('canonical command: node scripts/contract-runner.js');
    expect(result.stdout).toContain('version command: node scripts/contract-runner.js --version');
    expect(result.stdout).toContain('plugin_id: org.deeptalk.mg');
    expect(result.stdout).toContain('plugin_version: 1.0.0-contract-v1');
    expect(result.stdout).toContain('binary equality: true');
    const proposalIds = [...result.stdout.matchAll(/proposal_id run[12]: (prop_[a-f0-9]+)/g)].map((match) => match[1]);
    const candidateIds = [...result.stdout.matchAll(/candidate_id run[12]: (cand_[a-f0-9]+)/g)].map((match) => match[1]);
    const mediaShas = [...result.stdout.matchAll(/PRIMARY_MEDIA SHA-256 run[12]: ([a-f0-9]{64})/g)].map((match) => match[1]);
    expect(proposalIds).toHaveLength(2);
    expect(new Set(proposalIds).size).toBe(1);
    expect(candidateIds).toHaveLength(2);
    expect(new Set(candidateIds).size).toBe(1);
    expect(mediaShas).toHaveLength(2);
    expect(new Set(mediaShas).size).toBe(1);
  }, 360_000);
});
