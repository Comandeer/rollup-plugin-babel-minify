# rollup-plugin-babili Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

---

## [3.1.0] – 2017-06-10
#### Added
* Add support for Node.js 8 and npm 5.

### Changed
* Update Babili version to `^0.1.2`.
* Update Rollup version to `^0.42.0`.
* Add Rollup as peer dependency.

## [3.0.0] – 2017-04-22
### Changed
* Handling of banner option should be better now, thanks to [Alex Khomchenko](https://github.com/gagoman)!

## [2.0.0] – 2017-03-18
### Changed
* Update Babili version to `^0.0.12`.
* Update rollup to `^0.41.5`

### Removed
* Remove `fixMappings`, both from code and public API – after upgrading Rollup is not longer needed.

## [1.1.1] – 2017-01-25
### Changed
* Move changelog to Keep a Changelog standard.

### Fixed
* Apply `fixMappings` to all mappings.

## [1.1.0] – 2017-01-21
### Added
* Pass options to Babili preset.

## [1.0.3] – 2017-01-19
### Fixed
* Fix this changelog (one day I will not forget about it).
* Explicitly pass preset to babel to avoid problems with node 4.x and npm 2.x.

## [1.0.2] – 2017-01-19
### Fixed
* Explicitly pass banner plugin to babel to avoid problems with node 4.x and npm 2.x.

## [1.0.1] – 2017-01-19
### Fixed
* Added support for empty sourcemap's mappings.

## 1.0.0 – 2017-01-18
### Added
* First working version, yay!

[3.1.0]: https://github.com/Comandeer/rollup-plugin-babili/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/Comandeer/rollup-plugin-babili/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/Comandeer/rollup-plugin-babili/compare/v1.1.1...v2.0.0
[1.1.1]: https://github.com/Comandeer/rollup-plugin-babili/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Comandeer/rollup-plugin-babili/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/Comandeer/rollup-plugin-babili/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/Comandeer/rollup-plugin-babili/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Comandeer/rollup-plugin-babili/compare/v1.0.0...v1.0.1
