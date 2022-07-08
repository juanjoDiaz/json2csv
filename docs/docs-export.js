import StreamParser from '../packages/parsers/src/StreamParser.js';
window.Json2csvStreamParser = StreamParser;

import { unwind, flatten } from '../packages/transforms/src/index';
window.Json2csvTransforms = { unwind, flatten };