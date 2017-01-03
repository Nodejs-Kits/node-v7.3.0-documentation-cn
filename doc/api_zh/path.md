# Path

> Stability: 2 - Stable

`path`模块提供了处理文件和目录路径的使用工具。可以通过下面的方式获取：

```js
const path = require('path');
```

## Windows vs. POSIX

`path`模块的默认操作因运行Node.js应用程序的操作系统而异。具体来说，当在Windows操作系统上运行时，`path`模块将假设正在使用Windows样式的路径。

例如，使用带有Windows文件路径`C:\temp\myfile.html`的`path.basename()`方法时，在POSIX上运行时将产生和Windows上运行时不同的结果。

在POSIX系统上运行:

```js
path.basename('C:\\temp\\myfile.html');
// Returns: 'C:\\temp\\myfile.html'
```

在Windows系统上运行:

```js
path.basename('C:\\temp\\myfile.html');
// Returns: 'myfile.html'
```

为了在任何操作系统上使用Windows文件路径获得一致的结果，使用[`path.win32`][]：

POSI和Windows:

```js
path.win32.basename('C:\\temp\\myfile.html');
// Returns: 'myfile.html'
```

为了在任何操作系统上使用POSIX文件路径获得一致的结果，使用[`path.posix`][]：

POSI和Windows:

```js
path.posix.basename('/tmp/myfile.html');
// Returns: 'myfile.html'
```

## path.basename(path[, ext])
<!-- YAML
added: v0.1.25
-->

* `path` {String}
* `ext` {String} 可选的文件扩展名
* Returns: {String}

`path.basename()`方法返回一个`path`的最后一部分，类似于Unix中的`basename`命令。

例如:

```js
path.basename('/foo/bar/baz/asdf/quux.html')
// Returns: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html')
// Returns: 'quux'
```

如果`path`不是字符串，或者传递了参数`ext`但不是字符串类型的，Node.js将会抛出一个[`TypeError`][]错误。

## path.delimiter
<!-- YAML
added: v0.9.3
-->

* {String}

返回每个平台特定的路径分隔符：

* `;` for Windows
* `:` for POSIX

例如,在POSIX系统中:

```js
console.log(process.env.PATH)
// Prints: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter)
// Returns: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```

在Windows系统中:

```js
console.log(process.env.PATH)
// Prints: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter)
// Returns: ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```

## path.dirname(path)
<!-- YAML
added: v0.1.16
-->

* `path` {String}
* Returns: {String}

`path.dirname()`方法返回`path`的目录名字，类似于Unix中的`dirname`命令。

例如:

```js
path.dirname('/foo/bar/baz/asdf/quux')
// Returns: '/foo/bar/baz/asdf'
```

如果实参`path`不是字符串，将会抛出一个[`TypeError`][]错误。

## path.extname(path)
<!-- YAML
added: v0.1.25
-->

* `path` {String}
* Returns: {String}

`path.extname()`方法返回`path`的扩展名，从`.`(句点)最后一次出现的位置到`path`字符串的最后。如果`path`的最后部分(basename)没有`.`，或者`path`的basename(see `path.basename()`)是`.`，将会返回一个空的字符串。

例如:

```js
path.extname('index.html')
// Returns: '.html'

path.extname('index.coffee.md')
// Returns: '.md'

path.extname('index.')
// Returns: '.'

path.extname('index')
// Returns: ''

path.extname('.index')
// Returns: ''
```

如果`path`不是字符串类型则会抛出一个[`TypeError`][]错误。

## path.format(pathObject)
<!-- YAML
added: v0.11.15
-->

* `pathObject` {Object}
  * `dir` {String}
  * `root` {String}
  * `base` {String}
  * `name` {String}
  * `ext` {String}
* Returns: {String}

`path.format()`方法解析给定的路径对象返回一个路径字符串。这是[`path.parse()`][]的逆过程。

当向`pathObject`提供属性时，记住在解析生成返回值时有一个属性相对于另外一个具有更高优先级的特点。

* 如果提供了`pathObject.dir`，`pathObject.root`将被忽略
* 如果`pathObject.base`存在，`pathObject.ext`和`pathObject.name`将被忽略

例如,在POSIX系统中:

```js
// If `dir`, `root` and `base` are provided,
// `${dir}${path.sep}${base}`
// will be returned. `root` is ignored.
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt'
});
// Returns: '/home/user/dir/file.txt'

// `root` will be used if `dir` is not specified.
// If only `root` is provided or `dir` is equal to `root` then the
// platform separator will not be included. `ext` will be ignored.
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored'
});
// Returns: '/file.txt'

// `name` + `ext` will be used if `base` is not specified.
path.format({
  root: '/',
  name: 'file',
  ext: '.txt'
});
// Returns: '/file.txt'
```

在Windows系统中:

```js
path.format({
  dir : "C:\\path\\dir",
  base : "file.txt"
});
// Returns: 'C:\\path\\dir\\file.txt'
```

## path.isAbsolute(path)
<!-- YAML
added: v0.11.2
-->

* `path` {String}
* Returns: {Boolean}

`path.isAbsolute()`方法用来判断一个`path`是否是绝对路径。

如果给定的`path`是空字符串，则返回`false`。

例如，在POSIX系统中:

```js
path.isAbsolute('/foo/bar') // true
path.isAbsolute('/baz/..')  // true
path.isAbsolute('qux/')     // false
path.isAbsolute('.')        // false
```

在Windows系统中:

```js
path.isAbsolute('//server')    // true
path.isAbsolute('\\\\server')  // true
path.isAbsolute('C:/foo/..')   // true
path.isAbsolute('C:\\foo\\..') // true
path.isAbsolute('bar\\baz')    // false
path.isAbsolute('bar/baz')     // false
path.isAbsolute('.')           // false
```

