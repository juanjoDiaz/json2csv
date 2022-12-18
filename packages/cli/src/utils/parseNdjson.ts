export default function parseNdJson<T>(input: string, eol: string): Array<T> {
  return input
    .split(eol)
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line) => JSON.parse(line));
}
