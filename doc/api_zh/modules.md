# Modules(模块)

> Stability: 3 - Locked

<!--name=module-->

Node.js有一个简单的模块加载系统。在Node.js中，文件和模块是一一对应的(每个文件都被当成是独立的模块对待)。

例如, 考虑有这么一个文件`foo.js`:

```js
const circle = require('./circle.js');
console.log(`The area of a circle of radius 4 is ${circle.area(4)}`);
```

在第一行中，`foo.js`文件加载了同一目录下的模块`circle.js`。

下面是`circle.js`文件的内容：

```js
const PI = Math.PI;

exports.area = (r) => PI * r * r;

exports.circumference = (r) => 2 * PI * r;
```

`circle.js`模块向外暴露`area()`和`circumference()`方法。可以通过向特殊对象`exports`中添加函数和对象达到向自定义模块的根添加方法和对象的目的。

因为模块会被Node.js封装在函数中，所以模块中定义的变量是私有的(详情请查看[module wrapper](#modules_the_module_wrapper))。在这个例子中，变量`PI`是`circle.js`模块的私有变量。

如果你想模块向外部暴露的是一个函数(比如构造器)，或者你想向外部暴露一个单纯的一次构建好的对象，而不是一次一次地向其中添加属性，那么将这个函数或者对象赋值给`module.exports`而不是赋值给`exports`。

下面的例子中，`bar.js`中使用了`square`模块，该模块导出的是一个构造器：

```js
const square = require('./square.js');
var mySquare = square(2);
console.log(`The area of my square is ${mySquare.area()}`);
```

`square`模块定义在`square.js`文件中：

```js
// assigning to exports will not modify module, must use module.exports
module.exports = (width) => {
  return {
    area: () => width * width
  };
}
```

模块系统是在`require("module")`模块中实现的。

## Accessing the main module(访问主模块)

<!-- type=misc -->

当通过Node.js直接运行一个文件时，`require.main`被设置为该文件的`module`。这意味着你可以通过下面的测试来知道一个文件是否是被Node.js直接运行的。

```js
require.main === module
```

对于`foo.js`文件，如果是通过`node foo.js`来执行的，结果为`true`；如果是通过`require('./foo')`加载则结果为`false`。

因为`module`提供了一个`filename`属性(通常等价于`__filename`)，当前应用的入口文件可以通过检查`require.main.filename`属性的值来获得。

## Addenda: Package Manager Tips(附录：包管理器小技巧)

<!-- type=misc -->

Node.js中`require()`方法的语义被设计的足够普遍，足以支持许多合理的目录结构。包管理程序，比如`dpkg`, `rpm`, 和 `npm`有望在不做修改的情况下从Node.js模块中构建本地包。

下面我们给出一个建议的目录结构：

比如说我们想在目录`/usr/lib/node/<some-package>/<some-version>`中存放一个包的特定版本的内容。

包之间可以相互依赖。为了安装包`foo`，或许你还要安装特定版本的包`bar`。包`bar`可能也有自己的依赖，在一些情况下，这些依赖甚至是重叠的或者是循环依赖的。

因为Node.js会查找它加载的任意一个模块的`realpath(真实路径)`(),然后根据描述[here](#modules_loading_from_node_modules_folders)在`node_modules`目录中查找它们的依赖，这种情况可以通过使用下面的结构来轻易的解决。

* `/usr/lib/node/foo/1.2.3/` - Contents of the `foo` package, version 1.2.3.
* `/usr/lib/node/bar/4.3.2/` - Contents of the `bar` package that `foo`
  depends on.
* `/usr/lib/node/foo/1.2.3/node_modules/bar` - Symbolic link to
  `/usr/lib/node/bar/4.3.2/`.
* `/usr/lib/node/bar/4.3.2/node_modules/*` - Symbolic links to the packages
  that `bar` depends on.

因此，即使遇到循环依赖，或者如果存在依赖冲突，每个模块都能获得一个可用的版本的依赖。

当`foo`包中的代码执行`require('bar')`时，它将获取到符号链接指向的`/usr/lib/node/foo/1.2.3/node_modules/bar`中的版本。然后，当`bar`包中的代码调用`require('quux')`时，它将获取到符号链接指向的`/usr/lib/node/bar/4.3.2/node_modules/quux`中的版本。

此外，为了使模块查找过程更加优化，我们可以将模块放在`/usr/lib/node_modules/<name>/<version>`中而不是直接将包放在`/usr/lib/node`中。然后Node.js将不会在`/usr/node_modules`或`/node_modules`中查找依赖(依赖项并不在这两个目录中)。

为了使模块对于Node.js REPL可用，将`/usr/lib/node_modules`目录也添加到`$NODE_PATH`环境变量中将会有作用。因为使用`node_modules`目录的模块查找都是相对的，并基于调用`require()`方法的文件的真实路径，所以这些包可以在任何地方。

## All Together...

<!-- type=misc -->

可以使用`require.resolve()`方法来获取`require()`方法被调用时加载文件的确切的文件名。

综上所述，下面是用伪代码写的高级算法来解释require.resolve到底做了什么：

```txt
require(X) from module at path Y
1. If X is a core module,
   a. return the core module
   b. STOP
2. If X begins with './' or '/' or '../'
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
3. LOAD_NODE_MODULES(X, dirname(Y))
4. THROW "not found"

LOAD_AS_FILE(X)
1. If X is a file, load X as JavaScript text.  STOP
2. If X.js is a file, load X.js as JavaScript text.  STOP
3. If X.json is a file, parse X.json to a JavaScript Object.  STOP
4. If X.node is a file, load X.node as binary addon.  STOP

LOAD_AS_DIRECTORY(X)
1. If X/package.json is a file,
   a. Parse X/package.json, and look for "main" field.
   b. let M = X + (json main field)
   c. LOAD_AS_FILE(M)
2. If X/index.js is a file, load X/index.js as JavaScript text.  STOP
3. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
4. If X/index.node is a file, load X/index.node as binary addon.  STOP

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

## Caching(缓存)

<!--type=misc-->

模块在第一次加载后会被缓存。也就是说(除了别的以外)如果`require`方法解析了同一个文件，那每次调用`require('foo')`都将获得完全相同的返回对象。

多次调用`require('foo')`时模块的代码并不会重复执行。这是一个很重要的特性。有了这个特性，“部分完成”的对象可以被返回，从而允许传递依赖也能被加载，即使它们可能引起循环依赖。

如果想要某个模块的代码多次执行，可以导出一个方法然后调用那个方法。

### Module Caching Caveats(警告)

<!--type=misc-->

模块是基于其解析的文件名进行缓存的。由于模块基于调用模块的位置(从`node_modules`目录加载)可能会解析为不同的文件名，所以如果解析到不同的文件，则*不能保证*`require('foo')`方法总是返回相同的对象。

另外，在大小写不敏感的文件系统或者操作系统中，解析后不同的文件名可能指向相同的文件，但是缓存依然把它们当成不同的模块从而多次重新加载该文件。例如，`require('./foo')`和`require('./FOO')`两个方法返回两个不同的对象，而不管`./foo`和`./FOO`是否是同一个文件。

## Core Modules(核心模块)

<!--type=misc-->

Node.js有几个被编译成二进制的模块。这些模块在该文档点其他地方有详细的描述。

核心模块在Node.js的源代码中定义，位于`lib/`目录下。

如果核心模块的标识符传递给`require()`方法则被优先加载。例如，`require('http')`总是返回内建的HTTP模块，即使有同名文件也是如此。

## Cycles(循环依赖)

<!--type=misc-->

当发生循环`require()`调用时，一个模块在返回时可能还未完全执行完。

考虑下面这种情况：

`a.js`:

```js
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```

`b.js`:

```js
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```

`main.js`:

```js
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done=%j, b.done=%j', a.done, b.done);
```

当`main.js`加载`a.js`时，`a.js`依次加载`b.js`。此时，`b.js`试图加载`a.js`。为了不形成死循环，一个`a.js`文件导出对象*未完成的拷贝*被返回给了`b.js`。然后`b.js`加载完成，它的`exports(导出对象)`提供给了`a.js`模块。

当`main.js`加载这两个模块时，它们都执行完成。该程序的输出如下：

```txt
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done=true, b.done=true
```

如果在你的程序中有循环模块以来，请确保有相应的计划。

## File Modules(文件模块)

<!--type=misc-->

如果没有找到跟提供的文件名一样的文件，Node.js会依次尝试加载具有如下扩展名的文件(filename+扩展名)：`.js`, `.json`,最后是`.node`.

`.js`后缀的文件会被当作JavaScript文本文件解析，`.json`后缀的文件会被当作JSON文本文件解析，`.node`后缀的文件会被解析为用`dlopen`加载的编译过的附加模块。

前缀为`'/'`的被请求模块是被请求文件的绝对路径。例如：`require('/home/marco/foo.js')`将会加载`/home/marco/foo.js`这个文件。

前缀为`'./'`的被请求模块是相对于调用`require()`的文件的。即为了让`require('./circle')`找到`circle.js`文件，`circle.js`文件和调用它的`foo.js`文件必须要在同一目录下。

如果没有前导'/', './',或'../'来标示文件，那么这个模块必须是一个核心模块或者是从`node_modules`目录加载。

如果给定的目录不存在，`require()`将会抛出一个[`Error`][]，该[`Error`][]的`code`属性的值为`'MODULE_NOT_FOUND'`。

## Folders as Modules(目录模块)

<!--type=misc-->

将程序和库组织在一个自包含的目录中，然后提供一个到该库的单个入口是很方便的。有三种方法可以将目录传递给`require()`作为参数。

第一种方式是在库的根目录创建一个`package.json`文件，指定该库的主模块。下面是一个示例的package.json文件：

```json
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```

如果这个文件在`./some-library`目录中，那么`require('./some-library')`将会试图加载`./some-library/lib/some-library.js`文件。

这是Node.js对package.json文件的感知程度。

注意：如果由`package.json`的`"main"`条目指定的文件丢失，无法解析，Node.js会认为整个模块丢失，并报一个磨人错误：

```txt
Error: Cannot find module 'some-library'
```

如果在目录中没有package.json文件，然后Node.js会尝试从该目录中加载`index.js`或者`index.node文件`。例如，如果上面的例子中没有package.json文件，那么`require('./some-library')`将会试图加载：

* `./some-library/index.js`
* `./some-library/index.node`

## Loading from `node_modules` Folders

<!--type=misc-->

If the module identifier passed to `require()` is not a
[core](#modules_core_modules) module, and does not begin with `'/'`, `'../'`, or
`'./'`, then Node.js starts at the parent directory of the current module, and
adds `/node_modules`, and attempts to load the module from that location. Node
will not append `node_modules` to a path already ending in `node_modules`.

If it is not found there, then it moves to the parent directory, and so
on, until the root of the file system is reached.

For example, if the file at `'/home/ry/projects/foo.js'` called
`require('bar.js')`, then Node.js would look in the following locations, in
this order:

* `/home/ry/projects/node_modules/bar.js`
* `/home/ry/node_modules/bar.js`
* `/home/node_modules/bar.js`
* `/node_modules/bar.js`

This allows programs to localize their dependencies, so that they do not
clash.

You can require specific files or sub modules distributed with a module by
including a path suffix after the module name. For instance
`require('example-module/path/to/file')` would resolve `path/to/file`
relative to where `example-module` is located. The suffixed path follows the
same module resolution semantics.

## Loading from the global folders

<!-- type=misc -->

If the `NODE_PATH` environment variable is set to a colon-delimited list
of absolute paths, then Node.js will search those paths for modules if they
are not found elsewhere.  (Note: On Windows, `NODE_PATH` is delimited by
semicolons instead of colons.)

`NODE_PATH` was originally created to support loading modules from
varying paths before the current [module resolution][] algorithm was frozen.

`NODE_PATH` is still supported, but is less necessary now that the Node.js
ecosystem has settled on a convention for locating dependent modules.
Sometimes deployments that rely on `NODE_PATH` show surprising behavior
when people are unaware that `NODE_PATH` must be set.  Sometimes a
module's dependencies change, causing a different version (or even a
different module) to be loaded as the `NODE_PATH` is searched.

Additionally, Node.js will search in the following locations:

* 1: `$HOME/.node_modules`
* 2: `$HOME/.node_libraries`
* 3: `$PREFIX/lib/node`

Where `$HOME` is the user's home directory, and `$PREFIX` is Node.js's
configured `node_prefix`.

These are mostly for historic reasons.  **You are highly encouraged
to place your dependencies locally in `node_modules` folders.**  They
will be loaded faster, and more reliably.

## The module wrapper

<!-- type=misc -->

Before a module's code is executed, Node.js will wrap it with a function
wrapper that looks like the following:

```js
(function (exports, require, module, __filename, __dirname) {
// Your module code actually lives in here
});
```

By doing this, Node.js achieves a few things:

- It keeps top-level variables (defined with `var`, `const` or `let`) scoped to
the module rather than the global object.
- It helps to provide some global-looking variables that are actually specific
to the module, such as:
  - The `module` and `exports` objects that the implementor can use to export
  values from the module.
  - The convenience variables `__filename` and `__dirname`, containing the
  module's absolute filename and directory path.

## The `module` Object
<!-- YAML
added: v0.1.16
-->

<!-- type=var -->
<!-- name=module -->

* {Object}

In each module, the `module` free variable is a reference to the object
representing the current module.  For convenience, `module.exports` is
also accessible via the `exports` module-global. `module` isn't actually
a global but rather local to each module.

### module.children
<!-- YAML
added: v0.1.16
-->

* {Array}

The module objects required by this one.

### module.exports
<!-- YAML
added: v0.1.16
-->

* {Object}

The `module.exports` object is created by the Module system. Sometimes this is
not acceptable; many want their module to be an instance of some class. To do
this, assign the desired export object to `module.exports`. Note that assigning
the desired object to `exports` will simply rebind the local `exports` variable,
which is probably not what you want to do.

For example suppose we were making a module called `a.js`

```js
const EventEmitter = require('events');

module.exports = new EventEmitter();

// Do some work, and after some time emit
// the 'ready' event from the module itself.
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```

Then in another file we could do

```js
const a = require('./a');
a.on('ready', () => {
  console.log('module a is ready');
});
```


Note that assignment to `module.exports` must be done immediately. It cannot be
done in any callbacks.  This does not work:

x.js:

```js
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
```

y.js:

```js
const x = require('./x');
console.log(x.a);
```

#### exports shortcut
<!-- YAML
added: v0.1.16
-->

The `exports` variable is available within a module's file-level scope, and is
assigned the value of `module.exports` before the module is evaluated.

It allows a shortcut, so that `module.exports.f = ...` can be written more
succinctly as `exports.f = ...`. However, be aware that like any variable, if a
new value is assigned to `exports`, it is no longer bound to `module.exports`:

```js
module.exports.hello = true; // Exported from require of module
exports = { hello: false };  // Not exported, only available in the module
```

When the `module.exports` property is being completely replaced by a new
object, it is common to also reassign `exports`, for example:

```js
module.exports = exports = function Constructor() {
    // ... etc.
```

To illustrate the behavior, imagine this hypothetical implementation of
`require()`, which is quite similar to what is actually done by `require()`:

```js
function require(...) {
  var module = { exports: {} };
  ((module, exports) => {
    // Your module code here. In this example, define a function.
    function some_func() {};
    exports = some_func;
    // At this point, exports is no longer a shortcut to module.exports, and
    // this module will still export an empty default object.
    module.exports = some_func;
    // At this point, the module will now export some_func, instead of the
    // default object.
  })(module, module.exports);
  return module.exports;
}
```

### module.filename
<!-- YAML
added: v0.1.16
-->

* {String}

The fully resolved filename to the module.

### module.id
<!-- YAML
added: v0.1.16
-->

* {String}

The identifier for the module.  Typically this is the fully resolved
filename.

### module.loaded
<!-- YAML
added: v0.1.16
-->

* {Boolean}

Whether or not the module is done loading, or is in the process of
loading.

### module.parent
<!-- YAML
added: v0.1.16
-->

* {Object} Module object

The module that first required this one.

### module.require(id)
<!-- YAML
added: v0.5.1
-->

* `id` {String}
* Returns: {Object} `module.exports` from the resolved module

The `module.require` method provides a way to load a module as if
`require()` was called from the original module.

Note that in order to do this, you must get a reference to the `module`
object.  Since `require()` returns the `module.exports`, and the `module` is
typically *only* available within a specific module's code, it must be
explicitly exported in order to be used.

[`Error`]: errors.html#errors_class_error
[module resolution]: #modules_all_together