如果`path`不是字符串，将抛出一个[`TypeError`][]错误。

## path.join([...paths])
<!-- YAML
added: v0.1.16
-->

* `...paths` {String} 一系列路径段，详见例子
* Returns: {String}

`path.join()`方法使用平台特定分隔符作为路径分隔符将所有给定的`path`片段连接在一起，然后规范化连接后的路径。

空的`path`片段将被忽略。如果连接后的路径字符串是空字符串，将会返回`'.'`，代表当前的工作路径。

例:

```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')
// Returns: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar')
// throws TypeError: Arguments to path.join must be strings
```

如果任意一个路径段不是字符串，将抛出一个[`TypeError`][]错误。

## path.normalize(path)
<!-- YAML
added: v0.1.23
-->

* `path` {String}
* Returns: {String}

`path.normalize()`方法规范给定的`path`，同时解析`'..'`和`'.'`片段。

当路径段中存在多个分割符时（例如，POSIX中的`/`和Windows中的`\`)，它们将会被平台特定的路径段分隔符的单个实例替换。尾随分隔符(路径最后的路径分隔符)将被保留。

如果`path`是一个空字符串，返回值为`'.'`，表示当前的工作路径。

例，在POSIX系统中:

```js
path.normalize('/foo/bar//baz/asdf/quux/..')
// Returns: '/foo/bar/baz/asdf'
```

在Windows系统中:

```js
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Returns: 'C:\\temp\\foo\\'
```

如果`path`不是字符串，将返回一个[`TypeError`][]错误。

## path.parse(path)
<!-- YAML
added: v0.11.15
-->

* `path` {String}
* Returns: {Object}

`path.parse()`方法返回一个对象，该对象的属性表示`path`的重要元素。

返回值对象有如下属性：

* `root` {String}
* `dir` {String}
* `base` {String}
* `ext` {String}
* `name` {String}

例如，在POSIX系统中:

```js
path.parse('/home/user/dir/file.txt')
// Returns:
// {
//    root : "/",
//    dir : "/home/user/dir",
//    base : "file.txt",
//    ext : ".txt",
//    name : "file"
// }
```

```text
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(“”行中的所有空格都应被忽略 -- 它们只是为了格式化)
```

在Windows系统中:

```js
path.parse('C:\\path\\dir\\file.txt')
// Returns:
// {
//    root : "C:\\",
//    dir : "C:\\path\\dir",
//    base : "file.txt",
//    ext : ".txt",
//    name : "file"
// }
```

```text
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(“”行中的所有空格都应被忽略 -- 它们只是为了格式化)
```

如果`path`不是字符串，将会返回一个[`TypeError`][]错误。

## path.posix
<!-- YAML
added: v0.11.15
-->

* {Object}

The `path.posix` property provides access to POSIX specific implementations
of the `path` methods.

## path.relative(from, to)
<!-- YAML
added: v0.5.0
-->

* `from` {String}
* `to` {String}
* Returns: {String}

The `path.relative()` method returns the relative path from `from` to `to`.
If `from` and `to` each resolve to the same path (after calling `path.resolve()`
on each), a zero-length string is returned.

If a zero-length string is passed as `from` or `to`, the current working
directory will be used instead of the zero-length strings.

For example on POSIX:

```js
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')
// Returns: '../../impl/bbb'
```

On Windows:

```js
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb')
// Returns: '..\\..\\impl\\bbb'
```

A [`TypeError`][] is thrown if neither `from` nor `to` is a string.

## path.resolve([...paths])
<!-- YAML
added: v0.3.4
-->

* `...paths` {String} A sequence of paths or path segments
* Returns: {String}

The `path.resolve()` method resolves a sequence of paths or path segments into
an absolute path.

The given sequence of paths is processed from right to left, with each
subsequent `path` prepended until an absolute path is constructed.
For instance, given the sequence of path segments: `/foo`, `/bar`, `baz`,
calling `path.resolve('/foo', '/bar', 'baz')` would return `/bar/baz`.

If after processing all given `path` segments an absolute path has not yet
been generated, the current working directory is used.

The resulting path is normalized and trailing slashes are removed unless the
path is resolved to the root directory.

Zero-length `path` segments are ignored.

If no `path` segments are passed, `path.resolve()` will return the absolute path
of the current working directory.

For example:

```js
path.resolve('/foo/bar', './baz')
// Returns: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/')
// Returns: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')
// if the current working directory is /home/myself/node,
// this returns '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

A [`TypeError`][] is thrown if any of the arguments is not a string.

## path.sep
<!-- YAML
added: v0.7.9
-->

* {String}

Provides the platform-specific path segment separator:

* `\` on Windows
* `/` on POSIX

For example on POSIX:

```js
'foo/bar/baz'.split(path.sep)
// Returns: ['foo', 'bar', 'baz']
```

On Windows:

```js
'foo\\bar\\baz'.split(path.sep)
// Returns: ['foo', 'bar', 'baz']
```

## path.win32
<!-- YAML
added: v0.11.15
-->

* {Object}

The `path.win32` property provides access to Windows-specific implementations
of the `path` methods.

*Note*: On Windows, both the forward slash (`/`) and backward slash (`\`)
characters are accepted as path delimiters; however, only the backward slash
(`\`) will be used in return values.

[`path.posix`]: #path_path_posix
[`path.win32`]: #path_path_win32
[`path.parse()`]: #path_path_parse_path
[`TypeError`]: errors.html#errors_class_typeerror
