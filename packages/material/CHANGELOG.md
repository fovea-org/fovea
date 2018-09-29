# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.134"></a>
## [1.0.134](https://github.com/fovea-org/fovea/compare/v1.0.133...v1.0.134) (2018-09-29)

**Note:** Version bump only for package @fovea/material





<a name="1.0.133"></a>
## [1.0.133](https://github.com/fovea-org/fovea/compare/v1.0.132...v1.0.133) (2018-09-27)


### Features

* Added major scheduling overhaul for performance gains. Rendering is now asynchronous. More details will arrive in a detailed post ([7371991](https://github.com/fovea-org/fovea/commit/7371991))
* Optimizations on allocated heap memory ([2768bd1](https://github.com/fovea-org/fovea/commit/2768bd1))





<a name="1.0.132"></a>
## [1.0.132](https://github.com/fovea-org/fovea/compare/v1.0.131...v1.0.132) (2018-09-20)


### Bug Fixes

* Fixed a few remaining issues with taking variables inside [@fovea](https://github.com/fovea)/styles ([9da4192](https://github.com/fovea-org/fovea/commit/9da4192))
* Fixed an issue where the CLI wouldn't generate a package.json that depended on [@fovea](https://github.com/fovea)/lib ([f4d7b90](https://github.com/fovea-org/fovea/commit/f4d7b90))
* Fixed an issue with radio buttons in [@fovea](https://github.com/fovea)/material. Improved docs ([0aba61a](https://github.com/fovea-org/fovea/commit/0aba61a))
* Fixed an issue with taking variables which pointed to CSS Custom Properties with default values. The new behavior makes sure to actually use the default value in JSON output. ([fb87897](https://github.com/fovea-org/fovea/commit/fb87897))
* Fixed performance issues with debouncing and lazily evaluating certain things in [@fovea](https://github.com/fovea)/material ([10bd7e5](https://github.com/fovea-org/fovea/commit/10bd7e5))


### Features

* .[sass|scss] files can now [@import](https://github.com/import) from node_modules with the '~' prefix using the node resolution algorithm. ([10fa8a2](https://github.com/fovea-org/fovea/commit/10fa8a2))
* Abstract classes that directly or indirectly derives from HTMLElement will no longer auto-generate calls to customElements.define or customAttributes.define since these are not constructable and meant for subclassing. Fixes [#27](https://github.com/fovea-org/fovea/issues/27) ([f3b1168](https://github.com/fovea-org/fovea/commit/f3b1168))
* Made icon-button-components compatible with forms with the 'button' role ([053ce34](https://github.com/fovea-org/fovea/commit/053ce34))
* Made the base font size themeable in [@fovea](https://github.com/fovea)/material ([3ce8e9f](https://github.com/fovea-org/fovea/commit/3ce8e9f))
* Made transition durations and timing functions themeable in [@fovea](https://github.com/fovea)/material ([b32ed55](https://github.com/fovea-org/fovea/commit/b32ed55))


### BREAKING CHANGES

* The button Custom Attribute in @fovea/material is now a proper custom element to enhance interoperability.





<a name="1.0.131"></a>
## [1.0.131](https://github.com/fovea-org/fovea/compare/v1.0.130...v1.0.131) (2018-09-12)

**Note:** Version bump only for package @fovea/material





<a name="1.0.130"></a>
## [1.0.130](https://github.com/fovea-org/fovea/compare/v1.0.129...v1.0.130) (2018-09-11)


### Bug Fixes

* Fixed an issue with taking [css|scss] variables from theme styles. ([848b25b](https://github.com/fovea-org/fovea/commit/848b25b))
