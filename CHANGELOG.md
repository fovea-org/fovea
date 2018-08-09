# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.116"></a>
## [1.0.116](https://github.com/fovea-org/fovea/compare/v1.0.115...v1.0.116) (2018-08-09)

**Note:** Version bump only for package fovea





<a name="1.0.115"></a>
## [1.0.115](https://github.com/fovea-org/fovea/compare/v1.0.114...v1.0.115) (2018-08-09)

**Note:** Version bump only for package fovea





<a name="1.0.114"></a>
## [1.0.114](https://github.com/fovea-org/fovea/compare/v1.0.113...v1.0.114) (2018-08-09)


### Bug Fixes

* Fixed an issue where attributes provided to SVG elements would be forced into dash-case, even though SVG elements may receive case-sensitive attributes ([4694e0b](https://github.com/fovea-org/fovea/commit/4694e0b))
* Fixed an issue where attributes provided to SVG elements would be forced into dash-case, even though SVG elements may receive case-sensitive attributes ([e6d24ec](https://github.com/fovea-org/fovea/commit/e6d24ec))





<a name="1.0.113"></a>
## [1.0.113](https://github.com/fovea-org/fovea/compare/v1.0.112...v1.0.113) (2018-07-25)




**Note:** Version bump only for package fovea

<a name="1.0.112"></a>
## [1.0.112](https://github.com/fovea-org/fovea/compare/v1.0.111...v1.0.112) (2018-07-25)


### Bug Fixes

* Fixed an issue where extending other components would break in watch mode because it doesn't guarantee the discovery order of components without dry runs ([336fe67](https://github.com/fovea-org/fovea/commit/336fe67))




<a name="1.0.111"></a>
## [1.0.111](https://github.com/fovea-org/fovea/compare/v1.0.110...v1.0.111) (2018-07-24)




**Note:** Version bump only for package fovea

<a name="1.0.110"></a>
## [1.0.110](https://github.com/fovea-org/fovea/compare/v1.0.109...v1.0.110) (2018-07-23)


### Bug Fixes

* Fixed a bug where the same component could be rendered multiple times if connectedCallback was invoked manually ([26dd8cd](https://github.com/fovea-org/fovea/commit/26dd8cd))




<a name="1.0.109"></a>
## [1.0.109](https://github.com/fovea-org/fovea/compare/v1.0.108...v1.0.109) (2018-07-18)


### Bug Fixes

* Made sure to upgrade custom attributes within the __construct private lib helper, and to dispose them from __dispose to avoid having to make 'constructCustomAttribute' public ([6180e8a](https://github.com/fovea-org/fovea/commit/6180e8a))




<a name="1.0.108"></a>
## [1.0.108](https://github.com/fovea-org/fovea/compare/v1.0.107...v1.0.108) (2018-07-18)


### Bug Fixes

* Fixed a bug in which custom attributes would sometimes be disposed prematurely ([97256fc](https://github.com/fovea-org/fovea/commit/97256fc))
* Fixed a bug in which stats would be calculated wrong under some circumstances when multiple components or custom attributes are declared within the same file ([becd27f](https://github.com/fovea-org/fovea/commit/becd27f))
* Fixed an issue where connectedCallbacks and disconnectedCallbacks of Custom Attributes would either not fire or fire at the wrong times under some circumstances. ([f20aac9](https://github.com/fovea-org/fovea/commit/f20aac9))
* Fixed an issue with compiler comments that would be stripped under some circumstances when not anticipated ([da3d6fc](https://github.com/fovea-org/fovea/commit/da3d6fc))




<a name="1.0.107"></a>
## [1.0.107](https://github.com/fovea-org/fovea/compare/v1.0.106...v1.0.107) (2018-07-16)


### Bug Fixes

* Fixed an issue with toggling class attribute values ([3e117e3](https://github.com/fovea-org/fovea/commit/3e117e3))




<a name="1.0.106"></a>
## [1.0.106](https://github.com/fovea-org/fovea/compare/v1.0.105...v1.0.106) (2018-07-15)


### Features

* Added logging for when a listener is declared for an unknown element ([56dcd13](https://github.com/fovea-org/fovea/commit/56dcd13))
* Implemented support for host attributes. This allows hosts to declaratively data bind to the host, including default style properties, classes, custom attributes, et cetera ([b004e10](https://github.com/fovea-org/fovea/commit/b004e10))




<a name="1.0.105"></a>
## [1.0.105](https://github.com/fovea-org/fovea/compare/v1.0.104...v1.0.105) (2018-07-11)


### Bug Fixes

* Added class-list to polyfills array ([a1c0d6d](https://github.com/fovea-org/fovea/commit/a1c0d6d))
* Fixed a bog with toggling classes ([79c43f2](https://github.com/fovea-org/fovea/commit/79c43f2))




<a name="1.0.104"></a>
## [1.0.104](https://github.com/fovea-org/fovea/compare/v1.0.103...v1.0.104) (2018-07-11)


### Bug Fixes

* Removed an unneeded method inside the compressPlugin ([21cd599](https://github.com/fovea-org/fovea/commit/21cd599))




<a name="1.0.103"></a>
## [1.0.103](https://github.com/fovea-org/fovea/compare/v1.0.102...v1.0.103) (2018-07-11)


### Bug Fixes

* Fixed an issue where multiple decorators could not annotate the same methods ([c707cd3](https://github.com/fovea-org/fovea/commit/c707cd3))
* Fixed an issue with a wrong import ([1137b5b](https://github.com/fovea-org/fovea/commit/1137b5b))




<a name="1.0.102"></a>
## [1.0.102](https://github.com/fovea-org/fovea/compare/v1.0.101...v1.0.102) (2018-07-02)




**Note:** Version bump only for package fovea

<a name="1.0.101"></a>
## [1.0.101](https://github.com/fovea-org/fovea/compare/v1.0.100...v1.0.101) (2018-07-02)




**Note:** Version bump only for package fovea

<a name="1.0.100"></a>
## [1.0.100](https://github.com/fovea-org/fovea/compare/v1.0.99...v1.0.100) (2018-07-02)


### Bug Fixes

* The MAIN_ICON should be a base64-encoded PNG rather than SVG ([3abd88a](https://github.com/fovea-org/fovea/commit/3abd88a))




<a name="1.0.99"></a>
## [1.0.99](https://github.com/fovea-org/fovea/compare/v1.0.98...v1.0.99) (2018-06-30)




**Note:** Version bump only for package fovea

<a name="1.0.98"></a>
## [1.0.98](https://github.com/fovea-org/fovea/compare/v1.0.97...v1.0.98) (2018-06-30)


### Bug Fixes

* Fixed wrong URLs to packages in standard template generated by [@fovea](https://github.com/fovea)/cli ([8a98009](https://github.com/fovea-org/fovea/commit/8a98009))




<a name="1.0.97"></a>
## [1.0.97](https://github.com/fovea-org/fovea/compare/v1.0.96...v1.0.97) (2018-06-30)


### Bug Fixes

* Missing Fovea plugin for package [@fovea](https://github.com/fovea)/router. Unnecessary dependency injection plugins for packages that doesn't rely on it has been removed ([7ae3e9d](https://github.com/fovea-org/fovea/commit/7ae3e9d))




<a name="1.0.96"></a>
## [1.0.96](https://github.com/fovea-org/fovea/compare/v1.0.95...v1.0.96) (2018-06-30)


### Bug Fixes

* Fixed an issue where the bin generated by [@fovea](https://github.com/fovea)/cli didn't point to any file ([0d6ecd2](https://github.com/fovea-org/fovea/commit/0d6ecd2))




<a name="1.0.95"></a>
## [1.0.95](https://github.com/fovea-org/fovea/compare/v1.0.94...v1.0.95) (2018-06-30)




**Note:** Version bump only for package fovea

<a name="1.0.94"></a>
## [1.0.94](https://github.com/fovea-org/fovea/compare/v0.1.3...v1.0.94) (2018-06-30)


### Bug Fixes

* bumped base version since [@fovea](https://github.com/fovea)/dom is currently at v1.0.93 ([8cb7162](https://github.com/fovea-org/fovea/commit/8cb7162))
* Fixed issues where postcss would be polluted by the scss parser. ([ed5b9bf](https://github.com/fovea-org/fovea/commit/ed5b9bf))




<a name="0.1.3"></a>
## [0.1.3](https://github.com/fovea-org/fovea/compare/v0.1.2...v0.1.3) (2018-06-30)


### Bug Fixes

* Added missing [@types](https://github.com/types)/chokidar to [@fovea](https://github.com/fovea)/cli ([0b1b6b3](https://github.com/fovea-org/fovea/commit/0b1b6b3))
* Fixed a lint issue ([b406156](https://github.com/fovea-org/fovea/commit/b406156))




<a name="0.1.2"></a>
## 0.1.2 (2018-06-30)




**Note:** Version bump only for package fovea

<a name="0.1.1"></a>
## 0.1.1 (2018-06-30)




**Note:** Version bump only for package fovea
