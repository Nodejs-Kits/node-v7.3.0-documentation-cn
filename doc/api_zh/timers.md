# Timers(定时器)

> Stability: 3 - Locked

`timer`模块为在未来的某个时间点执行的定时函数暴露了一个全局的API。因为timer功能是全局的，所以在使用该API时不需要调用`require('timers')`方法。

Node.js中的timer功能实现了同浏览器提供的定时功能相似的API，但是使用了不同的基于[the Node.js Event Loop][]的内部实现。

## Class: Immediate

该对象是内部创建的，该类的实例通过[`setImmediate()`][]方法返回。可以通过传递该对象到[`clearImmediate()`][]方法来取消预定的动作。

## Class: Timeout

该对象是内部创建的，该类的实例可以通过[`setTimeout()`][]和[`setInterval()`][]方法来获取。可将该类的实例分别传递给[`clearTimeout()`][]或者[`clearInterval()`][]方法来取消预定的动作。

默认情况下，当[`setTimeout()`][]方法或者[`setInterval()`][]方法设置了定时器，只要定时器有效，Node.js事件循环就会一直运行。上面两个方法返回的`Timeout`的实例对象都向外暴露了`timeout.ref()`和`timeout.unref()`两个方法，可以用来控制该默认行为。

### timeout.ref()
<!-- YAML
added: v0.9.1
-->

当被调用时，只要`Timeout`是活跃的，要求Node.js事件循环*不要*退出。多次调用`timeout.ref()`方法是没有效果。

*注意：*默认情况下，所有的`Timeout`对象都是被引用的，平常调用`timeout.ref()`是没有必要的，除非在调用之前调用过`timeout.unref()`方法。

**译注：**当调用了`timeout.unref()`时，当Node.js事件循环要执行该定时器的回调时事件循环就会退出，导致回调永远不会被调用，默认情况下Node.js的事件循环是不会退出的，所以如果没有调用过`timeout.ref()`方法，调用该方法是没有意义的。

返回一个`Timeout`的引用。

### timeout.unref()
<!-- YAML
added: v0.9.1
-->

被调用时，有效的`Timeout`对象不再要求Node.js事件循环有效，即当前这轮事件循环会提前退出。如果没有其他活动使事件循环继续运行，则事件循环程序可能在`Timeout`对象的回调执行之前就退出了。多次调用`timeout.unref()`方法没有效果的。

*注意*：调用`timeout.unref()`方法会产生一个内部的定时器，这个定时器会弱化Node.js的事件循环机制。创建过多的这类定时器会对Node.js应用的性能产生负面影响。

返回一个`Timeout`的引用。

## Scheduling Timers

定时器是Node.js的内部结构，该结构在一个特定的时间点后会调用给定的回调函数。定时器的回调函数什么时候被调用取决于使用什么方法创建定时器以及Node.js事件循环正在处理别的什么工作(**译注：**例如使用`setInterval`方法设置的定时器会每隔一定时间执行一次，而使用`setTimeout`方法在指定时间后只执行一次；如果同时有I/O事件或者`setImmediate()`设置的回调，则依次执行前两个的回调，然后执行`setInterval` or `setTimeout`设置的回调)。

### setImmediate(callback[, ...args])
<!-- YAML
added: v0.9.1
-->

* `callback` {Function} 本轮[the Node.js Event Loop]结束时调用的回调函数
* `...args` {any} 可选参数，当`callback`被调用时传递给`callback`。

设置一个在I/O事件回调之后、[`setTimeout()`][]和[`setInterval()`][]定时器触发之前“立即”执行的`callback`(回调)(**译注：这里的立即是个伪“立即”，第一是因为并不是设置了之后立即执行，第二是要在本轮Node.js事件循环中的第一个I/O事件的回调(如果有的话)结束之后才执行。**)。返回一个`Immediate`类的实例对象用于[`clearImmediate()`][]方法取消该定时器。

当重复多次调用`setImmediate()`函数时，回调函数会以创建的顺序等待执行。该方法设置的回调以链表的形式存储，每次事件循环迭代会处理其中的一个回调。如果一个`immediate`定时器设置的回调处在正在执行的回调中，则这个回调在本轮事件循环中不会触发，直到下一轮事件循环迭代才会被触发。

如果`callback`不是函数，会抛出[`TypeError`][](类型错误)。

### setInterval(callback, delay[, ...args])
<!-- YAML
added: v0.0.1
-->

* `callback` {Function} 定时时间到时被执行的回调函数。
* `delay` {number} `callback`被调用前等待的毫秒数。
* `...args` {any} 可选参数，当`callback`被调用时传递给`callback`。

设置一个每隔`delay`毫秒执行一次`callback`的重复定时器。返回一个`Timeout`类的实例对象用于[`clearInterval()`][]方法取消该定时器。

*注意*：当`delay`的值大于`2147483647`或者小于`1`时，`delay`会被重置为`1`。

如果`callback`不是函数，会抛出[`TypeError`][](类型错误)。

### setTimeout(callback, delay[, ...args])
<!-- YAML
added: v0.0.1
-->

* `callback` {Function} 定时时间到时被执行的回调函数。
* `delay` {number} `callback`被调用前等待的毫秒数。
* `...args` {any} 可选参数，当`callback`被调用时传递给`callback`。

设置一个在等待`delay`毫秒后执行`callback`(回调)的一次性定时器。返回一个`Timeout`类的实例对象用于[`clearTimeout()`][]方法取消该定时器。

`callback`可能不会在精确的`delay`毫秒时调用。Node.js不能保证回调执行的精确时间，也不能保证回调触发的顺序。只能保证回调的调用尽可能接近设置的时间。

*注意*：当`delay`的值大于`2147483647`或者小于`1`时，`delay`会被重置为`1`。

如果`callback`不是函数，会抛出[`TypeError`][](类型错误)。

## Cancelling Timers(取消定时器)

[`setImmediate()`][], [`setInterval()`][], 和 [`setTimeout()`][]方法每次调用分别返回一个表示预定定时器的对象。这些对象可以用来取消定时器，防止它们再次被触发。

### clearImmediate(immediate)
<!-- YAML
added: v0.9.1
-->

* `immediate` {Immediate} [`setImmediate()`][]方法返回的`Immediate`类的实例对象。

用来取消[`setImmediate()`][]方法创建的`Immediate`类的实例对象。

### clearInterval(timeout)
<!-- YAML
added: v0.0.1
-->

* `timeout` {Timeout} [`setInterval()`][]方法返回的`Timeout`类的实例对象。

用来取消[`setInterval()`][]方法创建的`Timeout`的实例对象。

### clearTimeout(timeout)
<!-- YAML
added: v0.0.1
-->

* `timeout` {Timeout} [`setTimeout()`][]方法返回的`Timeout`类的实例对象。

用来取消[`setTimeout()`][]方法创建的`Timeout`对象。


[the Node.js Event Loop]: https://github.com/nodejs/node/blob/master/doc/topics/event-loop-timers-and-nexttick.md
[`TypeError`]: errors.html#errors_class_typeerror
[`clearImmediate()`]: timers.html#timers_clearimmediate_immediate
[`clearInterval()`]: timers.html#timers_clearinterval_timeout
[`clearTimeout()`]: timers.html#timers_cleartimeout_timeout
[`setImmediate()`]: timers.html#timers_setimmediate_callback_args
[`setInterval()`]: timers.html#timers_setinterval_callback_delay_args
[`setTimeout()`]: timers.html#timers_settimeout_callback_delay_args
