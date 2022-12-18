export default function defaultFormatter<T>(value: T) {
  if (value === null || value === undefined) return '';

  return `${value}`;
}
