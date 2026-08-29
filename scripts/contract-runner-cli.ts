import {main} from './contract-runner';

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : 'contract runner failed';
  process.stderr.write(`${message.slice(0, 500)}\n`);
  process.exitCode = 1;
}
