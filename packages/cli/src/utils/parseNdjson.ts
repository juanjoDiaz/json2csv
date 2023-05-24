export default function parseNdJson<T>(input: string, eol: string): Array<T> {
  try {
    return input
      .split(eol)
      .map((line) => line.trim())
      .filter((line) => line !== '')
      .map((line) => JSON.parse(line));
  } catch (err: unknown) {
    throw new Error("Invalid ND-JSON couldn't be parsed");
  }
}
