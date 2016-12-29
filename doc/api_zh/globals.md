# 全局对象

<!-- type=misc -->

全局对象在所有模块中都是可用的，无需require。需要注意的是 -- 全局对象中的一部分对象并不是真的在全局作用域中，而是在模块的作用域中。

这里列出的对象都是特指Node.js中的对象。一些[内建对象][]是JavaScript语言的一部分，可以在全局作用域中调用。

## Class: Buffer
<!-- YAML
added: v0.1.103
-->

<!-- type=global -->

* {Function}

用来操作二进制数据。详情查看[buffer section][]。

## \_\_dirname
<!-- YAML
added: v0.1.27
-->

<!-- type=var -->

* {String}

当前执行脚本所在目录的名字。

示例: 在`/Users/tx`目录下执行`node example.js`

```js
console.log(__dirname);
// Prints: /Users/tx
```

`__dirname` isn't actually a global but rather local to each module.

`__dirname`并非是真正的全局属性，每一个模块都有一个局部的`__dirname`。

例如，有两个模块：`a` 和 `b`，模块`b`是模块`a`的依赖；目录结构如下：

* `/Users/tx/app/a.js`
* `/Users/tx/app/node_modules/b/b.js`

在`b.js`中调用`__dirname`会返回`/Users/tx/app/node_modules/b`，而在`a.js`中调用`__dirname`返回`/Users/tx/app`。

## \_\_filename
<!-- YAML
added: v0.0.1
-->

<!-- type=var -->

* {String}

当前执行代码所在文件的文件名。是当前执行代码所在文件解析后的绝对路径。对于一个主函数来说，该对象的值并不一定同在命令行中使用时一样(**译注：**例如，可以使用```node example.js```命令来执行```example.js```文件, 也可以通过```node example```命令来执行```example.js```文件)。在模块中调用此对象返回的值为该模块的绝对路径。

示例: 在`/Users/tx`目录下执行`node example.js`命令：

```js
console.log(__filename);
// Prints: /Users/tx/example.js
```

同`__dirname`，`__filename`并不是一个真正的全局属性，每一个模块都有一个局部的`__filename`。

## clearImmediate(immediateObject)
<!-- YAML
added: v0.9.1
-->

<!--type=global-->

[`clearImmediate`]在[timers][](定时器)部分有详细描述。

## clearInterval(intervalObject)
<!-- YAML
added: v0.0.1
-->

<!--type=global-->

[`clearInterval`]在[timers][](定时器)部分有详细描述。

## clearTimeout(timeoutObject)
<!-- YAML
added: v0.0.1
-->

<!--type=global-->

[`clearTimeout`]在[timers][](定时器)部分有详细描述。

## console
<!-- YAML
added: v0.1.100
-->

<!-- type=global -->

* {Object}

用来打印信息到标准输出和标准错误。详情请查看[`console`][]部分。

## exports
<!-- YAML
added: v0.1.12
-->

<!-- type=var -->

`module.exports`属性的引用，方便拼写。`exports`和`module.exports`在什么情况下使用以及区别请查阅[module system documentation][]部分的文档。

`exports`并不是真正的全局属性，而是每个模块的局部属性。

详情请查阅[module system documentation][]部分的文档。

## global
<!-- YAML
added: v0.1.27
-->

<!-- type=global -->

* {Object} The global namespace object(全局命名空间对象).

在浏览器中，顶级作用域是全局作用域。就是说如果你在浏览器的全局作用域中写`var something`，会定义一个全局变量。但是在Node.js中，顶级作用域不是全局作用域；在一个Node.js模块中声明`var something`，则该变了被声明为这个模块的局部变量。

## module
<!-- YAML
added: v0.1.16
-->

<!-- type=var -->

* {Object}

对当前模块的引用。`module.exports`特别是用来定义一个模块的导出项以及使导出项可通过`require()`方法使用。

`module`并不是真正的全局对象，而是属于每一个模块的局部变量(或者说是对象)。

更多信息请查阅[module system documentation][]部分的文档。

## process
<!-- YAML
added: v0.1.7
-->

<!-- type=global -->

* {Object}

process对象。详情请查阅[`process` object][]部分的文档。

## require()
<!-- YAML
added: v0.1.13
-->

<!-- type=var -->

* {Function}

用来引入模块，详情请查看[Modules][]部分的文档。`require`并不是真正的全局对象，而是属于每个模块的局部变量。

### require.cache
<!-- YAML
added: v0.3.0
-->

* {Object}

模块在被引用时缓存在该对象中。通过删除该对象中的键值对，下一次`require`时会重新加载该模块。注意，该方法不适用于[native addons][]，重新加载会导致错误。

### require.extensions
<!-- YAML
added: v0.3.0
deprecated: v0.10.6
-->

> Stability: 0 - Deprecated

* {Object}

指导`require`如何处理特定后缀的文件。

将`.sjs`后缀的文件当作`.js`后缀的文件来处理：

```js
require.extensions['.sjs'] = require.extensions['.js'];
```

**Deprecated** 原来，这个方法用来将非Javascript模块按需编译加载进Node.js中。然而，在实践中，有更好的办法来做这件事情，比如说通过其他Node.js程序加载，或者提前编译进JavaScript中。

由于模块系统现在的状态是锁定的(locked)，所以这个特性可能不会移除。这个特性可能会导致奇怪的或者复杂的bug，所以最好不要使用。

需要注意的是：模块系统解析一个`require(...)`语句为文件名的过程中必须执行的文件系统操作数与注册扩展名的数量成线性比例。(**译注：即要注册的扩展名越多，模块系统要解析道文件系统操作数就越多，注册的扩展名越多，文件操作越多，性能越差。**)

添加新的扩展名会拖慢模块加载器，所以不推荐使用。

### require.resolve()
<!-- YAML
added: v0.3.0
-->

使用内置的`require()`机制查找模块的位置，但是并不会加载模块，而是返回解析后的文件名。

## setImmediate(callback[, ...args])
<!-- YAML
added: v0.9.1
-->

<!-- type=global -->

[`setImmediate`]在[timers][](定时器)部分有详细描述。

## setInterval(callback, delay[, ...args])
<!-- YAML
added: v0.0.1
-->

<!-- type=global -->

[`setInterval`]在[timers][](定时器)部分有详细描述。

## setTimeout(callback, delay[, ...args])
<!-- YAML
added: v0.0.1
-->

<!-- type=global -->

[`setTimeout`]在[timers][](定时器)部分有详细描述。

[`console`]: console.html
[`process` object]: process.html#process_process
[buffer section]: buffer.html
[module system documentation]: modules.html
[Modules]: modules.html#modules_modules
[native addons]: addons.html
[timers]: timers.html
[`clearImmediate`]: timers.html#timers_clearimmediate_immediate
[`clearInterval`]: timers.html#timers_clearinterval_timeout
[`clearTimeout`]: timers.html#timers_cleartimeout_timeout
[`setImmediate`]: timers.html#timers_setimmediate_callback_args
[`setInterval`]: timers.html#timers_setinterval_callback_delay_args
[`setTimeout`]: timers.html#timers_settimeout_callback_delay_args
[内建对象]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
