## [7.0.7](https://github.com/juanjodiaz/json2csv/compare/v7.0.6...v7.0.7) (2025-01-26)

### Bug Fixes

* fix incorrect docs about transformers actions ([150cef3](https://github.com/juanjodiaz/json2csv/commit/150cef340f52e1b6eef9f3ded1d9bbd2b32f2a96))
* infinite loop in flatten ([e81cd60](https://github.com/juanjodiaz/json2csv/commit/e81cd604192222133f32f3c12d72bc8b5e27994a))

## [7.0.6](https://github.com/juanjodiaz/json2csv/compare/v7.0.5...v7.0.6) (2024-02-11)


### Bug Fixes

* remove legacy unused settings ([bbe451e](https://github.com/juanjodiaz/json2csv/commit/bbe451eea76c7dc757622fb2fc62afeed4836964))

## [7.0.5](https://github.com/juanjodiaz/json2csv/compare/v7.0.4...v7.0.5) (2024-01-20)


### Bug Fixes

* fix typings of WHATWG AsyncParser ([610e292](https://github.com/juanjodiaz/json2csv/commit/610e292746ce3349c213b10c2a03d05a77b3dc58))
* update streamparser version on CDN build ([ab22f53](https://github.com/juanjodiaz/json2csv/commit/ab22f535aef94f430408da1d104298935eb25562))


### Performance Improvements

* cache regular expresions for string formatters ([dcaadcf](https://github.com/juanjodiaz/json2csv/commit/dcaadcfce3fb072d920f4f99fdef583adbbcb522))

## [7.0.4](https://github.com/juanjodiaz/json2csv/compare/v7.0.3...v7.0.4) (2023-11-05)

## [7.0.3](https://github.com/juanjodiaz/json2csv/compare/v7.0.2...v7.0.3) (2023-08-24)


### Bug Fixes

* fix CDN build & set esbuild to use es2019 ([d59606e](https://github.com/juanjodiaz/json2csv/commit/d59606eb3b01c20ab46547aaddf00e7611c670cd))

## [7.0.3](https://github.com/juanjodiaz/json2csv/compare/v7.0.2...v7.0.3) (2023-08-24)


### Bug Fixes

* fix CDN build & set esbuild to use es2019 ([d59606e](https://github.com/juanjodiaz/json2csv/commit/d59606eb3b01c20ab46547aaddf00e7611c670cd))

### [7.0.2](https://github.com/juanjodiaz/json2csv/compare/v7.0.1...v7.0.2) (2023-08-16)


### Bug Fixes

* wrong "main" in formatters package.json affecting eslint ([3179a05](https://github.com/juanjodiaz/json2csv/commit/3179a05957c3a357f7752b41b1ad0a77c4f2e54c))

### [7.0.1](https://github.com/juanjodiaz/json2csv/compare/v7.0.0...v7.0.1) (2023-05-31)


### Bug Fixes

* Maximum call stack size exceeded on whatwg interface ([ea44d4e](https://github.com/juanjodiaz/json2csv/commit/ea44d4e642c38529610b509383c034cb9cf41696))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [7.0.0](https://github.com/juanjodiaz/json2csv/compare/v6.1.3...v7.0.0) (2023-05-26)

* library moved to Typescript.

### Bug Fixes

* fix issue with CLI and node JSON import warnings ([d316310](https://github.com/juanjodiaz/json2csv/commit/d31631021344ceded78fd111a8d7cd795159b49d))
* rebase issues ([8eeca7d](https://github.com/juanjodiaz/json2csv/commit/8eeca7d6da88f033d581b8facf4a46080db33814))


### Features

* improve error messaging for invalid inputs ([471849f](https://github.com/juanjodiaz/json2csv/commit/471849f4b203d6e9ac741eb9d4b9c14b045ba838))

### [6.1.3](https://github.com/juanjodiaz/json2csv/compare/v6.1.2...v6.1.3) (2023-04-02)


### Bug Fixes

* add AsyncParser to whatwg export ([81ada93](https://github.com/juanjodiaz/json2csv/commit/81ada93184ed96bbc43d95fb2cfb6aa545b0e017))
* add transform dependency to CLI ([e06961c](https://github.com/juanjodiaz/json2csv/commit/e06961c4308ead917094e8bd6f29357eb21901b4))

### [6.1.2](https://github.com/juanjodiaz/json2csv/compare/v6.1.1...v6.1.2) (2022-11-14)


### Bug Fixes

* add cjs built files during prepublish ([e895ac3](https://github.com/juanjodiaz/json2csv/commit/e895ac3b0bb099bdef25341a8da4f05cdb4d2a9a))

### [6.1.1](https://github.com/juanjodiaz/json2csv/compare/v6.1.0...v6.1.1) (2022-11-08)


### Bug Fixes

* avoid unnecessary exception on flattenReducer ([8b7dd1e](https://github.com/juanjodiaz/json2csv/commit/8b7dd1eca04be9d0ae5b569f759a5ab04b69493c))

## [6.1.0](https://github.com/juanjodiaz/json2csv/compare/v6.0.0...v6.1.0) (2022-10-30)


### Features

* add cjs support back ([80c0b2e](https://github.com/juanjodiaz/json2csv/commit/80c0b2ee55f8ca95acc57fe832fdb21bff5d4a38))

## [6.0.0](https://github.com/juanjodiaz/json2csv/compare/v6.0.0-alpha.4...v6.0.0) (2022-09-22)

### ⚠ BREAKING CHANGES

* library broken into multiple independent npm packages

### Bug Fixes

* handle exceptions in transforms properly in streaming APIs ([48eff4a](https://github.com/juanjodiaz/json2csv/commit/48eff4ab4b96ffd78bf9f1f5b48325dd79b3e435))

## [6.0.0-alpha.4](https://github.com/juanjodiaz/json2csv/compare/v6.0.0-alpha.2...v6.0.0-alpha.4) (2022-09-11)


### Features

* add error handling to try it life! ([950c4e8](https://github.com/juanjodiaz/json2csv/commit/950c4e8dda171e36b4b0ab39d95c8bd57d9dff52))


### Bug Fixes

* add inter-package dependencies explicitely ([d3b38c1](https://github.com/juanjodiaz/json2csv/commit/d3b38c1f51d0db7c52a95142c3d60cbfb3a43a3a))
* add js extension to formatters in BaseParser ([13ce920](https://github.com/juanjodiaz/json2csv/commit/13ce920915e37572a15d639cc1bdb7548809140a))
* fix package exports adding .js extension wrongly ([bb228bc](https://github.com/juanjodiaz/json2csv/commit/bb228bc21a3341742d37d8501867097e5a0b4cb4))
* pull CDN lodash from gh instead of npm so ti supports es6 imports ([3e28e55](https://github.com/juanjodiaz/json2csv/commit/3e28e55be2ad5ebd4e18c2c0f151e2c392f5505b))

## [6.0.0-alpha.2](https://github.com/juanjodiaz/json2csv/compare/v6.0.0-alpha.1...v6.0.0-alpha.2)  (2022-08-21)


### Bug Fixes

* enforce \n EOL for backslashBeforeNewLine tests ([149507d](https://github.com/juanjodiaz/json2csv/commit/149507d7e6e445d50f5be2c4e6e319d936d03c3f))
* enforce \n EOL for quoteOnlyIfNecessary tests ([0af4dcd](https://github.com/juanjodiaz/json2csv/commit/0af4dcd7f0c7b023ee450a3e138fa417e7a84311))
* fix cache for Windows builds ([b4d1a60](https://github.com/juanjodiaz/json2csv/commit/b4d1a603a682f7c756b2c8ace400921e32fec0ed))
* fix json packages and ensure consistent order of its fields ([0b0ce1e](https://github.com/juanjodiaz/json2csv/commit/0b0ce1ee96637b2731f8343aa69e60fb3ac1b262))
* remove tests about preserving tabs since they are historical and don't make sense anymore ([6abb57a](https://github.com/juanjodiaz/json2csv/commit/6abb57a46930d435b570a862a721aad2cafe4acb))
* typo in test name ([d05c5ae](https://github.com/juanjodiaz/json2csv/commit/d05c5ae701d5f4f674e283e91dae58c5c9499f62))
* use correct line endings on windows when using prettyprint, ndjson or transforms ([3c27a69](https://github.com/juanjodiaz/json2csv/commit/3c27a693f3807649e71f39873856d67b84173615))


### Performance Improvements

* bring back v5 perf improvements and add some new ones ([288800b](https://github.com/juanjodiaz/json2csv/commit/288800bd4f3d5c5b9ba76129725b435eec3c1869))

## [6.0.0-alpha.1](https://github.com/zemirco/json2csv/compare/v6.0.0-alpha.0...v6.0.0-alpha.1) (2022-02-23)


### Features

* expose JSON2CSVStreamParser ([d476707](https://github.com/zemirco/json2csv/commit/d47670780f3dd07299ece99c7a5de409f714d21f))


### Bug Fixes

* fix missing ndjson option to CLI ([885e28b](https://github.com/zemirco/json2csv/commit/885e28bef66777d715f6df575f971525391efbbe))
* fix some issues in the AsyncParser tests ([695f116](https://github.com/zemirco/json2csv/commit/695f116cca80f316a802b85c6065ad5db3b9d2d8))
* reset lockfile due to changes in url patterns for github ([b589372](https://github.com/zemirco/json2csv/commit/b58937294b383946067f0eb415e484f645c420f0))
* unwind transform issue with nested arrays ([#548](https://github.com/zemirco/json2csv/issues/548)) ([3cb57f3](https://github.com/zemirco/json2csv/commit/3cb57f3357b053ce0d4a26e474dae10e07d14ac4))
* update engines and volta ([98984dd](https://github.com/zemirco/json2csv/commit/98984ddd479439c904c8434cafac6bdbabf2e6f2))

## [6.0.0-alpha.0](https://github.com/zemirco/json2csv/compare/v5.0.3...v6.0.0-alpha.0) (2021-04-14)


### ⚠ BREAKING CHANGES

* Drop support for Node < v12
* AsyncParser API has changed, see the `Upgrading from 5.X to 6.X` section for details.

* fix: consolidate the API of AsyncParser and parseAsync

* feat: simplify AsyncParser

* chore: drop support for node 11

* refactor: improve AsyncParser parse method

* docs: add links to node docs and fix few small issues
* In the JavaScript modules, `formatters` are introduced and the `quote`, `escapedQuote` and `excelStrings` options are removed. See the migration notes in the readme. CLI hasn't changed.

### Features

* Introduce formatters ([#455](https://github.com/zemirco/json2csv/issues/455)) ([88ed6ee](https://github.com/zemirco/json2csv/commit/88ed6ee780b439d394235c9e8fac7e42b0d614dd))
* use jsonparse for ND-JSON instead of the custom made implementation ([#493](https://github.com/zemirco/json2csv/issues/493)) ([55aa0c7](https://github.com/zemirco/json2csv/commit/55aa0c70374def0dafa342d2a122d077eb87d5e1))


### Bug Fixes

* consolidate the API of AsyncParser and parseAsync ([#492](https://github.com/zemirco/json2csv/issues/492)) ([bcce91f](https://github.com/zemirco/json2csv/commit/bcce91f953625bb6a3b401d839670bb3cb5ba11a))
* issue with unwind and empty arrays creating an extra column ([#497](https://github.com/zemirco/json2csv/issues/497)) ([3b74735](https://github.com/zemirco/json2csv/commit/3b747359b086ec212a0f6ecb92ec0a40511f75c3))
* Performance optimizations ([#491](https://github.com/zemirco/json2csv/issues/491)) ([471f5a7](https://github.com/zemirco/json2csv/commit/471f5a7a55375a06a66ce4b0438583d719d6db8f))
* prevents Parser and AsyncParser from caching the fields option between executions causing issues and inconsistencies ([#498](https://github.com/zemirco/json2csv/issues/498)) ([4d8a81a](https://github.com/zemirco/json2csv/commit/4d8a81a3139024c31377fc62e4e39ece29e72c8c))
* simplify stringExcel formatter and support proper escaping ([#513](https://github.com/zemirco/json2csv/issues/513)) ([50062c3](https://github.com/zemirco/json2csv/commit/50062c3e155ff2c12b1bb417085188a2156885a8))

### [5.0.3](https://github.com/zemirco/json2csv/compare/v5.0.2...v5.0.3) (2020-09-24)


### Bug Fixes

* audit dependencies fix ([d6d0fc7](https://github.com/zemirco/json2csv/commit/d6d0fc78128e01e021414aaf52a65cbcd09a1225))
* update commander dep ([322e568](https://github.com/zemirco/json2csv/commit/322e568793ec4a64f43ec2ac82c9886177bcc4ed))

### [5.0.2](https://github.com/zemirco/json2csv/compare/v5.0.1...v5.0.2) (2020-09-24)


### Bug Fixes

* **cli:** fix relative paths issue in CLI when not streaming ([#488](https://github.com/zemirco/json2csv/issues/488)) ([06079e8](https://github.com/zemirco/json2csv/commit/06079e840128030eacfecde66da11295eb162234))

### [5.0.1](https://github.com/zemirco/json2csv/compare/v5.0.0...v5.0.1) (2020-04-28)


### Bug Fixes

* wrong call to processValue ([#454](https://github.com/zemirco/json2csv/issues/454)) ([66abd45](https://github.com/zemirco/json2csv/commit/66abd45))

## [5.0.0](https://github.com/zemirco/json2csv/compare/v4.5.2...v5.0.0) (2020-03-15)


### ⚠ BREAKING CHANGES

* Node 8 and 9 no longer supported, use Node 10 or greater. It might still work, but it has reached End-Of-Life.
* module no longer takes `unwind`, `unwindBlank`, `flatten` or the `flattenSeparator` options, instead see the new `transforms` option. CLI options are unchanged from the callers side, but use the built in transforms under the hood.

* Add support for transforms

* Add documentation about transforms
* remove extra commonjs build, use starting point in package.json `main` field.
* Renamed `doubleQuote` to `escapedQuote`
* remove `stringify` option
* `--fields-config` option has been removed, use the new `--config` option for all configuration, not just fields.
* Drop node 6 and 7, and add node 11 and 12

### Bug Fixes

* Always error asynchronously from parseAsync method ([#412](https://github.com/zemirco/json2csv/issues/412)) ([16cc044](https://github.com/zemirco/json2csv/commit/16cc044))
* audit deps ([15992cf](https://github.com/zemirco/json2csv/commit/15992cf))
* drop Node 8 and 9 ([7295465](https://github.com/zemirco/json2csv/commit/7295465))
* Make some CLI options mandatory ([#433](https://github.com/zemirco/json2csv/issues/433)) ([bd51527](https://github.com/zemirco/json2csv/commit/bd51527))
* Remove CommonJS build ([#422](https://github.com/zemirco/json2csv/issues/422)) ([5ce0089](https://github.com/zemirco/json2csv/commit/5ce0089))
* Remove stringify option ([#419](https://github.com/zemirco/json2csv/issues/419)) ([39f303d](https://github.com/zemirco/json2csv/commit/39f303d))
* Rename doubleQuote to escapedQuote ([#418](https://github.com/zemirco/json2csv/issues/418)) ([f99408c](https://github.com/zemirco/json2csv/commit/f99408c))
* update CI node versions ([#413](https://github.com/zemirco/json2csv/issues/413)) ([6fd6c09](https://github.com/zemirco/json2csv/commit/6fd6c09))
* update commander cli dep ([74aa40a](https://github.com/zemirco/json2csv/commit/74aa40a))
* update commander dep ([272675b](https://github.com/zemirco/json2csv/commit/272675b))
* **deps:** audit dependencies ([bf9877a](https://github.com/zemirco/json2csv/commit/bf9877a))
* **deps:** update commander ([3f099f2](https://github.com/zemirco/json2csv/commit/3f099f2))
* **security:** fix audit vulnerabilities ([b57715b](https://github.com/zemirco/json2csv/commit/b57715b))


### Features

* Add support for flattening arrays and change transforms arguments to an object. ([#432](https://github.com/zemirco/json2csv/issues/432)) ([916e448](https://github.com/zemirco/json2csv/commit/916e448))
* Add support for transforms ([#431](https://github.com/zemirco/json2csv/issues/431)) ([f1d04d0](https://github.com/zemirco/json2csv/commit/f1d04d0))
* Improve async promise to optionally not return ([#421](https://github.com/zemirco/json2csv/issues/421)) ([3e296f6](https://github.com/zemirco/json2csv/commit/3e296f6))
* Improves the unwind transform so it unwinds all unwindable fields if … ([#434](https://github.com/zemirco/json2csv/issues/434)) ([ec1f301](https://github.com/zemirco/json2csv/commit/ec1f301))
* replace fields config by a global config ([#338](https://github.com/zemirco/json2csv/issues/338)) ([d6c1c5f](https://github.com/zemirco/json2csv/commit/d6c1c5f))

## [4.5.2](https://github.com/zemirco/json2csv/compare/v4.5.1...v4.5.2) (2019-07-05)


### Bug Fixes

* Improve the inference of the header name when using function as value ([#395](https://github.com/zemirco/json2csv/issues/395)) ([590d19a](https://github.com/zemirco/json2csv/commit/590d19a))



<a name="4.4.0"></a>
## [4.4.0](https://github.com/zemirco/json2csv/compare/v4.3.5...v4.4.0) (2019-03-25)


### Features

* Performance improvements and new async api ([#360](https://github.com/zemirco/json2csv/issues/360)) ([d59dea1](https://github.com/zemirco/json2csv/commit/d59dea1))


<a name="4.3.5"></a>
## [4.3.5](https://github.com/zemirco/json2csv/compare/v4.3.4...v4.3.5) (2019-02-22)


### Bug Fixes

* audit deps ([3182707](https://github.com/zemirco/json2csv/commit/3182707))
* unwind of nested fields ([#357](https://github.com/zemirco/json2csv/issues/357)) ([2d69281](https://github.com/zemirco/json2csv/commit/2d69281))



<a name="4.3.4"></a>
## [4.3.4](https://github.com/zemirco/json2csv/compare/v4.3.3...v4.3.4) (2019-02-11)


### Bug Fixes

* issue with fields.value function not receiving correct fields ([#353](https://github.com/zemirco/json2csv/issues/353)) ([851c02f](https://github.com/zemirco/json2csv/commit/851c02f))



<a name="4.3.3"></a>
## [4.3.3](https://github.com/zemirco/json2csv/compare/v4.3.2...v4.3.3) (2019-01-11)


### Bug Fixes

* audit dep fix ([1ef4bcd](https://github.com/zemirco/json2csv/commit/1ef4bcd))
* Remove invalid reference to flat ([#347](https://github.com/zemirco/json2csv/issues/347)) ([130ef7d](https://github.com/zemirco/json2csv/commit/130ef7d))
* Remove preferGlobal from package.json ([#346](https://github.com/zemirco/json2csv/issues/346)) ([2b6ad3a](https://github.com/zemirco/json2csv/commit/2b6ad3a))



<a name="4.3.2"></a>
## [4.3.2](https://github.com/zemirco/json2csv/compare/v4.3.1...v4.3.2) (2018-12-08)


### Bug Fixes

* Remove lodash.clonedeep dependency ([#339](https://github.com/zemirco/json2csv/issues/339)) ([d28955a](https://github.com/zemirco/json2csv/commit/d28955a)), closes [#333](https://github.com/zemirco/json2csv/issues/333)



<a name="4.3.1"></a>
## [4.3.1](https://github.com/zemirco/json2csv/compare/v4.3.0...v4.3.1) (2018-11-17)


### Bug Fixes

* Return correct exit code on error ([#337](https://github.com/zemirco/json2csv/issues/337)) ([a793de5](https://github.com/zemirco/json2csv/commit/a793de5))



<a name="4.3.0"></a>
# [4.3.0](https://github.com/zemirco/json2csv/compare/v4.2.1...v4.3.0) (2018-11-05)


### Bug Fixes

* Optimize performance around the usage of fields ([#328](https://github.com/zemirco/json2csv/issues/328)) ([d9e4463](https://github.com/zemirco/json2csv/commit/d9e4463))
* Remove wrong submodule ([#326](https://github.com/zemirco/json2csv/issues/326)) ([6486bb0](https://github.com/zemirco/json2csv/commit/6486bb0))


### Features

* Add support for objectMode in the stream API ([#325](https://github.com/zemirco/json2csv/issues/325)) ([8f0ae55](https://github.com/zemirco/json2csv/commit/8f0ae55))



<a name="4.2.1"></a>
## [4.2.1](https://github.com/zemirco/json2csv/compare/v4.2.0...v4.2.1) (2018-08-06)


### Bug Fixes

* bug that modifies opts after parsing an object/stream ([#318](https://github.com/zemirco/json2csv/issues/318)) ([f0a4830](https://github.com/zemirco/json2csv/commit/f0a4830))
* Clean up the flattening separator feature ([#315](https://github.com/zemirco/json2csv/issues/315)) ([ee3d181](https://github.com/zemirco/json2csv/commit/ee3d181))



<a name="4.2.0"></a>
# [4.2.0](https://github.com/zemirco/json2csv/compare/v4.1.6...v4.2.0) (2018-07-31)


### Features

* Added flattenSeparator option ([#314](https://github.com/zemirco/json2csv/issues/314)) ([5c5de9f](https://github.com/zemirco/json2csv/commit/5c5de9f))



<a name="4.1.6"></a>
## [4.1.6](https://github.com/zemirco/json2csv/compare/v4.1.5...v4.1.6) (2018-07-12)


### Bug Fixes

* Update dependencies and remove cli-table2 dependency ([#312](https://github.com/zemirco/json2csv/issues/312)) ([5981ba3](https://github.com/zemirco/json2csv/commit/5981ba3))



<a name="4.1.5"></a>
## [4.1.5](https://github.com/zemirco/json2csv/compare/v4.1.4...v4.1.5) (2018-06-26)


### Bug Fixes

* Process stdin as a stream ([#308](https://github.com/zemirco/json2csv/issues/308)) ([2b186b6](https://github.com/zemirco/json2csv/commit/2b186b6))



<a name="4.1.4"></a>
## [4.1.4](https://github.com/zemirco/json2csv/compare/v4.1.3...v4.1.4) (2018-06-23)


### Bug Fixes

* don't escape tabs ([#305](https://github.com/zemirco/json2csv/issues/305)) ([a36c8e3](https://github.com/zemirco/json2csv/commit/a36c8e3))



<a name="4.1.3"></a>
## [4.1.3](https://github.com/zemirco/json2csv/compare/v4.1.2...v4.1.3) (2018-05-23)


### Bug Fixes

* Escape custom quotes correctly ([#301](https://github.com/zemirco/json2csv/issues/301)) ([7d57208](https://github.com/zemirco/json2csv/commit/7d57208))



<a name="4.1.2"></a>
## [4.1.2](https://github.com/zemirco/json2csv/compare/v4.1.1...v4.1.2) (2018-04-16)


### Bug Fixes

* **tests:** Skip bogus pretty print tests only in old node versions ([#290](https://github.com/zemirco/json2csv/issues/290)) ([0f3b885](https://github.com/zemirco/json2csv/commit/0f3b885))



<a name="4.1.1"></a>
## [4.1.1](https://github.com/zemirco/json2csv/compare/v4.1.0...v4.1.1) (2018-04-16)


### Bug Fixes

*  readme CLI's info ([#289](https://github.com/zemirco/json2csv/issues/289)) ([9fe65b3](https://github.com/zemirco/json2csv/commit/9fe65b3))
* Add tests and docs to unwind-blank feature ([#287](https://github.com/zemirco/json2csv/issues/287)) ([e3d4a05](https://github.com/zemirco/json2csv/commit/e3d4a05))
* **perf:** Improve unwind performance and maintainability ([#288](https://github.com/zemirco/json2csv/issues/288)) ([80e496d](https://github.com/zemirco/json2csv/commit/80e496d))



<a name="4.1.0"></a>
## [4.1.0](https://github.com/zemirco/json2csv/compare/v4.0.4...v4.1.0) (2018-04-16)


### Bug Fixes

* Avoid redundant deep cloning when unwinding. ([#286](https://github.com/zemirco/json2csv/issues/286)) ([95a6ca9](https://github.com/zemirco/json2csv/commit/95a6ca9))


### Features

* Add ability to unwind by blanking out instead of repeating data ([#285](https://github.com/zemirco/json2csv/issues/285)) ([61d9808](https://github.com/zemirco/json2csv/commit/61d9808))



<a name="4.0.4"></a>
## [4.0.4](https://github.com/zemirco/json2csv/compare/v4.0.3...v4.0.4) (2018-04-10)


### Bug Fixes

* comment out failing tests ([#283](https://github.com/zemirco/json2csv/issues/283)) ([5b25eaa](https://github.com/zemirco/json2csv/commit/5b25eaa))
* Support empty array with opts.fields ([#281](https://github.com/zemirco/json2csv/issues/281)) ([eccca89](https://github.com/zemirco/json2csv/commit/eccca89))
* **tests:** emit correct lines from transform ([#282](https://github.com/zemirco/json2csv/issues/282)) ([2322ddf](https://github.com/zemirco/json2csv/commit/2322ddf))



<a name="4.0.3"></a>
## [4.0.3](https://github.com/zemirco/json2csv/compare/v4.0.2...v4.0.3) (2018-04-09)


### Bug Fixes

* error when a field is null and flatten is used ([#274](https://github.com/zemirco/json2csv/issues/274)) ([1349a94](https://github.com/zemirco/json2csv/commit/1349a94))
* throw error for empty dataset only if fields not specified ([0d8534e](https://github.com/zemirco/json2csv/commit/0d8534e))



<a name="4.0.2"></a>
## [4.0.2](https://github.com/zemirco/json2csv/compare/v4.0.1...v4.0.2) (2018-03-09)


### Bug Fixes

* **parser:** RangeError ([#271](https://github.com/zemirco/json2csv/issues/271)) ([c8d5a87](https://github.com/zemirco/json2csv/commit/c8d5a87))



<a name="4.0.1"></a>
## [4.0.1](https://github.com/zemirco/json2csv/compare/v4.0.0...v4.0.1) (2018-03-05)


### Bug Fixes

* double quote escaping before new line ([#268](https://github.com/zemirco/json2csv/issues/268)) ([fa991cf](https://github.com/zemirco/json2csv/commit/fa991cf))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/zemirco/json2csv/compare/v4.0.0-alpha.2...v4.0.0) (2018-02-27)


### Bug Fixes

* Replace webpack with rollup packaging ([#266](https://github.com/zemirco/json2csv/issues/266)) ([a9f8020](https://github.com/zemirco/json2csv/commit/a9f8020))


### Features

* Pass transform options through ([#262](https://github.com/zemirco/json2csv/issues/262)) ([650913f](https://github.com/zemirco/json2csv/commit/650913f))



<a name="4.0.0-alpha.2"></a>
# [4.0.0-alpha.2](https://github.com/zemirco/json2csv/compare/v4.0.0-alpha.1...v4.0.0-alpha.2) (2018-02-25)


### Bug Fixes

* flatten issue with toJSON ([#259](https://github.com/zemirco/json2csv/issues/259)) ([7006d2b](https://github.com/zemirco/json2csv/commit/7006d2b))



<a name="4.0.0-alpha.1"></a>
# [4.0.0-alpha.1](https://github.com/zemirco/json2csv/compare/v4.0.0-alpha.0...v4.0.0-alpha.1) (2018-02-21)


### Bug Fixes

* Remove TypeScript definition ([#256](https://github.com/zemirco/json2csv/issues/256)) ([4f09694](https://github.com/zemirco/json2csv/commit/4f09694))



<a name="4.0.0-alpha.0"></a>
# [4.0.0-alpha.0](https://github.com/zemirco/json2csv/compare/v3.11.5...v4.0.0-alpha.0) (2018-02-21)


### Bug Fixes

* Add CLI tests ([#247](https://github.com/zemirco/json2csv/issues/247)) ([bb8126f](https://github.com/zemirco/json2csv/commit/bb8126f))
* Add excel string to cli and standardize ([#231](https://github.com/zemirco/json2csv/issues/231)) ([421baad](https://github.com/zemirco/json2csv/commit/421baad))
* Allow passing ldjson input files ([#220](https://github.com/zemirco/json2csv/issues/220)) ([9c861ed](https://github.com/zemirco/json2csv/commit/9c861ed))
* Avoid throwing an error on elements that can't be stringified (like functions) ([#223](https://github.com/zemirco/json2csv/issues/223)) ([679c687](https://github.com/zemirco/json2csv/commit/679c687))
* backslash logic ([#222](https://github.com/zemirco/json2csv/issues/222)) ([29e9445](https://github.com/zemirco/json2csv/commit/29e9445))
* broken stdin input ([#241](https://github.com/zemirco/json2csv/issues/241)) ([6cb407c](https://github.com/zemirco/json2csv/commit/6cb407c))
* Combine EOL and newLine parameters ([#219](https://github.com/zemirco/json2csv/issues/219)) ([4668a8b](https://github.com/zemirco/json2csv/commit/4668a8b))
* header flag ([#221](https://github.com/zemirco/json2csv/issues/221)) ([7f7338f](https://github.com/zemirco/json2csv/commit/7f7338f))
* outdated jsdoc ([#243](https://github.com/zemirco/json2csv/issues/243)) ([efe9888](https://github.com/zemirco/json2csv/commit/efe9888))
* pretty print issues ([#242](https://github.com/zemirco/json2csv/issues/242)) ([3bd9655](https://github.com/zemirco/json2csv/commit/3bd9655))
* Process header cells as any other cell ([#244](https://github.com/zemirco/json2csv/issues/244)) ([1fcde13](https://github.com/zemirco/json2csv/commit/1fcde13))
* Remove callback support ([2096ade](https://github.com/zemirco/json2csv/commit/2096ade))
* Remove fieldNames ([#232](https://github.com/zemirco/json2csv/issues/232)) ([6cc74b2](https://github.com/zemirco/json2csv/commit/6cc74b2))
* Remove path-is-absolute dependency ([#225](https://github.com/zemirco/json2csv/issues/225)) ([f71a3df](https://github.com/zemirco/json2csv/commit/f71a3df))
* Rename hasCSVColumnTitle to noHeader ([#216](https://github.com/zemirco/json2csv/issues/216)) ([f053c8b](https://github.com/zemirco/json2csv/commit/f053c8b))
* Rename ld-json to ndjson ([#240](https://github.com/zemirco/json2csv/issues/240)) ([24a7893](https://github.com/zemirco/json2csv/commit/24a7893))
* Rename unwindPath to unwind ([#230](https://github.com/zemirco/json2csv/issues/230)) ([7143bc7](https://github.com/zemirco/json2csv/commit/7143bc7))
* Streamify pretty print ([#248](https://github.com/zemirco/json2csv/issues/248)) ([fb7ad53](https://github.com/zemirco/json2csv/commit/fb7ad53))


### Chores

* Refactor the entire library to ES6 ([#233](https://github.com/zemirco/json2csv/issues/233)) ([dce4d33](https://github.com/zemirco/json2csv/commit/dce4d33))


### Features

* add doubleQuote to cli, rename other options to line up with the cli ([5e402dc](https://github.com/zemirco/json2csv/commit/5e402dc))
* Add fields config option to CLI ([#245](https://github.com/zemirco/json2csv/issues/245)) ([74ef666](https://github.com/zemirco/json2csv/commit/74ef666))
* Add streaming API ([#235](https://github.com/zemirco/json2csv/issues/235)) ([01ca93e](https://github.com/zemirco/json2csv/commit/01ca93e))
* Split tests in multiple files ([#246](https://github.com/zemirco/json2csv/issues/246)) ([839de77](https://github.com/zemirco/json2csv/commit/839de77))


### BREAKING CHANGES

* Replaces field-list with field-config
* Remove `preserveNewLinesInValues` option, preserve by default

* Refactor the entire library to ES6

* Fix PR issues

* Add strict mode for node 4.X
* Remove fieldNames

* Increase coverage back to 100%
* callback is no longer available, just return the csv from the json2csv.

- updated tests
- updated readme
* * Rename unwindPath to unwind

* Fix field-list in CLI
* newLine removed, eol kept.
* Rename del to delimiter to match the cli flag
* Rename quotes to quote to match the cli flag

* Remove unused double quotes comment

* Fix noHeader in CLI

* Revert "Remove unused double quotes comment"

This reverts commit 250d3e6ddf3062cbdc1e0174493a37fa21197d8e.

* Add doubleQuote to CLI
* Rename hasCSVColumnTitle to noHeader to keep in line with the CLI



<a name="3.11.5"></a>
## [3.11.5](https://github.com/zemirco/json2csv/compare/v3.11.4...v3.11.5) (2017-10-23)


### Bug Fixes

* backslash value not escaped properly ([#202](https://github.com/zemirco/json2csv/issues/202)) ([#204](https://github.com/zemirco/json2csv/issues/204)) ([2cf50f1](https://github.com/zemirco/json2csv/commit/2cf50f1))



<a name="3.11.4"></a>
## [3.11.4](https://github.com/zemirco/json2csv/compare/v3.11.3...v3.11.4) (2017-10-09)


### Bug Fixes

* **security:** Update debug to 3.1.0 for security reasons ([9c7cfaa](https://github.com/zemirco/json2csv/commit/9c7cfaa))



<a name="3.11.3"></a>
## [3.11.3](https://github.com/zemirco/json2csv/compare/v3.11.2...v3.11.3) (2017-10-09)



<a name="3.11.2"></a>
## [3.11.2](https://github.com/zemirco/json2csv/compare/v3.11.1...v3.11.2) (2017-09-13)


### Bug Fixes

* Remove extra space character in mode withBOM: true [#190](https://github.com/zemirco/json2csv/issues/190) ([#194](https://github.com/zemirco/json2csv/issues/194)) ([e8b6f6b](https://github.com/zemirco/json2csv/commit/e8b6f6b))



<a name="3.11.1"></a>
## [3.11.1](https://github.com/zemirco/json2csv/compare/v3.11.0...v3.11.1) (2017-08-11)


### Bug Fixes

* **cli:** pass BOM cli option to function ([#193](https://github.com/zemirco/json2csv/issues/193)) ([70cfdfe](https://github.com/zemirco/json2csv/commit/70cfdfe))



<a name="3.11.0"></a>
# [3.11.0](https://github.com/zemirco/json2csv/compare/v3.10.0...v3.11.0) (2017-08-02)


### Bug Fixes

* Handle dates without double-escaping ([#189](https://github.com/zemirco/json2csv/issues/189)) ([ff514ba](https://github.com/zemirco/json2csv/commit/ff514ba))
* unwind parameter in command line mode ([#191](https://github.com/zemirco/json2csv/issues/191)) ([e706c25](https://github.com/zemirco/json2csv/commit/e706c25))


### Features

* Added flag to signal if resulting function value should be stringified or not ([#192](https://github.com/zemirco/json2csv/issues/192)) ([aaa6b05](https://github.com/zemirco/json2csv/commit/aaa6b05))



<a name="3.10.0"></a>
# [3.10.0](https://github.com/zemirco/json2csv/compare/v3.9.1...v3.10.0) (2017-07-24)


### Features

* Add BOM character option ([#187](https://github.com/zemirco/json2csv/issues/187)) ([0c799ca](https://github.com/zemirco/json2csv/commit/0c799ca))



<a name="3.9.1"></a>
## [3.9.1](https://github.com/zemirco/json2csv/compare/v3.9.0...v3.9.1) (2017-07-14)



<a name="3.9.0"></a>
# [3.9.0](https://github.com/zemirco/json2csv/compare/v3.8.0...v3.9.0) (2017-07-11)


### Features

* Parameter unwindPath for multiple fields ([#174](https://github.com/zemirco/json2csv/issues/174)) ([#183](https://github.com/zemirco/json2csv/issues/183)) ([fbcaa10](https://github.com/zemirco/json2csv/commit/fbcaa10))



<a name="3.8.0"></a>
# [3.8.0](https://github.com/zemirco/json2csv/compare/v3.7.3...v3.8.0) (2017-07-03)


### Bug Fixes

* **docs:** Add a coma in the ReadMe example ([#181](https://github.com/zemirco/json2csv/issues/181)) ([abeb820](https://github.com/zemirco/json2csv/commit/abeb820))


### Features

* Preserve new lines in cells with option `preserveNewLinesInValues` ([#91](https://github.com/zemirco/json2csv/issues/91)) ([#171](https://github.com/zemirco/json2csv/issues/171)) ([187b701](https://github.com/zemirco/json2csv/commit/187b701))



<a name="3.7.3"></a>
## [3.7.3](https://github.com/zemirco/json2csv/compare/v3.7.1...v3.7.3) (2016-12-08)


### Bug Fixes

* **jsdoc:** JSDoc Editting ([#155](https://github.com/zemirco/json2csv/issues/155)) ([76075d6](https://github.com/zemirco/json2csv/commit/76075d6))
* **ts:** Fix type definition ([#154](https://github.com/zemirco/json2csv/issues/154)) ([fae53a1](https://github.com/zemirco/json2csv/commit/fae53a1))



## 3.6.3 / 2016-08-17

  * Fix crashing on EPIPE error [#134](https://github.com/zemirco/json2csv/pull/134)
  * Add UMD build for browser usage [#136](https://github.com/zemirco/json2csv/pull/136)
  * Add docs during prepublish

## 3.6.2 / 2016-07-22

  * Remove debugger, see [#132](https://github.com/zemirco/json2csv/pull/132)
  * Fix changelog typo

## 3.6.1 / 2016-07-12

  * Fix auto-fields returning all available fields, even if not available on the first object, see #104

## 3.6.0 / 2016-07-07

  * Make callback optional
  * Make callback use `process.nextTick`, so it's not sync

  Thanks @STRML!

## 3.5.1 / 2016-06-29

  * Revert [#114](https://github.com/zemirco/json2csv/pull/114), due to more issues
  * Update npmignore
  * Add a changelog
  * Updatee readme

## 3.5.0 / 2016-06-21

  * `includeEmptyRows` options added, see [#122](https://github.com/zemirco/json2csv/pull/122) (Thanks @glutentag)
  * `-a` or `--include-empty-rows` added for the CLI.

## 2.2.1 / 2013-11-10

  * mainly for development e.g. adding code format, update readme..

## 2.2.0 / 2013-11-08

  * not create CSV column title by passing hasCSVColumnTitle: false, into params.
  * if field is not exist in object then the field value in CSV will be empty.
  * fix data in object format - {...}

## 2.1.0 / 2013-06-11

  * quote titles in the first row

## 2.0.0 / 2013-03-04

  * err in callback function

## 1.3.1 / 2013-02-20

  * fix stdin encoding

## 1.3.0 / 2013-02-20

  * support reading from stdin [#9](https://github.com/zeMirco/json2csv/pull/9)

## 1.2.0 / 2013-02-20

  * support custom field names [#8](https://github.com/zeMirco/json2csv/pull/8)

## 1.1.0 / 2013-01-19

  * add optional custom delimiter
