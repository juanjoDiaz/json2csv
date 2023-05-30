import {
  type ParserOptions,
  StreamParser,
  type StreamParserOptions,
} from '@json2csv/plainjs';

class JSON2CSVWHATWGTransformer<TRaw extends object, T extends object>
  extends StreamParser<TRaw, T>
  implements Transformer<TRaw, string>
{
  private controller!: TransformStreamDefaultController<string>;

  constructor(
    opts: ParserOptions<TRaw, T> = {},
    asyncOpts: StreamParserOptions = {}
  ) {
    super(opts, asyncOpts);
  }

  override onData(data: string) {
    this.controller.enqueue(data);
  }

  override onError(err: Error) {
    this.controller.error(err);
  }

  override onEnd() {
    this.controller.terminate();
  }

  start(controller: TransformStreamDefaultController) {
    this.controller = controller;
  }

  transform(chunk: TRaw) {
    this.tokenizer.write(chunk as any);
  }

  flush() {
    this.end();
  }
}

interface AwaitableReadableStream<T> extends ReadableStream<T> {
  promise(): Promise<string>;
}

export default class JSON2CSVWHATWGTransformStream<
    TRaw extends object,
    T extends object
  >
  extends TransformStream<TRaw, string>
  implements TransformStream<TRaw, string>, EventTarget
{
  override readonly readable!: AwaitableReadableStream<string>;
  private delegate?: DocumentFragment; // TODO should be (event: Event): boolean

  constructor(
    opts: ParserOptions<TRaw, T> = {},
    asyncOpts: StreamParserOptions = {},
    writableStrategy?: QueuingStrategy<TRaw>,
    readableStrategy?: QueuingStrategy<string>
  ) {
    const transformer = new JSON2CSVWHATWGTransformer<TRaw, T>(opts, asyncOpts);
    super(transformer, writableStrategy, readableStrategy);

    // Implement the EventTarget interface when running on a browser
    if (typeof document === 'object') {
      this.delegate = document.createDocumentFragment();

      transformer.onHeader = (header) =>
        this.dispatchEvent(new CustomEvent('header', { detail: header }));
      transformer.onLine = (line) =>
        this.dispatchEvent(new CustomEvent('line', { detail: line }));
      const origOnData = transformer.onData.bind(transformer);
      transformer.onData = (data) => {
        origOnData(data);
        this.dispatchEvent(new CustomEvent('data', { detail: data }));
      };
    }

    this.readable.promise = async () => {
      let csv = '';
      const outputStream = new WritableStream({
        write(chunk) {
          csv += chunk;
        },
      });

      await this.readable.pipeTo(outputStream);
      return csv;
    };
  }

  public addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {
    this.delegate?.addEventListener(type, callback, options);
  }

  public dispatchEvent(event: Event): boolean {
    return this.delegate?.dispatchEvent(event) ?? false;
  }

  public removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions | undefined
  ): void {
    this.delegate?.removeEventListener(type, callback, options);
  }
}
