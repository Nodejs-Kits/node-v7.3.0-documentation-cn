<div id="toc">
  <h2>Table of Contents</h2>
  <ul>
    <li><span class="stability_undefined"><a
            href="#documentation_about_this_documentation">About this Documentation</a></span>
      <ul>
        <li><span class="stability_undefined"><a
                href="#documentation_stability_index">Stability Index</a></span></li>
        <li><span class="stability_1"><a href="#documentation_json_output">JSON Output</a></span></li>
        <li><span class="stability_undefined"><a href="#documentation_syscalls_and_man_pages">Syscalls and man pages</a></span>
        </li>
      </ul>
    </li>
  </ul>

</div>

<div id="apicontent">
  <h1>About this Documentation<span><a class="mark" href="#documentation_about_this_documentation"
                                       id="documentation_about_this_documentation">#</a></span></h1>
  <!-- type=misc -->
  <p>这些文档的目标是从引用以及理念两个方面系统地阐述Node.js API，每个部分都描述了一个内建模块或者高级理念。</p>
  <p>Where appropriate, property types, method arguments, and the arguments
    provided to event handlers are detailed in a list underneath the topic
    heading.</p>
  <p></p>
	<p>每一个<code>.html</code>文档都一个相关联的<code>.json</code>文档以结构化的方式来描述相同的信息。这个特点是试验性的，主要是为了方便IDEs或者其他工具利用这些文档做一些纲领性的事情。</p>
  <p>每个<code>.html</code>和<code>.json</code>文件都是基于Node.js资源树中<code>doc/api</code>目录下相关联的<code>.md</code>文件生成的。文档由<code>tools/doc/generate.js</code>程序生成。HTML模版保存在<code>doc/template.html</code>中。</p>
  <p>如果在阅读中发现任何错误，请<a href="https://github.com/nodejs/node/issues/new">提交问题</a>或者查看<a href="https://github.com/nodejs/node/blob/master/CONTRIBUTING.md">贡献指南</a>查找如何提交补丁。</p>
  <h2>Stability Index<span><a class="mark" href="#documentation_stability_index"
                              id="documentation_stability_index">#</a></span></h2>
  <!--type=misc-->
  <p>Throughout the documentation, you will see indications of a section&#39;s
    stability. The Node.js API is still somewhat changing, and as it
    matures, certain parts are more reliable than others. Some are so
    proven, and so relied upon, that they are unlikely to ever change at
    all. Others are brand new and experimental, or known to be hazardous
    and in the process of being redesigned.</p>
  <p>The stability indices are as follows:</p>
<pre class="api_stability api_stability_0">Stability: 0 - Deprecated
This feature is known to be problematic, and changes are
planned.  Do not rely on it.  Use of the feature may cause warnings.  Backwards
compatibility should not be expected.</pre><pre class="api_stability api_stability_1">Stability: 1 - Experimental
This feature is subject to change, and is gated by a command line flag.
It may change or be removed in future versions.</pre><pre class="api_stability api_stability_2">Stability: 2 - Stable
The API has proven satisfactory. Compatibility with the npm ecosystem
is a high priority, and will not be broken unless absolutely necessary.</pre><pre class="api_stability api_stability_3">Stability: 3 - Locked
Only fixes related to security, performance, or bug fixes will be accepted.
Please do not suggest API changes in this area; they will be refused.</pre>
  <h2>JSON Output<span><a class="mark" href="#documentation_json_output" id="documentation_json_output">#</a></span>
  </h2>
  <pre class="api_stability api_stability_1">Stability: 1 - Experimental</pre>
  <p>Every HTML file in the markdown has a corresponding JSON file with the
    same data.</p>
  <p>This feature was added in Node.js v0.6.12. It is experimental.</p>
  <h2>Syscalls and man pages<span><a class="mark" href="#documentation_syscalls_and_man_pages"
                                     id="documentation_syscalls_and_man_pages">#</a></span></h2>
  <p>System calls like <a href="http://man7.org/linux/man-pages/man2/open.2.html">open(2)</a> and <a
          href="http://man7.org/linux/man-pages/man2/read.2.html">read(2)</a> define the interface between user
    programs
    and the underlying operating system. Node functions which simply wrap a syscall,
    like <code>fs.open()</code>, will document that. The docs link to the corresponding man
    pages (short for manual pages) which describe how the syscalls work.</p>
  <p><strong>Caveat:</strong> some syscalls, like <a href="http://man7.org/linux/man-pages/man2/lchown.2.html">lchown(2)</a>,
    are BSD-specific. That means, for
    example, that <code>fs.lchown()</code> only works on Mac OS X and other BSD-derived systems,
    and is not available on Linux.</p>
  <p>Most Unix syscalls have Windows equivalents, but behavior may differ on Windows
    relative to Linux and OS X. For an example of the subtle ways in which it&#39;s
    sometimes impossible to replace Unix syscall semantics on Windows, see <a
            href="https://github.com/nodejs/node/issues/4760">Node
      issue 4760</a>.</p>

</div>
