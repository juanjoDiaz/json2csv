import tape from 'tape';


interface TestDefinition {
  name: string;
  test: tape.TestCase
}

export default class TestRunner {
  private name: string ;
  private tests: Array<TestDefinition> = [];
  private before: Array<() => void> = [];
  private after: Array<() => void> = [];

  constructor(name: string) {
    this.name = name;
  }

  add(name: string, test: tape.TestCase) {
    this.tests.push({
      name: this.name ? `${this.name} - ${name}` : this.name,
      test,
    });
  }

  addBefore(func: () => void) {
    this.before.push(func);
  }

  addAfter(func: () => void) {
    this.after.push(func);
  }

  async run() {
    try {
      await Promise.all(this.before.map((before) => before()));
      this.tests.forEach(({ name, test }) =>
        tape(name, async (t: tape.Test) => {
          try {
            await test(t);
          } catch (err: any) {
            t.fail(err);
          }
        })
      );
      this.after.forEach((after) => tape.onFinish(after));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}
