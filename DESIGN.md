
## Node
[The official document about module](http://nodejs.cn/api/modules.html#modules_all_together)

## Requirements
+ Collect all node_module in one `{config.globalPath}` folder and separates per module by its name.

The good part is if we use a package `foo` in 10 projects, so our disk will total cost of `10 * sizeof(foo)` but if we put all dependencies in a public directory like `{config.globalPath}`, and then `require('foo')` all from this path, we will just cost of one `sizeof(foo)` storage size on our disk.

```json
 - ${node_modules_global_path}/
  - dependency1/
    - v0.0.1/
      - lib/*
      - package.json
    - v2.1.1/
      - lib/*
      - package.json
  - dependency2/
    - v10.0.1/
      - lib/*
      - package.json
  - {dependciesN}
    - ...
  ...
```

+ `wpm install package`, registry match rules
```python
  if local: load local
  if local_global: load local_global
  if local_registry: load local_registry
  if global_registry: load global_registry
  if None, throw error
```

+ The local dependencies of a project: when `require` a module, local is first match.

`wpm local {packageName} --path/-p {packagePath}`

package.json:
```json
{
  "localeDependencies": {
    "localPackageName": "./your/lib/path"
  }
}
```

# Steps
1. Write `wpm install {package}`, well, u know this project's name `mapm`, but i am planning to use `wpm` for CLI bin.

  - [x] implements `wpm config {globalPath}`, and it must has default global path, like `$HOME/wpm_global/*`
  - [x] implements `wpm install {package}`
    - [x] Check Does it exist on local disk or Have installed this version ever before? `checkPackageExistsByVersion`, it easy to implements it by `fs.existSync(path = ${globalPath/package.version/package.name/package.main})`.
      - exists - `console.log(${package.name-package.version} exists in ${globalPath})`
      - does not exist - go 2 next
    - [x] Through `registry` match rules, get the best choice of registry
    - [x] Install `package.dependencies` recursively.

2. Rewrite nodejs `require`, implements it could reference this lib [require-rewrite](https://github.com/IUnknown68/require-rewrite/blob/master/index.js)

*: We know overwrite `require` function is not a good idea in fact, and if do this we must `require('require-overwrite')` again and again, but i have no any better idea till now.

# TODO
+ Look these libs code to get inspiration:
  - cnpm
  - npm
  - yarn
