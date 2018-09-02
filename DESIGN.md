
## Node module
[官方设计思路的文档](http://nodejs.cn/api/modules.html#modules_all_together)


## mapm的目标

1. sizeof(O(N)) -> O(1)
2. debug friendly


## npm VS maven
首先比较 maven 设计与npm的不同之处，再做node版的 maven 实现。

1. maven 统一入口管理所有依赖，所有依赖包放在单个文件内
	+ ${globallyPath}/node_modules/
		- dependency1
			- v0.0.1
				- package.json
			- v2.1.1
				- package.json
		- dependency2
			- v10.0.1
				- package.json
		- dependciesN
		...

	这样做的优点是一个相同版本的依赖包 package 在之前有n 个项目中使用到，那么本地硬盘将占用 n * sizeOf(package)，
	而现在则是 n * 1。因为所有的 `import` or `require` 和 `install` 都会先走全局 ${globallyPath} 去引入和安装。

2. maven 可自定义私有仓库，下载依赖时 local -> global -> internet
	事实上 npm 也支持这一点，这本身并非 nodeJS 的工作，既是 npm config get registry 的地址。但是它是否支持像 maven
	一样的 local registry -> if not found this package -> global registry 的回退机制呢？在还未查看 npm source code 之前还无法定论。下载包的时候先从本地 registry 下载，类似以下伪代码

	`mapm install ${package}`

       ```
	if (${localRegistryServer}/${module} is a Directory) DOWN_FROM_LOCALE(package)
	else DOWN_FROM_REMOTE(package)
	```

3. maven 之其他特点？还需要摸索。如何摸索？当然是玩几把 Java Project。


## Modifies

Next, I will change some lines in following fake code: The major modifies in `LOAD_AS_DIRCTORY` method in fact. There is a important thing is the `require` function does not support `require('package', 'version')` like this, we got 'version' the only entry is from the dev/dependecies of project pacakge.json. How to impls require('package', 'version')? Overwrite the original native require function or have other ways?

```
require(X, SEMVER) from module at path Y
1. If X is a core module,
   a. return the core module
   b. STOP
2. If X begins with '/'
   a. set Y to be the filesystem root
3. If X begins with './' or '/' or '../'
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
/* add: 1.1
   a. if has valid semver
   b. SEMVER &&  LOAD_AS_VERSION(X + SERVER);
 */
4. LOAD_NODE_MODULES(X, dirname(Y))
5. THROW "not found"

LOAD_AS_FILE(X)
1. If X is a file, load X as JavaScript text.  STOP
2. If X.js is a file, load X.js as JavaScript text.  STOP
3. If X.json is a file, parse X.json to a JavaScript Object.  STOP
4. If X.node is a file, load X.node as binary addon.  STOP

LOAD_INDEX(X)
1. If X/index.js is a file, load X/index.js as JavaScript text.  STOP
2. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
3. If X/index.node is a file, load X/index.node as binary addon.  STOP

LOAD_AS_VERSION(X, SEMVER)
1. If exists a valid semver && DIR_NAME === SEMVER, SET X += SEMVER
	1. LOAD_AS_DIRECTORY(X, FROM_TOP) // only load once to prevent infinity loop
	2. done
2. quit

LOAD_AS_DIRECTORY(X, FROM_TOP)
1. If X/package.json is a file,
   a. Parse X/package.json, and look for "main" field.
   b. let M = X + (json main field)
   c. LOAD_AS_FILE(M)
   d. LOAD_INDEX(M)
2. LOAD_INDEX(X)
// add
3. !!!FROM_TOP && LOAD_VERSION(X)

LOAD_NODE_MODULES(X, START)
1. let DIRS=NODE_MODULES_PATHS(START)
2. for each DIR in DIRS:
   a. LOAD_AS_FILE(DIR/X)
   b. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = count of PARTS - 1
3. let DIRS = []
4. while I >= 0,
   a. if PARTS[I] = "node_modules" CONTINUE
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIRS + DIR
   d. let I = I - 1
5. return DIRS
```


## What would like i do?

1. 实现以上功能，则需要 mapm - maven node package manager.
2. 重写 require 方法
3. 重写 npm/yarn install 方法
4. That is what mapm be designed like Apache Maven Package manager!
