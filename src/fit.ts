export type TextRole = 'display' | 'body' | 'data' | 'caption' | 'label';
export type FittedCopy = {lines: string[]; role: TextRole};

const CAPACITY: Record<TextRole, readonly [number, number]> = {
  display: [16, 2], body: [22, 3], data: [12, 1], caption: [28, 2], label: [10, 1],
};

export function fitChineseCopy(text: string, role: TextRole): FittedCopy {
  const compact = text.trim();
  const [perLine, maxLines] = CAPACITY[role];
  if (!compact) throw new Error(`${role} text is empty`);
  const lines = Array.from({length: Math.ceil(Array.from(compact).length / perLine)}, (_, index) =>
    Array.from(compact).slice(index * perLine, (index + 1) * perLine).join(''));
  if (lines.length > maxLines) throw new Error(`${role} text does not fit`);
  return {lines, role};
}
