const TestRunner = require('@json2csv/test-helpers/TestRunner.js');

module.exports = function () {
  const testRunner = new TestRunner('CommonJS');

  testRunner.add('should support cjs require', async (t) => {
    require('@json2csv/whatwg');
  });

  return testRunner;
}