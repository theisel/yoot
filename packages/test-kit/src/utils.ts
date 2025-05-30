export function createTemplate(segment: string) {
  return (strings: TemplateStringsArray, ...args: unknown[]) => {
    const interpolation = strings.reduce((acc, str, i) => acc + str + (args[i] ?? ''), '');
    return segment.replace('%s', interpolation);
  };
}

export function divide(value: number, by: number, callback?: (value: number) => number) {
  const newValue = value / by;
  return callback?.(newValue) ?? newValue;
}

export function multiply(value: number, by: number, callback?: (value: number) => number) {
  const newValue = value * by;
  return callback?.(newValue) ?? newValue;
}
