# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.0] - 2023-02-03

### Changed

-   Renamed stream functions:
    -   ~~`createMapsStream`~~ to `createMapsDownloadStream`
    -   ~~`createMatchRangeStream`~~ to `createMatchRangeDownloadStream`

## [0.5.0] - 2023-02-01

### Added

-   Some basic unit tests.
-   `createReadStreamFromFile` to read jsonl.gz files.

## [0.4.0] - 2023-01-22

### Changed

-   Exporting Map/Player/Team/Match types.
-   Maps are now transformed to JSONlines + compressed with gzip by default.

## [0.3.0] - 2023-01-22

### Added

-   Added `tpa-download` CLI tool to download maps and matches from the command line.

## [0.2.0] - 2023-01-21

### Changed

-   Package name changed from `@keratagpro/tagpro-analytics-bulk-download` to `@keratagpro/tagpro-analytics-bulk-downloader`, because it seems like "download" is a restricted keyword in npmjs.

## [0.1.1] - 2023-01-21

### Added

-   github link to package.json

## [0.1.0] - 2023-01-21

### Added

-   initial release.

[Unreleased]: https://github.com/keratagpro/tagpro-analytics-bulk-downloader/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/keratagpro/tagpro-analytics-bulk-downloader/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/keratagpro/tagpro-analytics-bulk-downloader/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/keratagpro/tagpro-analytics-bulk-downloader/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/keratagpro/tagpro-analytics-bulk-downloader/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/keratagpro/tagpro-analytics-bulk-downloader/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/keratagpro/tagpro-analytics-bulk-downloader/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/keratagpro/tagpro-analytics-bulk-downloader/compare/v0.0.1...v0.1.0
