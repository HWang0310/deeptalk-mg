/* global process */
import {mkdirSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';

const ids = ['core-judgment', 'causal-chain', 'process-cycle', 'comparison', 'numeric-change', 'multi-node', 'timeline', 'abstract-explanation'];
const root = resolve('output');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const call = (args) => {
  const result = spawnSync('npx', args, {stdio: 'inherit'});
  if (result.status !== 0) process.exit(result.status ?? 1);
};

for (const id of ids) {
  const dir = resolve(root, id); mkdirSync(dir, {recursive: true});
  const common = ['src/index.ts', `Benchmark-${id}`, `--browser-executable=${chrome}`, '--concurrency=1', '--log=error'];
  call(['remotion', 'render', ...common, resolve(dir, 'scene.mp4'), '--codec=h264']);
  call(['remotion', 'still', ...common, resolve(dir, 'opening.png'), '--frame=0']);
  call(['remotion', 'still', ...common, resolve(dir, 'primary.png'), '--frame=36']);
  call(['remotion', 'still', ...common, resolve(dir, 'full.png'), '--frame=239']);
  call(['ffmpeg', '-y', '-loglevel', 'error', '-i', resolve(dir, 'opening.png'), '-i', resolve(dir, 'primary.png'), '-i', resolve(dir, 'full.png'), '-filter_complex', 'hstack=inputs=3', resolve(dir, 'contact-sheet.png')]);
  writeFileSync(resolve(dir, 'manifest.json'), JSON.stringify({sceneId: id, composition: `Benchmark-${id}`, expected: {width: 1920, height: 1080, fps: 30, durationSeconds: 8, stills: ['opening.png', 'primary.png', 'full.png']}}, null, 2) + '\n');
}
