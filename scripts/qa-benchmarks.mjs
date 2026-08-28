/* global console, process */
import {createHash} from 'node:crypto';
import {existsSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const parseRate = (value) => { const [n, d] = value.split('/').map(Number); return d ? n / d : n; };
export const outputDirectories = (root) => readdirSync(root, {withFileTypes: true})
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('variants') && entry.name !== 'common-brief-trial').map((entry) => entry.name).sort();

export const runQa = (root = resolve('output')) => {
for (const id of outputDirectories(root)) {
  const dir = resolve(root, id); const manifest = JSON.parse(readFileSync(resolve(dir, 'manifest.json'), 'utf8'));
  const required = ['scene.mp4', ...manifest.expected.stills, 'contact-sheet.png'];
  if (required.some((file) => !existsSync(resolve(dir, file)))) throw new Error(`${id}: missing required artifact`);
  const probe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,duration', '-of', 'json', resolve(dir, 'scene.mp4')], {encoding: 'utf8'});
  if (probe.status !== 0) throw new Error(`${id}: ffprobe failed`);
  const data = JSON.parse(probe.stdout); const stream = data.streams[0];
  const qa = {sceneId: id, width: stream.width, height: stream.height, fps: parseRate(stream.r_frame_rate), durationSeconds: Number(stream.duration), expectedDurationSeconds: manifest.expected.durationSeconds, stillCount: manifest.expected.stills.length, sha256: createHash('sha256').update(readFileSync(resolve(dir, 'scene.mp4'))).digest('hex')};
  if (qa.width !== 1920 || qa.height !== 1080 || qa.fps !== 30 || Math.abs(qa.durationSeconds - qa.expectedDurationSeconds) > 1 / 30 + 0.001 || qa.stillCount !== 3) throw new Error(`${id}: qa validation failed`);
  writeFileSync(resolve(dir, 'qa.json'), JSON.stringify({...qa, status: 'pass'}, null, 2) + '\n');
  console.log(`${id}: pass ${qa.sha256.slice(0, 12)}`);
}
};

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) runQa();
