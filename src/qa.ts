export type QaRecord = {
  width: number;
  height: number;
  fps: number;
  durationSeconds: number;
  expectedDurationSeconds: number;
  stillCount: number;
  sha256: string;
};

export function validateQaRecord(record: QaRecord): true {
  if (record.width !== 1920 || record.height !== 1080) throw new Error('dimensions must be 1920x1080');
  if (record.fps !== 30) throw new Error('fps must be 30');
  if (Math.abs(record.durationSeconds - record.expectedDurationSeconds) > 1 / 30 + 0.001) throw new Error('duration is outside one frame');
  if (record.stillCount !== 3) throw new Error('stillCount must be 3');
  if (!/^[a-f0-9]{64}$/.test(record.sha256)) throw new Error('sha256 must be valid');
  return true;
}
