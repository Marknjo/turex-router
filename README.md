# Turex Meta

## :balloon: Overview

An argumentation of Epress.js Router with Typescript Decorators, using custom made Turex Meta for managing state instead of Reflex Metadata library.

The whole idea is to take advantage of Decorators, while not compiling the whole code to ES5. Afterall, this code will be running on the server side. No need of compiling it back to ES5.

## :anger: Requirement

- Nodejs
- Typescript
- Expressjs

## :scroll: QuickStart

1. Clone this repo or download the latest release. Rename it to whichever project name you want.
2. `cd <project name>`
3. Run `npm install`
4. **YOU ARE READY TO GO**

## :volcano: Modes

- `start:clean`: rm -rf build
- `start:build`: tsc -w
- `start:dev`: nodemon build/app -e js,ts,css,env
- `start`: concurrently npm:start:build npm:start:dev
