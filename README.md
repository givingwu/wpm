# WPM
A new Node Package Manager - design it based on Java Maven Design Principles. **it is draft stage until now.**

## TODO
+ [x] Manage all Packages globally, integrating all modules in *`{node_modules_global_path}`*.
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
+ [x] Compatible with `yarn` and `npm`.

## LICENSE
[Apache License, Version 2.0, January 2004](https://www.apache.org/licenses/LICENSE-2.0)
