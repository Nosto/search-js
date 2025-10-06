# [3.20.0](https://github.com/Nosto/search-js/compare/v3.19.1...v3.20.0) (2025-10-06)


### Features

* bump GitHub Actions node version from 22 to 24 ([aa8ab3e](https://github.com/Nosto/search-js/commit/aa8ab3e103ff86193bf0e0afa33318f6680b76ff))

## [3.19.1](https://github.com/Nosto/search-js/compare/v3.19.0...v3.19.1) (2025-10-02)


### Bug Fixes

* legacy compatibility exports ([2862b1c](https://github.com/Nosto/search-js/commit/2862b1c9112ee4663295db19456e694f7eab5fa6))

# [3.19.0](https://github.com/Nosto/search-js/compare/v3.18.1...v3.19.0) (2025-10-02)


### Bug Fixes

* **workflow:** add npm caching and remove workflow_call trigger ([0d4d5b5](https://github.com/Nosto/search-js/commit/0d4d5b56b0b060d85fece1e6c916655adbde0f2b))


### Features

* **workflow:** add minimal copilot-setup-steps.yml with Node 22 and npm ci ([e207997](https://github.com/Nosto/search-js/commit/e207997b5b64ede4a4e20d79a9b6763ae9a30888))

## [3.18.1](https://github.com/Nosto/search-js/compare/v3.18.0...v3.18.1) (2025-10-01)


### Bug Fixes

* use core prefix instead of ./ ([540e522](https://github.com/Nosto/search-js/commit/540e522d2f1adbd58e2f9c75fb0ea2a5c7219cac))

# [3.18.0](https://github.com/Nosto/search-js/compare/v3.17.2...v3.18.0) (2025-10-01)


### Bug Fixes

* refactorings ([36014a0](https://github.com/Nosto/search-js/commit/36014a0d9ec0e8160ada2b0de88155c2bf993d6b))
* reviews ([3db70b3](https://github.com/Nosto/search-js/commit/3db70b3667ca1eeec37299fac1fbf8adc2b9f96f))
* reviews ([d2a4b53](https://github.com/Nosto/search-js/commit/d2a4b534249d937e6349899a2f711825d2ab6b81))


### Features

* useRange match useFacet hook ([87f39d4](https://github.com/Nosto/search-js/commit/87f39d4932a532a4e3fa9a5cab30cde58d84a29a))

## [3.17.2](https://github.com/Nosto/search-js/compare/v3.17.1...v3.17.2) (2025-10-01)


### Bug Fixes

* fix onChange logic ([00cd626](https://github.com/Nosto/search-js/commit/00cd626c51f00589689b25bbfecb8004d33b59fb))

## [3.17.1](https://github.com/Nosto/search-js/compare/v3.17.0...v3.17.1) (2025-09-30)


### Bug Fixes

* make removeAllFilters event notification only ([e19d9cc](https://github.com/Nosto/search-js/commit/e19d9cc137de07abb0491c9ab58768d7578d6861))

# [3.17.0](https://github.com/Nosto/search-js/compare/v3.16.1...v3.17.0) (2025-09-30)


### Bug Fixes

* reviews ([8d34d65](https://github.com/Nosto/search-js/commit/8d34d65872afd07fa97fcaf1b29bcb1713479ce1))


### Features

* remove all filters with custom event ([2878ed8](https://github.com/Nosto/search-js/commit/2878ed8f0e01adea0838f09f34cbb42ad81d9a94))

## [3.16.1](https://github.com/Nosto/search-js/compare/v3.16.0...v3.16.1) (2025-09-30)


### Bug Fixes

* decouple getSaved from useHistory ([23602e0](https://github.com/Nosto/search-js/commit/23602e0e421b97c7606971d1c055ad75b2e772c1))

# [3.16.0](https://github.com/Nosto/search-js/compare/v3.15.0...v3.16.0) (2025-09-30)


### Features

* implement useShopifyProduct hook with caching and tests ([6dd5a96](https://github.com/Nosto/search-js/commit/6dd5a966a64d35a8bf41da88ccda5eb2952c0092))

# [3.15.0](https://github.com/Nosto/search-js/compare/v3.14.0...v3.15.0) (2025-09-29)


### Bug Fixes

* drop functionality from dev/preact ([2403305](https://github.com/Nosto/search-js/commit/24033056f3860d2180048235f20dfeb218fe3ccc))
* handle history size of 0 or 1 ([492f18f](https://github.com/Nosto/search-js/commit/492f18f3a81729518f5ba58037c04c5c62da9a0b))
* lint ([254d252](https://github.com/Nosto/search-js/commit/254d2527beb7e7b9d4d4d4dd740a7e72280e5736))
* tests and minor bugfix ([fd8edc1](https://github.com/Nosto/search-js/commit/fd8edc1cc72cae54d852a090c9a550dc0584cf93))
* use correct history size ([c28be09](https://github.com/Nosto/search-js/commit/c28be09e66d3ad2b78ac854e9d53e0c1c95ddf91))


### Features

* add useHistory hook ([2485a8b](https://github.com/Nosto/search-js/commit/2485a8b1b267cf7c8abcd2a4e4f580ff85d86ee9))

# [3.14.0](https://github.com/Nosto/search-js/compare/v3.13.1...v3.14.0) (2025-09-18)


### Features

* drop ErrorBoundary test file ([0454d20](https://github.com/Nosto/search-js/commit/0454d20aa4f9d6113d340b3395d6856543a45cdc))
* move ErrorBoundary to common/src/components and export it ([3105925](https://github.com/Nosto/search-js/commit/31059256e50255ec0b666762a3a298ea6a5e86f4))
* use function declaration for ErrorBoundary component ([a9ba1dc](https://github.com/Nosto/search-js/commit/a9ba1dc20e3d8eae3b3e459debeffc5421a11df0))
* use named export for ErrorBoundary component ([9175454](https://github.com/Nosto/search-js/commit/91754540bcf1eaaafe945890bc08bbdefb023d91))

## [3.13.1](https://github.com/Nosto/search-js/compare/v3.13.0...v3.13.1) (2025-09-15)


### Bug Fixes

* expose config hooks ([e24b00c](https://github.com/Nosto/search-js/commit/e24b00cd81e6af8a133acd781106d433a7a3dc63))

# [3.13.0](https://github.com/Nosto/search-js/compare/v3.12.0...v3.13.0) (2025-09-09)


### Features

* extract styles from remaining TSX components to sibling .styles.ts files ([03cc9eb](https://github.com/Nosto/search-js/commit/03cc9eb5f617840702bf9f6d9228a5d11969c37d))

# [3.12.0](https://github.com/Nosto/search-js/compare/v3.11.0...v3.12.0) (2025-09-05)


### Features

* extract styles from TSX components to sibling .styles.ts files ([d7862c2](https://github.com/Nosto/search-js/commit/d7862c26280193e8f60c42314de7e68db753bcf4))

# [3.11.0](https://github.com/Nosto/search-js/compare/v3.10.0...v3.11.0) (2025-09-04)


### Bug Fixes

* resolve linting issues in test file ([c79d91e](https://github.com/Nosto/search-js/commit/c79d91efdb3812b2c12d1e7c7e4ef3bc323a3209))


### Features

* add query support for category and serp configs ([c7be558](https://github.com/Nosto/search-js/commit/c7be55870dbaa3252b2ab7bd0eaf428c27e6d168))
* adjust return type to reflect input shape in init function ([3173124](https://github.com/Nosto/search-js/commit/3173124bcf6859ae627e6a78a2da28d6aa2aa047))

# [3.10.0](https://github.com/Nosto/search-js/compare/v3.9.0...v3.10.0) (2025-09-04)


### Bug Fixes

* change typedoc-json output path from build to dist directory ([876563d](https://github.com/Nosto/search-js/commit/876563d3bd9a2b31bcd9b3d965f80a01c7073c20))


### Features

* add typedoc-json script to output JSON documentation ([6db2c0c](https://github.com/Nosto/search-js/commit/6db2c0ce75ac114fc6e3c150aa52d5fada56cff2))

# [3.9.0](https://github.com/Nosto/search-js/compare/v3.8.0...v3.9.0) (2025-09-02)


### Features

* convert const function declarations to function syntax ([7a04ea5](https://github.com/Nosto/search-js/commit/7a04ea509c0cea45e451065bbb896ac946905b31))

# [3.8.0](https://github.com/Nosto/search-js/compare/v3.7.0...v3.8.0) (2025-09-01)


### Features

* **utils:** add cl utility for class name joining and replace string concatenation in preact components ([cf1e7b1](https://github.com/Nosto/search-js/commit/cf1e7b138f6cc801127f23080cdf2b7c61b545bb))

# [3.7.0](https://github.com/Nosto/search-js/compare/v3.6.0...v3.7.0) (2025-09-01)


### Features

* convert const function declarations to function syntax ([387688d](https://github.com/Nosto/search-js/commit/387688d811d00f132988e3d0e5f44906a962eae1))

# [3.6.0](https://github.com/Nosto/search-js/compare/v3.5.0...v3.6.0) (2025-08-29)


### Features

* add pre-commit hook for lint, test, and typecheck validation ([e190bf4](https://github.com/Nosto/search-js/commit/e190bf41b5016169ce063d85068c6cb07d287c07))
* add typecheck npm script for easier validation ([8ce41ec](https://github.com/Nosto/search-js/commit/8ce41eceae842cf3d3d2357e0d6e976c39790aac))

# [3.5.0](https://github.com/Nosto/search-js/compare/v3.4.1...v3.5.0) (2025-08-15)


### Bug Fixes

* address pr comments ([a334e48](https://github.com/Nosto/search-js/commit/a334e48f18a091999345f78cf8dc61536008b07b))
* autocomplete bugs ([9a333d3](https://github.com/Nosto/search-js/commit/9a333d39f315a84ea13a072a75d6dcf77e8961ba))
* configurable timeout ([301cb3c](https://github.com/Nosto/search-js/commit/301cb3cebaf8e5359856c7723f54d81e61653ccf))
* error message ([10f84cb](https://github.com/Nosto/search-js/commit/10f84cbd6c315738b8b7a34933c53d3723a96a18))
* further refactoring on autocomplete injection ([3e9f232](https://github.com/Nosto/search-js/commit/3e9f2325a484ec0d97dfe483794bb034e6a35c3e))
* history and keyboard navigation ([222b1c3](https://github.com/Nosto/search-js/commit/222b1c37dd0f4379d9156b9bee0bb60c62962771))
* remove isCategoryPage ([bff9aed](https://github.com/Nosto/search-js/commit/bff9aed833d11bcee2fe0a8a778ed9aa536282d8))
* search submission ([202b03d](https://github.com/Nosto/search-js/commit/202b03d6533b03890e5bdf9847719f096c2b20e9))
* wrap injection in useEffectOnce ([233fef1](https://github.com/Nosto/search-js/commit/233fef153ead4deea6ec4c1aca39282920fef4d2))


### Features

* add autocomplete injection ([6b98ec9](https://github.com/Nosto/search-js/commit/6b98ec9d939370c92309376d605dd45628d017ad))
* add category injection logic ([3b69ad3](https://github.com/Nosto/search-js/commit/3b69ad36360363d054d68f7a114b9850792a95dc))
* finalize autocomplete injection" ([1a64a67](https://github.com/Nosto/search-js/commit/1a64a67f9f933fd800e13436ae10e0c9675b28ce))
* provide highlighted element index through context ([b9448da](https://github.com/Nosto/search-js/commit/b9448da3b331fa1ca3b2b1ee33a21fce5760ed59))
* search page injection ([5472efc](https://github.com/Nosto/search-js/commit/5472efc779617dd9379abc7e0b14c91e75de8e70))

## [3.4.1](https://github.com/Nosto/search-js/compare/v3.4.0...v3.4.1) (2025-08-13)


### Bug Fixes

* **hooks:** adjust useSizeOptions filtering logic to remove serpSize ([6bfa180](https://github.com/Nosto/search-js/commit/6bfa180d479269ee9f3e561f4f9768f85f1d614d))


### Performance Improvements

* **hooks:** optimize useSizeOptions with useCallback and useMemo ([3ed331c](https://github.com/Nosto/search-js/commit/3ed331c4b03bbaff8a7d04719496d4eb3809caa7))

# [3.4.0](https://github.com/Nosto/search-js/compare/v3.3.0...v3.4.0) (2025-08-12)


### Bug Fixes

* correct dev app port and improve README with development instructions ([62c0861](https://github.com/Nosto/search-js/commit/62c0861667df38ba5a85356fccb6bd9ecb712853))


### Features

* create comprehensive GitHub Copilot instructions with validated commands and timing ([2b6c401](https://github.com/Nosto/search-js/commit/2b6c401c25e6020d9a6b63cd56bced94559b06b9))

# [3.3.0](https://github.com/Nosto/search-js/compare/v3.2.0...v3.3.0) (2025-08-04)


### Features

* add copilot instructions ([4fd814c](https://github.com/Nosto/search-js/commit/4fd814ce3072921ae254a08e36704debf0200c54))

# [3.2.0](https://github.com/Nosto/search-js/compare/v3.1.2...v3.2.0) (2025-07-23)


### Features

* add store actions event listeners ([a9a381b](https://github.com/Nosto/search-js/commit/a9a381b716a49c3e50aa5db8b767c27ba47fe8cf))

## [3.1.2](https://github.com/Nosto/search-js/compare/v3.1.1...v3.1.2) (2025-07-09)


### Bug Fixes

* default page size ([d4d004e](https://github.com/Nosto/search-js/commit/d4d004e100582423d3973863e1a23c3866412097))

## [3.1.1](https://github.com/Nosto/search-js/compare/v3.1.0...v3.1.1) (2025-06-27)


### Bug Fixes

* memo for observer infinite scroll ([e4f6481](https://github.com/Nosto/search-js/commit/e4f6481550da3dd5931a02a8fa8dcc9918d0978d))
* revert to memo usage only ([4a0975e](https://github.com/Nosto/search-js/commit/4a0975e4adf060fd601dd67a04e3c2dfb0c462f1))
* reviews ([479c658](https://github.com/Nosto/search-js/commit/479c65836d58d692154c9da9ff2ae5925a2e6a32))
* search templates observer re-triggers ([d3265ff](https://github.com/Nosto/search-js/commit/d3265ff337d908986d75d57a44aed08b4f655760))

# [3.1.0](https://github.com/Nosto/search-js/compare/v3.0.0...v3.1.0) (2025-06-26)


### Bug Fixes

* observer options as object pass ([98581e2](https://github.com/Nosto/search-js/commit/98581e2ce1748a9cee9a48faecd1886081badba0))


### Features

* infinite scroll improvements ([74220fe](https://github.com/Nosto/search-js/commit/74220fe1ae6bc4dab6f0ba924903b9cc5e4eb400))

# [3.0.0](https://github.com/Nosto/search-js/compare/v2.17.0...v3.0.0) (2025-06-06)


### Bug Fixes

* comment fixes ([336e132](https://github.com/Nosto/search-js/commit/336e1326954cb19e09f8c5ec1da7e6fa7c85eee6))
* fixed comment examples ([e61ff06](https://github.com/Nosto/search-js/commit/e61ff06981c6016286589aa2415cd115da6bd10c))


### BREAKING CHANGES

* Handler callbacks are now passed as props to the useSpeechToText hook

# [2.17.0](https://github.com/Nosto/search-js/compare/v2.16.0...v2.17.0) (2025-05-30)


### Features

* add nativeSubmit option ([e439c3d](https://github.com/Nosto/search-js/commit/e439c3d5aaf9a2b7ca35afb50ee3e211953809aa))

# [2.16.0](https://github.com/Nosto/search-js/compare/v2.15.0...v2.16.0) (2025-05-28)


### Bug Fixes

* add default memoryCache value ([1881043](https://github.com/Nosto/search-js/commit/18810437ca5bad1bf07f90967b26cc366f8565dc))
* clean up ([5210a54](https://github.com/Nosto/search-js/commit/5210a54854ed760c70a7681b860d2df6527fbbf6))
* clean up and add test ([b68dfcd](https://github.com/Nosto/search-js/commit/b68dfcdc8e80bd7c609e4688b3efdc309648a4b4))
* cleanup ([c2bf2ff](https://github.com/Nosto/search-js/commit/c2bf2ff73b36d6fc2352376c70c99d5ed90c8ff0))
* cleanup ([6735527](https://github.com/Nosto/search-js/commit/6735527d5dd325e5ac497a01113524d1e535074c))
* update after review ([5bc8f72](https://github.com/Nosto/search-js/commit/5bc8f72c5f53c08e4ff2760e3476f3c3a7bee2d7))
* update after review ([6a25b2c](https://github.com/Nosto/search-js/commit/6a25b2cfbcd7d6f73d0a02981ed1a6295eea364d))
* update after review ([54b6157](https://github.com/Nosto/search-js/commit/54b615791008c1c19f1f4575532061a9882c9880))
* update after review ([7a4a276](https://github.com/Nosto/search-js/commit/7a4a276a34fc44a7a2e9c766c6780866466249bb))
* updates after review ([54b159d](https://github.com/Nosto/search-js/commit/54b159d5dd8a9d5c7baeeee38b2f0fa5c81e1a0c))


### Features

* add in-memory caching for autocomplete results ([5b498c9](https://github.com/Nosto/search-js/commit/5b498c954afa9d19798a1bbaab526caed1cfc27b))

# [2.15.0](https://github.com/Nosto/search-js/compare/v2.14.0...v2.15.0) (2025-05-23)


### Bug Fixes

* asComponentImport ([c2ff757](https://github.com/Nosto/search-js/commit/c2ff7574640879fdee3a553ff7d435eb9288a3e4))
* omit ([039527e](https://github.com/Nosto/search-js/commit/039527efc956e8fc17f036758e095e654076e870))
* props add ([a79c703](https://github.com/Nosto/search-js/commit/a79c7034644bc28ffae36969a0803ff5f5321394))
* reviews ([4185265](https://github.com/Nosto/search-js/commit/4185265203806decc789de7b820178d11104b632))
* reviews ([1c68a6e](https://github.com/Nosto/search-js/commit/1c68a6e0ff1d6ac62df5679d0fbf0e365b1f8dfd))
* reviews ([4fe6e64](https://github.com/Nosto/search-js/commit/4fe6e64f6fc956720a518b69b43e21ca520ca2bb))
* tests fixes ([0902097](https://github.com/Nosto/search-js/commit/09020974d0a346c9032e4693fbe4bb4cafdd7d8e))
* type export ([6c28d40](https://github.com/Nosto/search-js/commit/6c28d40844374b2e67b27e0f4b4ebaadcb155f1d))
* union type ([780e6ef](https://github.com/Nosto/search-js/commit/780e6efb6e790795350175e9b05a1d54eda1b244))


### Features

* autocomplete component ([053ee60](https://github.com/Nosto/search-js/commit/053ee6062e5c1db7ff8890df4b1a060f8176a8ce))

# [2.14.0](https://github.com/Nosto/search-js/compare/v2.13.0...v2.14.0) (2025-05-23)


### Bug Fixes

* fix after main merge ([9b63599](https://github.com/Nosto/search-js/commit/9b63599e29139c866682e15d32faf4c6635a675e))
* update sortOptions ([a53e9b6](https://github.com/Nosto/search-js/commit/a53e9b60dae0dffb23e9a8128f2c55790e743334))
* update sortOptions ([0290870](https://github.com/Nosto/search-js/commit/0290870e9fa692291d8374b02ae4d0f34615d4a0))
* update sortOptions and test ([3066b69](https://github.com/Nosto/search-js/commit/3066b697fefaab85d4e99ad77df13b74d9ea565b))
* update sortOptions and test ([11c2212](https://github.com/Nosto/search-js/commit/11c22125381fb0063412f85a7b8af1beb8d2df50))
* update sortOptions and test ([e1b7e68](https://github.com/Nosto/search-js/commit/e1b7e68b20096ebca482e5b8edb56810b8b0d1d2))
* update sortOptions, tests and useSwatches ([7014e03](https://github.com/Nosto/search-js/commit/7014e03293a95e6f407ae436aa2d8d2590bc7fa9))


### Features

* add sortOptions ([6401a25](https://github.com/Nosto/search-js/commit/6401a25208979730a0d38a8ee4dfb7f065ad7ad1))

# [2.13.0](https://github.com/Nosto/search-js/compare/v2.12.2...v2.13.0) (2025-05-20)


### Features

* skip empty options ([61db159](https://github.com/Nosto/search-js/commit/61db159235e3d8688e729d84c8b00391346609a1))

## [2.12.2](https://github.com/Nosto/search-js/compare/v2.12.1...v2.12.2) (2025-05-19)


### Bug Fixes

* use result size instead of hits.length ([0ee04b5](https://github.com/Nosto/search-js/commit/0ee04b58be2c26a9b6f279bee13f8894bcc5e767))

## [2.12.1](https://github.com/Nosto/search-js/compare/v2.12.0...v2.12.1) (2025-05-16)


### Bug Fixes

* drop extra onClick ([1b38611](https://github.com/Nosto/search-js/commit/1b38611f8a5b762232baee7434b36127b3c249a1))
* rewrite headless components ([0b36096](https://github.com/Nosto/search-js/commit/0b360969513959c113a82ec0a5899fce06241672))

# [2.12.0](https://github.com/Nosto/search-js/compare/v2.11.1...v2.12.0) (2025-05-15)


### Bug Fixes

* export UseFacetOptions ([3268b61](https://github.com/Nosto/search-js/commit/3268b617d395706c09b54883973bcc7ae6b3dcff))


### Features

* add options to useFacet hook ([def2aa9](https://github.com/Nosto/search-js/commit/def2aa9942d6cc23fe7cb768417c2f4107cc0523))

## [2.11.1](https://github.com/Nosto/search-js/compare/v2.11.0...v2.11.1) (2025-05-15)


### Bug Fixes

* add missing cache ttl ([bc0052e](https://github.com/Nosto/search-js/commit/bc0052e069458597b6c8a58fa96c951d75dc6b35))

# [2.11.0](https://github.com/Nosto/search-js/compare/v2.10.0...v2.11.0) (2025-05-14)


### Features

* voice to text support ([#208](https://github.com/Nosto/search-js/issues/208)) ([a227c0e](https://github.com/Nosto/search-js/commit/a227c0ecf1fed17c291ac5cdccb6bfc746c1a99b))

# [2.10.0](https://github.com/Nosto/search-js/compare/v2.9.2...v2.10.0) (2025-05-14)


### Bug Fixes

* go over the swatches instead of skus ([79bf816](https://github.com/Nosto/search-js/commit/79bf816eeb819682205d6c9461efa00773019f91))
* handle empty case ([fbaf9d5](https://github.com/Nosto/search-js/commit/fbaf9d5645a182a6ef51a3eed69908671fb60d70))
* return matching SKUS for partial swatch selection ([3679b70](https://github.com/Nosto/search-js/commit/3679b70b0f38d8cfbf5f6b885e3647668cc8da10))
* update after review ([1e649e9](https://github.com/Nosto/search-js/commit/1e649e9c19ddd8f2d941b635bf62bb8a19efdca9))


### Features

* expose selected sku ([7f0c653](https://github.com/Nosto/search-js/commit/7f0c653944eb0757b14268ed43e9440b2b8d65fa))

## [2.9.2](https://github.com/Nosto/search-js/compare/v2.9.1...v2.9.2) (2025-05-14)


### Bug Fixes

* adjust response size in merge ([b3c877a](https://github.com/Nosto/search-js/commit/b3c877ae7d55d51c0106629bab8515b7d66cf7dd))

## [2.9.1](https://github.com/Nosto/search-js/compare/v2.9.0...v2.9.1) (2025-05-14)


### Bug Fixes

* add first and last page to pages array ([fd03465](https://github.com/Nosto/search-js/commit/fd03465df2672112df98c01d07677ed176bd2c97))

# [2.9.0](https://github.com/Nosto/search-js/compare/v2.8.3...v2.9.0) (2025-05-12)


### Bug Fixes

* avoid type assertion ([2c3f9e0](https://github.com/Nosto/search-js/commit/2c3f9e0edf18c8cb7a165fddcff076d1cfc5f891))
* fix type ([860c2f8](https://github.com/Nosto/search-js/commit/860c2f8da57c771313bde783f86b10a33490c699))
* fix typedoc ([725e1ed](https://github.com/Nosto/search-js/commit/725e1ed1b71f875efd0726bbb289ced87976ff3e))
* use correct file path ([98ec041](https://github.com/Nosto/search-js/commit/98ec041a69be49666f1b53bfe81fd8ece3a14daa))
* use full sku ([a2bc4fd](https://github.com/Nosto/search-js/commit/a2bc4fd15bef7efbf76c40ebed4203e01394e17b))


### Features

* add selected field and update tests ([54b594d](https://github.com/Nosto/search-js/commit/54b594d83e7c169e78974e0104814594b5c769e8))
* create useSwatches hook ([d46cf97](https://github.com/Nosto/search-js/commit/d46cf97289430de44dd8d7feefb611c88abc0063))
* updates ([e2d58c0](https://github.com/Nosto/search-js/commit/e2d58c0fe92f7ff3badc1f6183a4c4ee11ba38b0))

## [2.8.3](https://github.com/Nosto/search-js/compare/v2.8.2...v2.8.3) (2025-05-12)


### Bug Fixes

* use better persistence key scoping ([3108057](https://github.com/Nosto/search-js/commit/3108057650d838c6ad5a5cff5ab0d9811d3d6311))

## [2.8.2](https://github.com/Nosto/search-js/compare/v2.8.1...v2.8.2) (2025-05-09)


### Bug Fixes

* remove onSubmit triggering in onKeyDown ([150aec2](https://github.com/Nosto/search-js/commit/150aec287877ffbc7ff6c332618b49cb0ce93a5c))
* review comments ([c3f2646](https://github.com/Nosto/search-js/commit/c3f2646fc40803a12904ecfa92ee3637da77228f))

## [2.8.1](https://github.com/Nosto/search-js/compare/v2.8.0...v2.8.1) (2025-05-07)


### Bug Fixes

* use provided function ([1dcc4b1](https://github.com/Nosto/search-js/commit/1dcc4b1b81c82cea66b5f5cbbe25169f0aff6eeb))

# [2.8.0](https://github.com/Nosto/search-js/compare/v2.7.0...v2.8.0) (2025-05-06)


### Bug Fixes

* simplify onBeforeSearch ([732e6cc](https://github.com/Nosto/search-js/commit/732e6ccb4f6caa8d5ce05e5193cd3683e52fe039))
* test name ([0da1061](https://github.com/Nosto/search-js/commit/0da106104d74f9a46fde556f7e38896aec79c53c))


### Features

* add error handler support ([4c70138](https://github.com/Nosto/search-js/commit/4c70138aa3dd621cc53a3984f48ee840598b415b))
* add legacy exports ([029fe63](https://github.com/Nosto/search-js/commit/029fe635f4155fe84f8d6400b467064090b5cc32))
* add onBeforeSearch callback ([df2d4a0](https://github.com/Nosto/search-js/commit/df2d4a08638b9be89c46941a319c0f5836608687))

# [2.7.0](https://github.com/Nosto/search-js/compare/v2.6.0...v2.7.0) (2025-05-06)


### Features

* make searchWithCache a middleware ([0d2888d](https://github.com/Nosto/search-js/commit/0d2888da647b610779df75f1797bb336776a3c1e))

# [2.6.0](https://github.com/Nosto/search-js/compare/v2.5.0...v2.6.0) (2025-05-06)


### Features

* use middleware stacking for search calls ([12723e7](https://github.com/Nosto/search-js/commit/12723e7a03e5943ddc02a755230d37df8aa63b46))

# [2.5.0](https://github.com/Nosto/search-js/compare/v2.4.0...v2.5.0) (2025-05-06)


### Features

* add exports ([d82c357](https://github.com/Nosto/search-js/commit/d82c357928636be7a0f62677ff4ecf5a366da637))

# [2.4.0](https://github.com/Nosto/search-js/compare/v2.3.0...v2.4.0) (2025-05-05)


### Bug Fixes

* address comments ([dc459c9](https://github.com/Nosto/search-js/commit/dc459c9510b86231b0a1e601c5045a1b6923bb70))
* adress lint issues and fix tests ([3d87601](https://github.com/Nosto/search-js/commit/3d87601fff5fa4bb6a3107f91504e8e589d0dce5))
* improve caching logic and add tests ([ce5d798](https://github.com/Nosto/search-js/commit/ce5d798f52568b31242f32c4d8a239d0c5cace79))
* infinite scroll test ([7708ce6](https://github.com/Nosto/search-js/commit/7708ce6464c12356656d1180e5dc1ee7727db20d))
* infinite scroll test assertion ([3513eb2](https://github.com/Nosto/search-js/commit/3513eb2dd83aa4fcae430096ba2ea51038725355))
* lint issues ([47e8ee4](https://github.com/Nosto/search-js/commit/47e8ee4be11fe7a227b09f3ba1c734110a84e42d))
* remove from checks from caching logic ([aece16e](https://github.com/Nosto/search-js/commit/aece16e5bc9dbfbd1a675710061f812ea2f74831))
* review comments and suggestions ([a41ac40](https://github.com/Nosto/search-js/commit/a41ac40bbb13fde2eba84dc2857377bfdb570da4))
* update parameters for newSearch/updateSearch ([9cb1ccb](https://github.com/Nosto/search-js/commit/9cb1ccb7598985806011706e094b2f6c3b3a1104))


### Features

* improve paginated caching technique ([4c76662](https://github.com/Nosto/search-js/commit/4c7666283bc5a3eed7924712490c951b6773b128))
* input bindings for autocomplete ([689ce85](https://github.com/Nosto/search-js/commit/689ce85e097cb896cdd2423f43af826660db9cb3))
* load merged result from cache ([ae79d64](https://github.com/Nosto/search-js/commit/ae79d64ef5a344daa7b4aec6255b5468d0fb7b79))
* merge infinite scrolling result in persistance layer ([52f72aa](https://github.com/Nosto/search-js/commit/52f72aa9ddfca0e56d9fc69911d38b104559c4bb))
* optimized infinite scroling ([ca7fdd0](https://github.com/Nosto/search-js/commit/ca7fdd045fa0ba45c85b066697bdbf64dd39b748))
* search with cache prefill ([fe95107](https://github.com/Nosto/search-js/commit/fe95107e06cd1d8eb656d42b1cde07132567a6ab))

# [2.3.0](https://github.com/Nosto/search-js/compare/v2.2.0...v2.3.0) (2025-04-30)


### Bug Fixes

* string case included for useSizeOptions ([#177](https://github.com/Nosto/search-js/issues/177)) ([31fd034](https://github.com/Nosto/search-js/commit/31fd0341705a222d025ed601d81e8c4706eb2bc1))


### Features

* add logger abstraction ([667493b](https://github.com/Nosto/search-js/commit/667493b84903ab3a7a488179469339281112cd29))

# [2.2.0](https://github.com/Nosto/search-js/compare/v2.1.3...v2.2.0) (2025-04-28)


### Features

* Fix shopify thumbnails ([cbecd93](https://github.com/Nosto/search-js/commit/cbecd93eb7bec98e763352419658facb493680c5))

## [2.1.3](https://github.com/Nosto/search-js/compare/v2.1.2...v2.1.3) (2025-04-28)


### Bug Fixes

* drop categoryId and categoryPath params ([c140028](https://github.com/Nosto/search-js/commit/c140028cc345a001325ccfc5a7526f8d3df255cd))
* pageType to be compatible with search-templates ([cc6b6be](https://github.com/Nosto/search-js/commit/cc6b6beae2d9f20b8be18a1a83ca63adbbac6325))

## [2.1.2](https://github.com/Nosto/search-js/compare/v2.1.1...v2.1.2) (2025-04-24)


### Bug Fixes

* added comments for utils ([#166](https://github.com/Nosto/search-js/issues/166)) ([b2532f1](https://github.com/Nosto/search-js/commit/b2532f1410c42dcf17c3c1a7fa07d3bc654594a9))

## [2.1.1](https://github.com/Nosto/search-js/compare/v2.1.0...v2.1.1) (2025-04-23)


### Bug Fixes

* remove type and logic overlap ([3a556fa](https://github.com/Nosto/search-js/commit/3a556fad802f307fa8008a45696ee4595277c807))

# [2.1.0](https://github.com/Nosto/search-js/compare/v2.0.0...v2.1.0) (2025-04-23)


### Features

* rename generic Options to SearchOptions ([165d213](https://github.com/Nosto/search-js/commit/165d2130d084ed86c2d0bf576ebab81fed9ea27a))

# [2.0.0](https://github.com/Nosto/search-js/compare/v1.8.0...v2.0.0) (2025-04-17)


* feat!: organise exports ([#149](https://github.com/Nosto/search-js/issues/149)) ([ddcf92a](https://github.com/Nosto/search-js/commit/ddcf92a4141d702255034ef77b42a2f85919adf9))


### BREAKING CHANGES

* The `@preact` package is removed from the exports

# [1.8.0](https://github.com/Nosto/search-js/compare/v1.7.6...v1.8.0) (2025-04-11)


### Features

* added autocomplete component ([fc2c163](https://github.com/Nosto/search-js/commit/fc2c1633b744892ab333e9c6abaff7daaca49fd0))

## [1.7.6](https://github.com/Nosto/search-js/compare/v1.7.5...v1.7.6) (2025-04-08)


### Bug Fixes

* preact legacy exports ([05c4949](https://github.com/Nosto/search-js/commit/05c4949dbdbd97c13619ca174fe7460b4a3d6ab2))

## [1.7.5](https://github.com/Nosto/search-js/compare/v1.7.4...v1.7.5) (2025-04-07)


### Bug Fixes

* semantic release not updating package.json ([ddec91b](https://github.com/Nosto/search-js/commit/ddec91b50ff53ef856bd849852980f0fe5482241))
