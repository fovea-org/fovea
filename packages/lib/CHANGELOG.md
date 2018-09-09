# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.128"></a>
## [1.0.128](https://github.com/fovea-org/fovea/compare/v1.0.127...v1.0.128) (2018-09-09)


### Features

* Made the default host name in serve configs use the identifier provided as app name when using fovea create. This fixes [#23](https://github.com/fovea-org/fovea/issues/23) ([d52d7bd](https://github.com/fovea-org/fovea/commit/d52d7bd))





<a name="1.0.127"></a>
## [1.0.127](https://github.com/fovea-org/fovea/compare/v1.0.126...v1.0.127) (2018-08-31)

**Note:** Version bump only for package @fovea/lib





<a name="1.0.126"></a>
## [1.0.126](https://github.com/fovea-org/fovea/compare/v1.0.125...v1.0.126) (2018-08-30)

**Note:** Version bump only for package @fovea/lib





<a name="1.0.125"></a>
## [1.0.125](https://github.com/fovea-org/fovea/compare/v1.0.124...v1.0.125) (2018-08-26)

**Note:** Version bump only for package @fovea/lib





<a name="1.0.124"></a>
## [1.0.124](https://github.com/fovea-org/fovea/compare/v1.0.123...v1.0.124) (2018-08-23)


### Bug Fixes

* More work on tree-shaking ([7747a64](https://github.com/fovea-org/fovea/commit/7747a64))





<a name="1.0.123"></a>
## [1.0.123](https://github.com/fovea-org/fovea/compare/v1.0.122...v1.0.123) (2018-08-14)


### Features

* Removed compiler hints this doesn't play well with code splitting.\nfix: Fixed a bug where parent components weren't always detected as such when using code splitting.\nfeat: Removed the need to perform a full dry run before performing compilation ([3ecb729](https://github.com/fovea-org/fovea/commit/3ecb729))





<a name="1.0.122"></a>
## [1.0.122](https://github.com/fovea-org/fovea/compare/v1.0.121...v1.0.122) (2018-08-10)

**Note:** Version bump only for package @fovea/lib





<a name="1.0.121"></a>
## [1.0.121](https://github.com/fovea-org/fovea/compare/v1.0.120...v1.0.121) (2018-08-09)

**Note:** Version bump only for package @fovea/lib





<a name="1.0.120"></a>
## [1.0.120](https://github.com/fovea-org/fovea/compare/v1.0.119...v1.0.120) (2018-08-09)

**Note:** Version bump only for package @fovea/lib





<a name="1.0.119"></a>
## [1.0.119](https://github.com/fovea-org/fovea/compare/v1.0.118...v1.0.119) (2018-08-09)

**Note:** Version bump only for package @fovea/lib





<a name="1.0.118"></a>
## [1.0.118](https://github.com/fovea-org/fovea/compare/v1.0.117...v1.0.118) (2018-08-09)

**Note:** Version bump only for package @fovea/lib





<a name="1.0.117"></a>
## [1.0.117](https://github.com/fovea-org/fovea/compare/v1.0.116...v1.0.117) (2018-08-09)

**Note:** Version bump only for package @fovea/lib





<a name="1.0.116"></a>
## [1.0.116](https://github.com/fovea-org/fovea/compare/v1.0.115...v1.0.116) (2018-08-09)

**Note:** Version bump only for package @fovea/lib





<a name="1.0.115"></a>
## [1.0.115](https://github.com/fovea-org/fovea/compare/v1.0.114...v1.0.115) (2018-08-09)

**Note:** Version bump only for package @fovea/lib





<a name="1.0.114"></a>
## [1.0.114](https://github.com/fovea-org/fovea/compare/v1.0.113...v1.0.114) (2018-08-09)

**Note:** Version bump only for package @fovea/lib





<a name="1.0.113"></a>
## [1.0.113](https://github.com/fovea-org/fovea/compare/v1.0.112...v1.0.113) (2018-07-25)




**Note:** Version bump only for package @fovea/lib

<a name="1.0.112"></a>
## [1.0.112](https://github.com/fovea-org/fovea/compare/v1.0.111...v1.0.112) (2018-07-25)




**Note:** Version bump only for package @fovea/lib

<a name="1.0.111"></a>
## [1.0.111](https://github.com/fovea-org/fovea/compare/v1.0.110...v1.0.111) (2018-07-24)




**Note:** Version bump only for package @fovea/lib

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

* Fixed a bog with toggling classes ([79c43f2](https://github.com/fovea-org/fovea/commit/79c43f2))




<a name="1.0.104"></a>
## [1.0.104](https://github.com/fovea-org/fovea/compare/v1.0.103...v1.0.104) (2018-07-11)




**Note:** Version bump only for package @fovea/lib

<a name="1.0.103"></a>
## [1.0.103](https://github.com/fovea-org/fovea/compare/v1.0.102...v1.0.103) (2018-07-11)


### Bug Fixes

* Fixed an issue where multiple decorators could not annotate the same methods ([c707cd3](https://github.com/fovea-org/fovea/commit/c707cd3))




<a name="1.0.102"></a>
## [1.0.102](https://github.com/fovea-org/fovea/compare/v1.0.101...v1.0.102) (2018-07-02)




**Note:** Version bump only for package @fovea/lib

<a name="1.0.101"></a>
## [1.0.101](https://github.com/fovea-org/fovea/compare/v1.0.100...v1.0.101) (2018-07-02)




**Note:** Version bump only for package @fovea/lib

<a name="1.0.100"></a>
## [1.0.100](https://github.com/fovea-org/fovea/compare/v1.0.99...v1.0.100) (2018-07-02)




**Note:** Version bump only for package @fovea/lib

<a name="1.0.99"></a>
## [1.0.99](https://github.com/fovea-org/fovea/compare/v1.0.98...v1.0.99) (2018-06-30)




**Note:** Version bump only for package @fovea/lib

<a name="1.0.98"></a>
## [1.0.98](https://github.com/fovea-org/fovea/compare/v1.0.97...v1.0.98) (2018-06-30)




**Note:** Version bump only for package @fovea/lib

<a name="1.0.97"></a>
## [1.0.97](https://github.com/fovea-org/fovea/compare/v1.0.96...v1.0.97) (2018-06-30)


### Bug Fixes

* Missing Fovea plugin for package [@fovea](https://github.com/fovea)/router. Unnecessary dependency injection plugins for packages that doesn't rely on it has been removed ([7ae3e9d](https://github.com/fovea-org/fovea/commit/7ae3e9d))




<a name="1.0.96"></a>
## [1.0.96](https://github.com/fovea-org/fovea/compare/v1.0.95...v1.0.96) (2018-06-30)




**Note:** Version bump only for package @fovea/lib

<a name="1.0.95"></a>
## [1.0.95](https://github.com/fovea-org/fovea/compare/v1.0.94...v1.0.95) (2018-06-30)




**Note:** Version bump only for package @fovea/lib

<a name="1.0.94"></a>
## [1.0.94](https://github.com/fovea-org/fovea/compare/v0.1.3...v1.0.94) (2018-06-30)


### Bug Fixes

* Fixed issues where postcss would be polluted by the scss parser. ([ed5b9bf](https://github.com/fovea-org/fovea/commit/ed5b9bf))




<a name="0.1.3"></a>
## [0.1.3](https://github.com/fovea-org/fovea/compare/v0.1.2...v0.1.3) (2018-06-30)


### Bug Fixes

* Added missing [@types](https://github.com/types)/chokidar to [@fovea](https://github.com/fovea)/cli ([0b1b6b3](https://github.com/fovea-org/fovea/commit/0b1b6b3))




<a name="0.1.2"></a>
## 0.1.2 (2018-06-30)




**Note:** Version bump only for package @fovea/lib

<a name="0.1.1"></a>
## 0.1.1 (2018-06-30)




**Note:** Version bump only for package @fovea/lib
