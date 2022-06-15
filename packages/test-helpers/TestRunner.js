const tape = require('tape');

class TestRunner {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.before = [];
    this.after = [];
  }

  add(name, test) {
    this.tests.push({
      name: this.name ? `${this.name} - ${name}` : this.name,
      test
    });
  }

  addBefore(func) {
    this.before.push(func);
  }

  addAfter(func) {
    this.after.push(func);
  }

  async run() {
    try {
      await Promise.all(this.before.map(before => before()));
      this.tests.forEach(({ name, test }) => tape(name, async (t) => {
        try {
          await test(t);
        } catch (err) {
          t.fail(err);
        }
      }));
      this.after.forEach(after => tape.onFinish(after));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}

module.exports = TestRunner;