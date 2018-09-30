# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.137"></a>
## [1.0.137](https://github.com/fovea-org/fovea/compare/v1.0.136...v1.0.137) (2018-09-30)

**Note:** Version bump only for package fovea





<a name="1.0.136"></a>
## [1.0.136](https://github.com/fovea-org/fovea/compare/v1.0.135...v1.0.136) (2018-09-30)

**Note:** Version bump only for package fovea





<a name="1.0.135"></a>
## [1.0.135](https://github.com/fovea-org/fovea/compare/v1.0.134...v1.0.135) (2018-09-30)


### Features

* [[@fovea](https://github.com/fovea)/router]: Routes now support a  property for routes that has children. When no child is matched by the URL, the child matched by the  property will be used. This fixes [#8](https://github.com/fovea-org/fovea/issues/8) ([ab259f7](https://github.com/fovea-org/fovea/commit/ab259f7))





<a name="1.0.134"></a>
## [1.0.134](https://github.com/fovea-org/fovea/compare/v1.0.133...v1.0.134) (2018-09-29)


### Features

* Added support for forced attributes. Fixes [#30](https://github.com/fovea-org/fovea/issues/30) ([60d4f4c](https://github.com/fovea-org/fovea/commit/60d4f4c))
* Improved minification for production builds ([84c3995](https://github.com/fovea-org/fovea/commit/84c3995))
* Made advanced treeshaking customization customizable from a new 'optimization' property of outputs declared in fovea-cli.config files ([f3db25e](https://github.com/fovea-org/fovea/commit/f3db25e))
* Made the fovea-cli.config format allow for even more customization of the build pipeline, including compression, minification, comment preserving/removal logic, advanced treeshaking, intro/outro/banner/footer appending/prepending, as well as sourcemap handling. ([6d5ff05](https://github.com/fovea-org/fovea/commit/6d5ff05))





<a name="1.0.133"></a>
## [1.0.133](https://github.com/fovea-org/fovea/compare/v1.0.132...v1.0.133) (2018-09-27)


### Features

* Added major scheduling overhaul for performance gains. Rendering is now asynchronous. More details will arrive in a detailed post ([7371991](https://github.com/fovea-org/fovea/commit/7371991))
* Optimizations on allocated heap memory ([2768bd1](https://github.com/fovea-org/fovea/commit/2768bd1))
* Removed external dependency from [@fovea](https://github.com/fovea)/router for smaller size. ([1cb3d96](https://github.com/fovea-org/fovea/commit/1cb3d96))





<a name="1.0.132"></a>
## [1.0.132](https://github.com/fovea-org/fovea/compare/v1.0.131...v1.0.132) (2018-09-20)


### Bug Fixes

* Fixed a few remaining issues with taking variables inside [@fovea](https://github.com/fovea)/styles ([9da4192](https://github.com/fovea-org/fovea/commit/9da4192))
* Fixed an issue where the CLI wouldn't generate a package.json that depended on [@fovea](https://github.com/fovea)/common. This would break hoisted dependencies in hoisted monorepos ([f4d21a0](https://github.com/fovea-org/fovea/commit/f4d21a0))
* Fixed an issue where the CLI wouldn't generate a package.json that depended on [@fovea](https://github.com/fovea)/lib ([f4d7b90](https://github.com/fovea-org/fovea/commit/f4d7b90))
* Fixed an issue with radio buttons in [@fovea](https://github.com/fovea)/material. Improved docs ([0aba61a](https://github.com/fovea-org/fovea/commit/0aba61a))
* Fixed an issue with taking variables which pointed to CSS Custom Properties with default values. The new behavior makes sure to actually use the default value in JSON output. ([fb87897](https://github.com/fovea-org/fovea/commit/fb87897))
* Fixed performance issues with debouncing and lazily evaluating certain things in [@fovea](https://github.com/fovea)/material ([10bd7e5](https://github.com/fovea-org/fovea/commit/10bd7e5))


### Features

* .[sass|scss] files can now [@import](https://github.com/import) from node_modules with the '~' prefix using the node resolution algorithm. ([10fa8a2](https://github.com/fovea-org/fovea/commit/10fa8a2))
* Abstract classes that directly or indirectly derives from HTMLElement will no longer auto-generate calls to customElements.define or customAttributes.define since these are not constructable and meant for subclassing. Fixes [#27](https://github.com/fovea-org/fovea/issues/27) ([f3b1168](https://github.com/fovea-org/fovea/commit/f3b1168))
* Added better runtime logging for when an already declared Custom Element or Custom Attribute is attempted to be defined. Fixes [#24](https://github.com/fovea-org/fovea/issues/24) ([be25025](https://github.com/fovea-org/fovea/commit/be25025))
* Made icon-button-components compatible with forms with the 'button' role ([053ce34](https://github.com/fovea-org/fovea/commit/053ce34))
* Made the base font size themeable in [@fovea](https://github.com/fovea)/material ([3ce8e9f](https://github.com/fovea-org/fovea/commit/3ce8e9f))
* Made transition durations and timing functions themeable in [@fovea](https://github.com/fovea)/material ([b32ed55](https://github.com/fovea-org/fovea/commit/b32ed55))


### BREAKING CHANGES

* The button Custom Attribute in @fovea/material is now a proper custom element to enhance interoperability.





<a name="1.0.131"></a>
## [1.0.131](https://github.com/fovea-org/fovea/compare/v1.0.130...v1.0.131) (2018-09-12)

**Note:** Version bump only for package fovea





<a name="1.0.130"></a>
## [1.0.130](https://github.com/fovea-org/fovea/compare/v1.0.129...v1.0.130) (2018-09-11)


### Bug Fixes

* Fixed an issue with taking [css|scss] variables from theme styles. ([848b25b](https://github.com/fovea-org/fovea/commit/848b25b))





<a name="1.0.129"></a>
## [1.0.129](https://github.com/fovea-org/fovea/compare/v1.0.128...v1.0.129) (2018-09-10)


### Bug Fixes

* Fixed a bug where element names inside SVG markup would be forced into dash-case, even though they may be case-sensitive ([6e934c7](https://github.com/fovea-org/fovea/commit/6e934c7))
* Fixed a bug where element names inside SVG markup would be forced into dash-case, even though they may be case-sensitive ([bebdf77](https://github.com/fovea-org/fovea/commit/bebdf77))





<a name="1.0.128"></a>
## [1.0.128](https://github.com/fovea-org/fovea/compare/v1.0.127...v1.0.128) (2018-09-09)


### Bug Fixes

* Fixed a bug where the 'value' property would always be set as attributes rather than as properties for <textarea> elements ([72d63a4](https://github.com/fovea-org/fovea/commit/72d63a4))
* Made the 'dir' property forced as an attribute for custom elements ([659e54c](https://github.com/fovea-org/fovea/commit/659e54c))


### Features

* Made the default host name in serve configs use the identifier provided as app name when using fovea create. This fixes [#23](https://github.com/fovea-org/fovea/issues/23) ([d52d7bd](https://github.com/fovea-org/fovea/commit/d52d7bd))





<a name="1.0.127"></a>
## [1.0.127](https://github.com/fovea-org/fovea/compare/v1.0.126...v1.0.127) (2018-08-31)

**Note:** Version bump only for package fovea





<a name="1.0.126"></a>
## [1.0.126](https://github.com/fovea-org/fovea/compare/v1.0.125...v1.0.126) (2018-08-30)

**Note:** Version bump only for package fovea





<a name="1.0.125"></a>
## [1.0.125](https://github.com/fovea-org/fovea/compare/v1.0.124...v1.0.125) (2018-08-26)

**Note:** Version bump only for package fovea





<a name="1.0.124"></a>
## [1.0.124](https://github.com/fovea-org/fovea/compare/v1.0.123...v1.0.124) (2018-08-23)


### Bug Fixes

* Fixed an issue where global styles wouldn't be updated in watch mode. Fixes [#1](https://github.com/fovea-org/fovea/issues/1) ([c507eea](https://github.com/fovea-org/fovea/commit/c507eea))
* Fixed an issue where the Rollup watcher wouldn't be fully detached on rebuilds in watch mode ([bd11537](https://github.com/fovea-org/fovea/commit/bd11537))
* More work on tree-shaking ([bb129e2](https://github.com/fovea-org/fovea/commit/bb129e2))
* More work on tree-shaking ([7747a64](https://github.com/fovea-org/fovea/commit/7747a64))





<a name="1.0.123"></a>
## [1.0.123](https://github.com/fovea-org/fovea/compare/v1.0.122...v1.0.123) (2018-08-14)


### Features

* Removed compiler hints this doesn't play well with code splitting.\nfix: Fixed a bug where parent components weren't always detected as such when using code splitting.\nfeat: Removed the need to perform a full dry run before performing compilation ([3ecb729](https://github.com/fovea-org/fovea/commit/3ecb729))





<a name="1.0.122"></a>
## [1.0.122](https://github.com/fovea-org/fovea/compare/v1.0.121...v1.0.122) (2018-08-10)


### Bug Fixes

* Fixed an SVG issue. ([0d6068c](https://github.com/fovea-org/fovea/commit/0d6068c))
* Removed redundant tsconfig libs ([ec9c69b](https://github.com/fovea-org/fovea/commit/ec9c69b))





<a name="1.0.121"></a>
## [1.0.121](https://github.com/fovea-org/fovea/compare/v1.0.120...v1.0.121) (2018-08-09)

**Note:** Version bump only for package fovea





<a name="1.0.120"></a>
## [1.0.120](https://github.com/fovea-org/fovea/compare/v1.0.119...v1.0.120) (2018-08-09)

**Note:** Version bump only for package fovea





<a name="1.0.119"></a>
## [1.0.119](https://github.com/fovea-org/fovea/compare/v1.0.118...v1.0.119) (2018-08-09)

**Note:** Version bump only for package fovea





<a name="1.0.118"></a>
## [1.0.118](https://github.com/fovea-org/fovea/compare/v1.0.117...v1.0.118) (2018-08-09)

**Note:** Version bump only for package fovea





<a name="1.0.117"></a>
## [1.0.117](https://github.com/fovea-org/fovea/compare/v1.0.116...v1.0.117) (2018-08-09)

**Note:** Version bump only for package fovea





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
