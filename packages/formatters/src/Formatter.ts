type Formatter<T> = (a: T) => string;

// biome-ignore lint/suspicious/noTsIgnore: Required for verbatimModuleSyntax builds - see https://github.com/microsoft/TypeScript/issues/41409
// @ts-ignore
export default Formatter;
