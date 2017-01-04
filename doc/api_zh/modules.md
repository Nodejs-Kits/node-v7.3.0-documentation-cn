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

注意：如果由`package.json`的`"main"`条目指定的文件丢失，无法解析，Node.js会认为整个模块丢失，并报一个默认错误：

```txt
Error: Cannot find module 'some-library'
```

如果在目录中没有package.json文件，然后Node.js会尝试从该目录中加载`index.js`或者`index.node文件`。例如，如果上面的例子中没有package.json文件，那么`require('./some-library')`将会试图加载：

* `./some-library/index.js`
* `./some-library/index.node`

## Loading from `node_modules` Folders

<!--type=misc-->

如果传递给`require()`方法的模块标识符既不是核心模块[core](#modules_core_modules)，也不以`'/'`, `'../'`,或`'./'`开头，那么Node.js会从当前模块的父目录开始，在其后添加`/node_modules`，然后尝试从该位置加载模块。Node.js不会在以`node_modules`结尾的路径上添加`node_modules`。

如果模块没有找到，Node.js会移动到父目录中查找，以此类推，直到文件系统的根目录。

例如，如果`'/home/ry/projects/foo.js'`文件调用了`require('bar.js')`，Node.js将会依次在下面的路径中查找：

* `/home/ry/projects/node_modules/bar.js`
* `/home/ry/node_modules/bar.js`
* `/home/node_modules/bar.js`
* `/node_modules/bar.js`

这允许程序本地化他们的依赖，使它们不冲突。

你可以通过在模块名后添加路径后缀来请求指定的文件或者发布在一个模块中的子模块。例如，`require('example-module/path/to/file')`将会相对于`example-module`的位置解析`path/to/file`。添加了后缀的路径遵循相同的模块解析语义。

## Loading from the global folders(从全局目录加载)

<!-- type=misc -->

当环境变量`NODE_PATH`被设置成一个冒号分隔的绝对路径列表，如果在别的地方没有找到模块，Node.js会在`NODE_PATH`声明的路径中查找这些模块。(注意：在Windows中，`NODE_PATH`使用分号做分隔符)

在现在的模块解析[module resolution][]算法锁定之前，`NODE_PATH`在最初设计时支持从不同的路径加载模块。

Node.js仍然支持`NODE_PATH`，但是没有那么必要了，Node.js的生态系统已经建立了定位依赖模块的惯例。当大家不知道必须设置`NODE_PATH`时，有时依赖`NODE_PATH`的部署会有奇怪的表现。有时一个模块的依赖改变了，由于搜索了`NODE_PATH`中的路径，会导致不同版本的模块(甚至不同的模块)被加载。

此外，Node.js还将从下面的路径中查找：

* 1: `$HOME/.node_modules`
* 2: `$HOME/.node_libraries`
* 3: `$PREFIX/lib/node`

`$HOME`是用户的家目录，`$PREFIX`是Node.js配置的`node_prefix`。

上面情况的产生有其历史原因。**我们强烈建议将你的依赖放在`node_modules`目录中**，这样加载更快，也更可靠。

## The module wrapper

<!-- type=misc -->

在一个模块的代码执行之前，Node.js将会使用一个类似于下面的函数包裹层将代码包裹起来：

```js
(function (exports, require, module, __filename, __dirname) {
// Your module code actually lives in here
});
```

通过这样做，Node.js可以实现下面几件事情：

- 它将顶级变量(通过`var`, `const`或`let`关键字声明)的作用域限制在模块中而不会泄漏到全局对象
- 它帮助提供看来是全局变量实际上是具体到模块的变量，例如
  - `module`和`exports`对象的实例可用来从模块中导出值(values，指模块中所有可导出的东西)
  - 便利的`__filename`和`__dirname`变量，包含了模块的绝对文件名和绝对文件路径

## The `module` Object
<!-- YAML
added: v0.1.16
-->

<!-- type=var -->
<!-- name=module -->

* {Object}

在每个模块中，`module`这个自由变量都是代表当前模块的对象的引用。为了方便，`module.exports`也可以通过`exports`获取。`module`并不是真正的全局变量，而是定位在每个模块中的。

### module.children
<!-- YAML
added: v0.1.16
-->

* {Array}

当前模块需要的模块对象。

### module.exports
<!-- YAML
added: v0.1.16
-->

* {Object}

`module.exports`对象是模块系统创建的。有时这是不可接受的；许多人想要他们的模块是一个类的实例。为了实现这个需求，将想要导出的地嗅香赋值给`module.exports`。注意，将想要的导出的对象赋值给`exports`只会简单的重新绑定`exports`变量的指向，这可能不是你想要的。

**译注：真正指向模块本身导出项的是`module.exports`，而`exports`只是指向`module.exports`，所以如果只是简单的将一个对象赋值给`exports`变量，那么只是将`exports`变量指向了别的对象，而`module.exports`的指向还是当前模块的导出，所以该模块的导出项为空。**

例，假设我们正在创建一个`a.js`的模块

```js
const EventEmitter = require('events');

module.exports = new EventEmitter();

// Do some work, and after some time emit
// the 'ready' event from the module itself.
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```

在另外一个文件中：

```js
const a = require('./a');
a.on('ready', () => {
  console.log('module a is ready');
});
```

注意，`module.exports`的赋值必须立即完成。不能在任何回调中做这项工作，下面的例子不会工作：

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

#### exports shortcut(快捷方式)
<!-- YAML
added: v0.1.16
-->

`exports`变量只在模块的文件级范围内可用，并且在在模块被执行之前就被赋予了`module.exports`的值。

`module`允许一个快捷方式，以便于`module.exports.f = ...`可以更简洁地写为`exports.f = ...`。但是，需要注意的是，像其他所有的变量一样，如果`exports`被赋了新值，它将不再和`module.exports`绑定(译注：即`exports`将指向别的内存空间，而不再和`module.exports`指向同一块内存空间，所以建议在调用的时候使用`exports`，在赋值的时候使用`module.exports`)。

```js
module.exports.hello = true; // 在被需要(`require`)时导出
exports = { hello: false };  // 不会被导出，只在该模块中有效，外部无法访问
```

当`module.exports`属性被一个新对象完全替换时，通常也会重新给`exports`赋值，例如：

```js
module.exports = exports = function Constructor() {
    // ... etc.
```

为了说明这种行为，想象这种假想的`require()`实现，实际上它和`require()`的行为是相似的。

```js
function require(...) {
  var module = { exports: {} };
  ((module, exports) => {
    // 模块代码写在这里。在这个例子中，定义一个方法
    function some_func() {};
    exports = some_func;
    // 这时，exports不再是module.exports的快捷方式，该模块仍然导出一个空的默认对象
    module.exports = some_func;
    // 这时，模块将导出some_func，不再是默认对象。
  })(module, module.exports);
  return module.exports;
}
```

### module.filename
<!-- YAML
added: v0.1.16
-->

* {String}

模块完全解析后的文件名。

### module.id
<!-- YAML
added: v0.1.16
-->

* {String}

模块标识符。通常是完全解析后的文件名。

### module.loaded
<!-- YAML
added: v0.1.16
-->

* {Boolean}

模块是否完成加载，或是正在加载中。

### module.parent
<!-- YAML
added: v0.1.16
-->

* {Object} Module object

第一次请求加载该模块的模块。

### module.require(id)
<!-- YAML
added: v0.5.1
-->

* `id` {String}
* Returns: {Object} 解析后的模块中的`module.exports`

`module.require`方法提供了模仿从原始模块中调用`require()`加载模块的方法。

注意，为了这样做，你必须获取`module`对象的引用。因为`require()`方法返回`module.exports`，并且`module`通常只在特定的模块代码中可用，所以它(`module`)必须显示导出以便使用。

**译注：注意查看前面的文档，在模块中`module`对象指向模块本身。**

[`Error`]: errors.html#errors_class_error
[module resolution]: #modules_all_together
