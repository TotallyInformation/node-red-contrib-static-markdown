# Changelog for node-red-contrib-static-markdown

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

uibuilder adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/TotallyInformation/node-red-static-markdown/compare/v0.0.15...master)

*

## [0.1.1](https://github.com/TotallyInformation/node-red-static-markdown/compare/v0.0.15...v0.1.1)

* Updated all dependencies - No more support for Node.js v6 or v8
* Minimum Node.js version is now v10
* Bump version to 0.1.1 because of Node.js dependency (some dependent libraries now use ES6)
* Incorporate bug fixes and enhancements from [Janvda](https://github.com/janvda) - many thanks for your contributions.
* Bug fix for [Issue #4](https://github.com/TotallyInformation/node-red-contrib-static-markdown/issues/4)
* Enhancement for [Issue #5](https://github.com/TotallyInformation/node-red-contrib-static-markdown/issues/5) - allow `.template.hbs` to exist anywhere
* Documentation update for [Issue #6](https://github.com/TotallyInformation/node-red-contrib-static-markdown/issues/6) - update docs to show that a restart of Node-RED is required for template changes
* Bug fix for [Issue #7](https://github.com/TotallyInformation/node-red-contrib-static-markdown/issues/7) - not showing test.md correctly
* Incorporates feature request [Issue #8](https://github.com/TotallyInformation/node-red-contrib-static-markdown/issues/8) - for include files via markdown-it-include
* Correct module name in package.json - "staticMarkdown"
* Isolate Editor code correctly to remove possible global var clashes
* Remove need for build stage by changing Editor script elements from `x-red` to `html` - Minimum Node-RED version is now v0.19
* REmove `@gerhobbelt/markdown-it-emoji` and replace with standard version as @gerhobbelt version requires a build step
* Code tidy in serveMarkdown.js

## [0.0.15](https://github.com/TotallyInformation/node-red-static-markdown/compare/v0.0.15...v0.0.14) - 2020-01-24

### Changed

* Updated all dependencies
* Relabelled in palette to "markdown" (was "Static Markdown")
* Changed palette category to "uibuilder" (was "UI Builder") in line with other nodes

## v0.0.10

First beta version. Should be usable, please test thoroughly.