type Transform<I, O> = (input: I) => O | Array<O>;

// biome-ignore lint/suspicious/noTsIgnore: Required for verbatimModuleSyntax builds - see https://github.com/microsoft/TypeScript/issues/41409
// @ts-ignore
export default Transform;
