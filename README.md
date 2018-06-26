# WPM
A new Node Package Manager - design it based on Java Maven Design Principles.

**Remeber, it is draft stage till now.**

# Features
1. Globally Manage -> Package and Package Version, integerates all in one folder to *Globally `node_modules` folder*
2. Make your local project file size smaller and smaller.
3. Other Features Like [Maven](https://github.com/apache/maven).
4. Compatible with `yarn` and `npm`.

# Details
1. **Do not have the local folder `node_modules` in local project path anymore.** - intead of, it be installed globally and be import from the globally `/root/.wpm/node_modules`, but i have not ready to thinkof where to put the all dependencies in globally file system.
2. **`import` and `require` all from globally dependencies folder.** - Does not need to import from locally `node_modules` folder.

# TODOs
- [x] Start design `WPM`.
- [ ] Implements `WPM` CLI.
    - [ ] command `wpm config [options]`, config options includes *registry*, *prefix*, *config*, *init*
    - [ ] command `wpm init`
    - [ ] command `wpm install`
    - [ ] command `wpm remove`, alias `rm`, `delete`, `del`
- [ ] Com
- [ ] Implements `NodeJS` extensions to make it supports `import`、`require` collect dependencies from globally folder first.
- [ ] Publish & OpenSource

# LICENSE
Before i done the all of `TODOs`, It was under [Apache License, Version 2.0, January 2004](https://www.apache.org/licenses/LICENSE-2.0)* license, After that it will releases under [MIT](https://opensource.org/licenses/MIT) license.
