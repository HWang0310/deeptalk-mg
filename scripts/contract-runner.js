/* global process */
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const pluginRoot = resolve(scriptDirectory, '..');
const viteNode = join(pluginRoot, 'node_modules', 'vite-node', 'vite-node.mjs');
const implementation = join(scriptDirectory, 'contract-runner-cli.ts');
const child = spawnSync(
  process.execPath,
  [viteNode, implementation, ...process.argv.slice(2)],
  {cwd: pluginRoot, stdio: 'inherit'},
);

if (child.error) {
  process.stderr.write(`${child.error.message.slice(0, 500)}\n`);
  process.exitCode = 1;
} else if (child.status !== null) {
  process.exitCode = child.status;
} else {
  process.stderr.write(`contract runner terminated by ${child.signal ?? 'an unknown signal'}\n`.slice(0, 500));
  process.exitCode = 1;
}
